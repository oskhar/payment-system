import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { In, Repository } from 'typeorm';
import { ImageUploadProvider } from '../../config/multer/image/providers/image-upload.provider';
import { GetAccumulatedStock } from './providers/get-accumulated-stock';
import { IdsDto } from 'src/common/api/dto/ids.dto';
import { UnprocessableEntityException } from '@nestjs/common';
import { ItemCategory } from './entities/item-category.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { ItemPrices } from './entities/item-prices.entity';
import { FilterDataDto } from 'src/common/api/dto/pagination.dto';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(ItemCategory)
    private readonly itemCategoryRepository: Repository<ItemCategory>,
    @InjectRepository(ItemPrices)
    private readonly itemPriceRepository: Repository<ItemPrices>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly imageUploadProvider: ImageUploadProvider,
    private readonly getAccumulatedStock: GetAccumulatedStock,
  ) {}

  async create(
    createItemDto: CreateItemDto,
    file?: Express.Multer.File,
  ): Promise<Item> {
    // Ambil data mentah dari DTO
    const {
      item_prices: rawItemPrices,
      categories: rawCategories,
      ...itemData
    } = createItemDto;

    let parsedCategories: number[];
    let parsedItemPrices: { price: number; min_quantity: number }[];

    try {
      // =================================================================
      // PERBAIKAN: Parsing Defensif di dalam Service
      // =================================================================
      // Pastikan 'categories' adalah array, parse jika string.
      parsedCategories =
        typeof rawCategories === 'string'
          ? JSON.parse(rawCategories)
          : rawCategories;

      // Pastikan 'item_prices' adalah array, parse jika string.
      parsedItemPrices =
        typeof rawItemPrices === 'string'
          ? JSON.parse(rawItemPrices)
          : rawItemPrices;

      // Lakukan validasi tipe data setelah parsing
      if (
        !Array.isArray(parsedCategories) ||
        !Array.isArray(parsedItemPrices)
      ) {
        throw new Error(
          'Data kategori atau harga bukan merupakan array yang valid.',
        );
      }
    } catch (e) {
      throw new BadRequestException(
        'Format data kategori atau harga tidak valid (bukan JSON yang benar).',
      );
    }

    try {
      // 1. Validasi semua kategori (sekarang menggunakan data yang sudah diparsing)
      for (const categoryId of parsedCategories) {
        const categoryExists = await this.categoryRepository.findOneBy({
          id: Number(categoryId),
        }); // Tambahkan Number() untuk keamanan
        if (!categoryExists) {
          throw new UnprocessableEntityException(
            `Kategori dengan ID ${categoryId} tidak ditemukan.`,
          );
        }
      }

      // 2. Upload gambar jika ada
      let imageUrl: string | null = null;
      if (file) {
        imageUrl = await this.imageUploadProvider.uploadImage(file);
      }

      // 3. Membuat dan menyimpan entitas Item utama
      const newItem = this.itemRepository.create({
        ...itemData,
        image_url: imageUrl,
      });
      const savedItem = await this.itemRepository.save(newItem);

      // 4. Menyimpan entitas ItemPrice terkait
      for (const priceDto of parsedItemPrices) {
        const newItemPrice = this.itemPriceRepository.create({
          item_id: savedItem.id,
          price: priceDto.price,
          min_quantity: priceDto.min_quantity,
        });
        await this.itemPriceRepository.save(newItemPrice);
      }

      // 5. Menyimpan entitas ItemCategory terkait
      for (const categoryId of parsedCategories) {
        const newItemCategory = this.itemCategoryRepository.create({
          item_id: savedItem.id,
          category_id: categoryId,
        });
        await this.itemCategoryRepository.save(newItemCategory);
      }

      // 6. Mengambil kembali data item lengkap untuk di-return
      return this.itemRepository.findOne({
        where: { id: savedItem.id },
        relations: [
          'item_prices',
          'item_categories',
          'item_categories.category',
        ],
      });
    } catch (error) {
      if (
        error instanceof UnprocessableEntityException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Gagal membuat item karena kesalahan server.',
        error.message,
      );
    }
  }

  async findAll(filterData: FilterDataDto) {
    // Destructuring nilai dari DTO, dengan nilai default jika tidak ada
    const { page = 1, limit = 10 } = filterData;
    const skip = (page - 1) * limit;

    // Menggunakan findAndCount untuk mendapatkan item dan totalnya sekaligus
    const [items, totalItems] = await this.itemRepository.findAndCount({
      relations: ['item_categories', 'item_categories.category', 'item_prices'],
      skip: skip, // Melewatkan item dari halaman sebelumnya
      take: limit, // Mengambil item sejumlah limit per halaman
    });

    const result = [];
    for (const row of items) {
      // Mengurutkan harga, sama seperti kode sebelumnya
      if (row.item_prices && Array.isArray(row.item_prices)) {
        row.item_prices.sort((a, b) => a.min_quantity - b.min_quantity);
      }

      result.push({
        ...row,
        categories: row.item_categories.map((itemCategory) => ({
          id: itemCategory.category.id,
          name: itemCategory.category.name,
        })),
        stock: await this.getAccumulatedStock.execute(row.id),
      });
    }

    // Menghitung total halaman
    const totalPages = Math.ceil(totalItems / limit);

    // Mengembalikan data dengan format paginasi
    return {
      items: result,
      meta: {
        totalItems,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  async findOne(id: number) {
    return await this.itemRepository.findOneBy({ id });
  }

  /**
   * Memperbarui item yang ada. Metode ini dirancang untuk menerima DTO yang sudah divalidasi
   * dan di-transform oleh ZodValidationPipe, termasuk data dari multipart/form-data.
   * @param id ID dari item yang akan diperbarui.
   * @param updateItemDto Data baru untuk item.
   * @param file File gambar baru (opsional).
   * @returns Entitas Item yang sudah diperbarui.
   */
  async update(
    id: number,
    updateItemDto: UpdateItemDto,
    file?: Express.Multer.File,
  ): Promise<Item> {
    // 1. Destructuring DTO
    const { categories, item_prices, ...itemData } = updateItemDto;

    // 2. Mengambil item yang ada beserta relasi saat ini untuk perbandingan.
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ['item_categories', 'item_prices'],
    });

    if (!item) {
      throw new NotFoundException(`Item dengan ID ${id} tidak ditemukan.`);
    }

    try {
      // PERBAIKAN: Lapisan pertahanan untuk memastikan data relasi adalah array.
      // Ini akan menangani kasus di mana Zod Pipe tidak berjalan dan data masih berupa string JSON.
      let parsedCategories: number[] | undefined = Array.isArray(categories)
        ? categories
        : undefined;
      if (typeof categories === 'string') {
        try {
          parsedCategories = JSON.parse(categories);
          if (!Array.isArray(parsedCategories)) {
            throw new Error(); // Paksa masuk ke catch jika hasil parse bukan array
          }
        } catch (e) {
          throw new BadRequestException(
            'Format data `categories` tidak valid. Diharapkan sebuah JSON array.',
          );
        }
      }

      let parsedItemPrices: UpdateItemDto['item_prices'] | undefined =
        Array.isArray(item_prices) ? item_prices : undefined;
      if (typeof item_prices === 'string') {
        try {
          parsedItemPrices = JSON.parse(item_prices);
          if (!Array.isArray(parsedItemPrices)) {
            throw new Error(); // Paksa masuk ke catch jika hasil parse bukan array
          }
        } catch (e) {
          throw new BadRequestException(
            'Format data `item_prices` tidak valid. Diharapkan sebuah JSON array.',
          );
        }
      }

      // 3. Handle Upload Gambar Baru (jika ada)
      if (file) {
        (itemData as any).image_url =
          await this.imageUploadProvider.uploadImage(file);
      }

      // 4. Sinkronisasi Relasi (menggunakan data yang sudah di-parse)
      if (parsedCategories) {
        await this.syncCategories(item, parsedCategories);
      }

      if (parsedItemPrices) {
        await this.syncItemPrices(item, parsedItemPrices);
      }

      // 5. Update properti utama item
      Object.assign(item, itemData);
      await this.itemRepository.save(item);

      // 6. Return data item yang sudah terupdate penuh dengan relasi terbaru.
      return this.itemRepository.findOne({
        where: { id },
        relations: [
          'item_prices',
          'item_categories',
          'item_categories.category',
        ],
      });
    } catch (error) {
      if (
        error instanceof UnprocessableEntityException ||
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Error during item update:', error);
      throw new InternalServerErrorException(
        'Gagal memperbarui item.',
        error.message,
      );
    }
  }

  /**
   * Menyinkronkan kategori item.
   * Menerima array ID kategori yang baru dan menyesuaikannya dengan yang ada di database.
   * @param item Entitas item yang sedang diupdate.
   * @param newCategoryIds Array ID kategori yang seharusnya dimiliki item.
   */
  private async syncCategories(
    item: Item,
    newCategoryIds: number[],
  ): Promise<void> {
    for (const categoryId of newCategoryIds) {
      const categoryExists = await this.categoryRepository.findOneBy({
        id: categoryId,
      });
      if (!categoryExists) {
        throw new UnprocessableEntityException(
          `Kategori dengan ID ${categoryId} tidak valid.`,
        );
      }
    }

    const oldCategoryIds = item.item_categories.map((ic) => ic.category_id);
    const currentItemId = item.id;

    const categoriesToRemove = oldCategoryIds.filter(
      (id) => !newCategoryIds.includes(id),
    );
    if (categoriesToRemove.length > 0) {
      await this.itemCategoryRepository.delete({
        item_id: currentItemId,
        category_id: In(categoriesToRemove),
      });
    }

    const categoriesToAdd = newCategoryIds.filter(
      (id) => !oldCategoryIds.includes(id),
    );
    const newItemCategories = categoriesToAdd.map((categoryId) =>
      this.itemCategoryRepository.create({
        item_id: currentItemId,
        category_id: categoryId,
      }),
    );

    if (newItemCategories.length > 0) {
      await this.itemCategoryRepository.save(newItemCategories);
    }
  }

  /**
   * Menyinkronkan harga bertingkat.
   * Menggunakan operasi "upsert" (update jika ada ID, insert jika tidak ada).
   * @param item Entitas item yang sedang diupdate.
   * @param pricesFromDto Array objek harga dari DTO.
   */
  private async syncItemPrices(
    item: Item,
    pricesFromDto: Required<UpdateItemDto>['item_prices'],
  ): Promise<void> {
    const existingPriceIds = item.item_prices.map((p) => p.id);
    const incomingPriceIds = pricesFromDto
      .map((p) => p.id)
      .filter((id): id is number => id !== null && id !== undefined);

    const pricesToRemove = existingPriceIds.filter(
      (id) => !incomingPriceIds.includes(id),
    );
    if (pricesToRemove.length > 0) {
      await this.itemPriceRepository.delete(pricesToRemove);
    }

    const pricesToSave = pricesFromDto.map((priceDto) =>
      this.itemPriceRepository.create({
        ...priceDto,
        item_id: item.id,
      }),
    );

    if (pricesToSave.length > 0) {
      await this.itemPriceRepository.save(pricesToSave);
    }
  }

  async remove(data: IdsDto) {
    for (const id of data.ids) {
      // 1. Verifikasi apakah item ada
      const item = await this.itemRepository.findOneBy({ id: id });
      if (!item) {
        // Lanjutkan ke iterasi berikutnya jika item tidak ditemukan, atau lemparkan error jika perlu
        // Di sini saya memilih untuk melanjutkan (silent fail) untuk proses batch
        console.warn(`Item dengan ID ${id} tidak ditemukan dan dilewati.`);
        continue;
      }

      // 2. Hapus semua relasi di tabel `item_prices` yang terkait dengan item ini.
      //    Ini lebih efisien daripada memuat semua relasi terlebih dahulu.
      await this.itemPriceRepository.delete({ item_id: id });

      // 3. Hapus semua relasi di tabel `item_category` yang terkait.
      await this.itemCategoryRepository.delete({ item_id: id });

      // 4. Setelah semua relasi terhapus, hapus item utamanya.
      await this.itemRepository.delete(id);
    }
  }
}
