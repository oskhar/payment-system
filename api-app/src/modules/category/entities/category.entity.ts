import { AbstractEntity } from 'src/common/api/entities/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ItemCategory } from '../../item/entities/item-category.entity';

@Entity('categories')
export class Category extends AbstractEntity<Category> {
  @OneToMany(() => ItemCategory, (item_category) => item_category.category)
  item_categories: ItemCategory[];

  @Column()
  name: string;
}
