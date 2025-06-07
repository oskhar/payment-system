import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { ImageUploadProvider } from '../../config/multer/image/providers/image-upload.provider';
import { GetAccumulatedStock } from './providers/get-accumulated-stock';
import { IdsDto } from 'src/common/api/dto/ids.dto';
import { UnprocessableEntityException } from '@nestjs/common';
import { ItemCategory } from './entities/item-category.entity';
import { Category } from 'src/modules/category/entities/category.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(ItemCategory)
    private readonly itemCategoryRepository: Repository<ItemCategory>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly imageUploadProvider: ImageUploadProvider,
    private readonly getAccumulatedStock: GetAccumulatedStock,
  ) {}
  async create(createItemDto: CreateItemDto, file?: Express.Multer.File) {
    if (file)
      createItemDto.image_url =
        await this.imageUploadProvider.uploadImage(file);

    const categories = JSON.parse(createItemDto.categories);
    for (const categoryId of categories) {
      const category = await this.categoryRepository.findOneBy({
        id: categoryId,
      });
      if (!category)
        throw new UnprocessableEntityException(
          `Kategori dengan id ${categoryId} tidak ditemukan`,
        );
    }

    const item = new Item({ ...createItemDto, item_categories: [] });

    await this.itemRepository.save(item);

    for (const categoryId of categories) {
      const itemCategory = new ItemCategory({
        item_id: item.id,
        category_id: categoryId,
      });

      await this.itemCategoryRepository.save(itemCategory);
    }
  }

  async findAll() {
    const result = [];
    const items = await this.itemRepository.find({
      relations: ['item_categories', 'item_categories.category'],
    });
    for (const row of items) {
      result.push({
        ...row,
        categories: row.item_categories.map((itemCategory) => ({
          id: itemCategory.category.id,
          name: itemCategory.category.name,
        })),
        stock: await this.getAccumulatedStock.execute(row.id),
      });
    }
    return { items: result };
  }

  async findOne(id: number) {
    return await this.itemRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateItemDto: UpdateItemDto,
    file?: Express.Multer.File,
  ) {
    // Jika ada file image baru, upload dan update URL image
    if (file) {
      updateItemDto.image_url =
        await this.imageUploadProvider.uploadImage(file);
    }

    // Parsing kategori baru dari DTO
    const newCategoryIds: number[] = JSON.parse(updateItemDto.categories);

    // Validasi kategori baru
    for (const categoryId of newCategoryIds) {
      const category = await this.categoryRepository.findOneBy({
        id: categoryId,
      });
      if (!category) {
        throw new UnprocessableEntityException(
          `Kategori dengan id ${categoryId} tidak ditemukan`,
        );
      }
    }

    // Ambil item yang akan diupdate, termasuk relasi item_categories
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ['item_categories'],
    });

    if (!item) {
      throw new UnprocessableEntityException(
        `Item dengan id ${id} tidak ditemukan`,
      );
    }

    // Ambil kategori lama dari relasi item_categories
    const oldCategoryIds = item.item_categories.map((ic) => ic.category_id);

    // Cari kategori yang harus ditambahkan (ada di newCategoryIds tapi tidak di oldCategoryIds)
    const categoriesToAdd = newCategoryIds.filter(
      (id) => !oldCategoryIds.includes(id),
    );

    // Cari kategori yang harus dihapus (ada di oldCategoryIds tapi tidak di newCategoryIds)
    const categoriesToRemove = oldCategoryIds.filter(
      (id) => !newCategoryIds.includes(id),
    );

    // Hapus kategori yang tidak ada di data baru
    for (const categoryId of categoriesToRemove) {
      await this.itemCategoryRepository.delete({
        item_id: id,
        category_id: categoryId,
      });
    }

    // Tambah kategori baru yang belum ada
    for (const categoryId of categoriesToAdd) {
      const itemCategory = new ItemCategory({
        item_id: id,
        category_id: categoryId,
      });
      await this.itemCategoryRepository.save(itemCategory);
    }

    // Update properti item lainnya
    Object.assign(item, updateItemDto);

    // Simpan perubahan item
    await this.itemRepository.save(item);

    return item;
  }

  async remove(data: IdsDto) {
    for (const id of data.ids) {
      const item = await this.itemRepository.findOne({
        where: { id },
        relations: ['item_categories', 'item_categories.category'],
      });
      if (!item) throw new UnprocessableEntityException('Item not found');

      for (const itemCategory of item.item_categories) {
        await this.itemCategoryRepository.delete({
          item: { id },
          category: { id: itemCategory.category.id },
        });
      }
      await this.itemRepository.delete(id);
    }
  }
}
