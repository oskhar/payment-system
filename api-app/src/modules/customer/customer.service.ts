import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { GetAccumulatedBalance } from './provider/get-accumulated-balance';
import { RfidGateway } from './gateway/rfid.gateway';
import { FilterDataDto } from 'src/common/api/dto/pagination.dto';
import { IdsDto } from 'src/common/api/dto/ids.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly getAccumulatedBalance: GetAccumulatedBalance,
    private readonly rfidGateway: RfidGateway,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const customer = new Customer(createCustomerDto);
    await this.customerRepository.save(customer);
  }

  async findAll(filter: FilterDataDto, endpoint: string) {
    const whereClause = [];

    if (filter.search)
      whereClause.push({
        name: Like(`%${filter.search}%`),
      });

    const skip = (filter.page - 1) * filter.limit;

    const [customers, total] = await this.customerRepository.findAndCount({
      where: whereClause,
      take: filter.limit,
      skip: skip,
      order: { [filter.sort_by]: filter.sort_type },
    });

    const result = [];

    for (const customer of customers) {
      result.push({
        ...customer,
        balance: await this.getAccumulatedBalance.execute(customer.id),
      });
    }

    const createUrl = (page: number) =>
      `${endpoint}?search=${filter.search || ''}&limit=${filter.limit}&page=${page}&sort_by=${filter.sort_by}&sort_type=${filter.sort_type}`;

    return {
      customers: result,
      pagination: {
        total,
        page: filter.page,
        limit: filter.limit,
        total_page: Math.ceil(total / filter.limit),
        links: {
          first: filter.page > 1 ? createUrl(1) : null,
          prev: filter.page > 1 ? createUrl(filter.page - 1) : null,
          next: filter.page < total ? createUrl(filter.page + 1) : null,
          last: filter.page < total ? createUrl(total) : null,
        },
      },
    };
  }

  async findOne(id: number) {
    return {
      customer: await this.customerRepository.findOne({ where: { id } }),
    };
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer)
      throw new UnprocessableEntityException('Customer no was found');

    Object.assign(customer, updateCustomerDto);

    await this.customerRepository.save(customer);
  }

  async remove(data: IdsDto) {
    for (const id of data.ids) {
      const customer = await this.customerRepository.findOne({ where: { id } });
      if (!customer) {
        throw new UnprocessableEntityException('Customer not found');
      }
      await this.customerRepository.delete(id);
    }
  }

  async waitingScan(id: number) {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) throw new UnprocessableEntityException('Customer not found');

    customer.is_waiting_scan = true;
    await this.customerRepository.save(customer);
  }

  async stopScan() {
    const customer = await this.customerRepository.findOneBy({
      is_waiting_scan: true,
    });

    if (!customer) return;

    customer.is_waiting_scan = false;
    await this.customerRepository.save(customer);
  }

  async rfidScan(uid: string) {
    const customer = await this.customerRepository.findOneBy({
      is_waiting_scan: true,
    });

    if (!customer)
      throw new UnprocessableEntityException('No customer is waiting for scan');

    customer.uid_card = uid;
    customer.is_waiting_scan = false;

    await this.customerRepository.save(customer);

    // Kirim update ke frontend secara real-time
    this.rfidGateway.sendScanUpdate(customer.id, uid);
  }
}
