import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemUnit } from './entities/item-unit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { ILike, In, Repository } from 'typeorm';
import { ItemCategory } from './entities/item-category.entity';
import { ImageUploadProvider } from 'src/config/multer/image/providers/image-upload.provider';
import { FilterDataDto } from 'src/common/api/dto/filter-data.dto';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(ItemUnit)
    private readonly itemUnitRepository: Repository<ItemUnit>,
    @InjectRepository(ItemCategory)
    private readonly itemCategoryRepository: Repository<ItemCategory>,
    private readonly imageUploadProvider: ImageUploadProvider,
  ) {}

  async create(createItemDto: CreateItemDto, file?: Express.Multer.File) {
    let imageUrl: string | null = null;

    if (file) {
      imageUrl = this.imageUploadProvider.uploadImage(file);
    }

    const item = this.itemRepository.create({
      name: createItemDto.name,
      barcode: createItemDto.barcode,
      description: createItemDto.description,
      image_url: imageUrl || undefined,
      base_unit: { id: createItemDto.base_unit_id },
    });
    await this.itemRepository.save(item);

    for (const category of createItemDto.category) {
      const newCategory = this.itemCategoryRepository.create({
        item_id: item.id,
        category_id: category.id,
      });
      await this.itemCategoryRepository.save(newCategory);
    }
    for (const unit of createItemDto.unit) {
      const newUnit = this.itemUnitRepository.create({
        item_id: item.id,
        unit_id: unit.id,
        conversion_to_base: unit.conversion_to_base,
        price: unit.price,
        cost: unit.cost,
      });

      await this.itemUnitRepository.save(newUnit);
    }
  }

  async findAll(filterData: FilterDataDto) {
    const { page = 1, limit = 10, search, sort_by, sort_type } = filterData;
    const cleanSearch = search ? search.trim() : '';
    const [items, total] = await this.itemRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: { name: ILike(`%${cleanSearch}%`) },
      relations: [
        'base_unit',
        'item_categories',
        'item_categories.category',
        'item_units',
        'item_units.unit',
      ],
    });

    const createUrl = (page: number) =>
      `?search=${search || ''}&limit=${limit}&page=${page}&sort_by=${sort_by}&sort_type=${sort_type}`;

    const result = items.map((item) => ({
      ...item,
      price: item.item_units.find((unit) => unit.unit_id === item.base_unit.id)
        ?.price,
      cost: item.item_units.find((unit) => unit.unit_id === item.base_unit.id)
        ?.cost,
    }));

    return {
      items: result,
      pagination: {
        total,
        page: page,
        limit: limit,
        total_page: Math.ceil(total / limit),
        links: {
          first: page > 1 ? createUrl(1) : null,
          prev: page > 1 ? createUrl(page - 1) : null,
          next: page < total ? createUrl(page + 1) : null,
          last: page < total ? createUrl(total) : null,
        },
      },
    };
  }

  /**
   * Updates an item and synchronizes its related categories and units.
   * This method follows a direct repository pattern without explicit transactions.
   *
   * @param id - The ID of the item to update.
   * @param updateItemDto - The data for the update.
   * @param file - An optional new image file.
   * @returns The fully updated item with its relations.
   */
  async update(
    id: number,
    updateItemDto: UpdateItemDto,
    file?: Express.Multer.File,
  ) {
    // 1. Ambil item yang ada beserta relasinya
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ['item_categories', 'item_units'],
    });

    if (!item) {
      throw new NotFoundException(`Item dengan ID ${id} tidak ditemukan.`);
    }

    // 2. Handle upload gambar jika ada file baru
    let imageUrl = item.image_url;
    if (file) {
      // Opsional: Hapus gambar lama jika perlu
      // if (item.image_url) { this.imageUploadProvider.deleteImage(item.image_url); }
      imageUrl = this.imageUploadProvider.uploadImage(file);
    }

    // 3. Update properti utama item
    await this.itemRepository.update(id, {
      name: updateItemDto.name,
      barcode: updateItemDto.barcode,
      description: updateItemDto.description,
      image_url: imageUrl,
      base_unit: { id: updateItemDto.base_unit_id },
    });

    // --- 4. Sinkronisasi Kategori (Hapus dan Tambah) ---
    if (updateItemDto.category) {
      const existingCategoryIds = new Set(
        item.item_categories.map((ic) => ic.category_id),
      );
      const incomingCategoryIds = new Set(
        updateItemDto.category.map((cat) => cat.id),
      );

      // Hapus kategori yang tidak ada lagi di DTO
      const categoriesToRemove = [...existingCategoryIds].filter(
        (catId) => !incomingCategoryIds.has(catId),
      );
      if (categoriesToRemove.length > 0) {
        await this.itemCategoryRepository.delete({
          item_id: id,
          category_id: In(categoriesToRemove),
        });
      }

      // Tambah kategori baru yang belum ada
      const categoriesToAdd = [...incomingCategoryIds]
        .filter((catId) => !existingCategoryIds.has(catId))
        .map((catId) => ({ item_id: id, category_id: catId }));
      if (categoriesToAdd.length > 0) {
        const newCategories =
          this.itemCategoryRepository.create(categoriesToAdd);
        await this.itemCategoryRepository.save(newCategories);
      }
    }

    // --- 5. Sinkronisasi Unit (Hapus, Ubah, dan Tambah) ---
    if (updateItemDto.unit) {
      const existingUnitMap = new Map(
        item.item_units.map((iu) => [iu.unit_id, iu]),
      );
      const incomingUnitMap = new Map(updateItemDto.unit.map((u) => [u.id, u]));

      // Hapus unit yang tidak ada lagi di DTO
      const unitsToRemove = item.item_units.filter(
        (iu) => !incomingUnitMap.has(iu.unit_id),
      );
      if (unitsToRemove.length > 0) {
        await this.itemUnitRepository.remove(unitsToRemove);
      }

      const unitsToSave: ItemUnit[] = [];
      for (const [unitId, incomingUnit] of incomingUnitMap.entries()) {
        const existingUnit = existingUnitMap.get(unitId);
        if (existingUnit) {
          // Unit ada, perbarui datanya
          existingUnit.price = incomingUnit.price;
          existingUnit.cost = incomingUnit.cost;
          existingUnit.conversion_to_base = incomingUnit.conversion_to_base;
          unitsToSave.push(existingUnit);
        } else {
          // Unit baru, buat entitas baru
          unitsToSave.push(
            this.itemUnitRepository.create({
              item_id: id,
              unit_id: unitId,
              price: incomingUnit.price,
              cost: incomingUnit.cost,
              conversion_to_base: incomingUnit.conversion_to_base,
            }),
          );
        }
      }

      // Simpan semua perubahan (update dan insert) dalam satu panggilan
      if (unitsToSave.length > 0) {
        await this.itemUnitRepository.save(unitsToSave);
      }
    }

    // 6. Kembalikan data terbaru yang sudah lengkap
    return this.findOne(id);
  }

  async findOne(id: number) {
    return await this.itemRepository.findOne({
      where: { id },
      relations: [
        'base_unit',
        'item_categories',
        'item_categories.category',
        'item_units',
        'item_units.unit',
      ],
    });
  }

  /**
   * Removes one or more items and their related entities explicitly.
   * This ensures data integrity even if 'ON DELETE CASCADE' is not set in the database.
   *
   * @param ids - An array of item IDs to be removed.
   * @returns A confirmation message.
   */
  async remove(ids: number[]) {
    console.log(ids);
    // 1. Validasi input: Pastikan 'ids' adalah array yang tidak kosong.
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException(
        'Input harus berupa array ID yang tidak kosong.',
      );
    }

    // 2. Validasi eksistensi: Periksa apakah semua ID yang diberikan ada di database.
    const itemsToDelete = await this.itemRepository.findBy({ id: In(ids) });

    // Jika jumlah item yang ditemukan tidak cocok dengan jumlah ID yang diberikan, berarti ada yang hilang.
    if (itemsToDelete.length !== ids.length) {
      const foundIds = itemsToDelete.map((item) => item.id);
      const notFoundIds = ids.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(
        `Item dengan ID berikut tidak ditemukan: ${notFoundIds.join(', ')}`,
      );
    }

    // 3. Hapus entitas terkait terlebih dahulu untuk menjaga integritas referensial.
    await this.itemCategoryRepository.delete({ item_id: In(ids) });
    await this.itemUnitRepository.delete({ item_id: In(ids) });

    // 4. Hapus item utama.
    const deleteResult = await this.itemRepository.delete(ids);

    // Pengaman tambahan, meskipun validasi awal seharusnya mencegah ini.
    if (deleteResult.affected === 0) {
      throw new NotFoundException(
        `Tidak ada item yang berhasil dihapus, terjadi kesalahan tak terduga.`,
      );
    }

    // 5. Kembalikan respons sukses.
    return {
      message: `Berhasil menghapus ${deleteResult.affected} item beserta relasinya.`,
      deletedIds: ids,
    };
  }
}
