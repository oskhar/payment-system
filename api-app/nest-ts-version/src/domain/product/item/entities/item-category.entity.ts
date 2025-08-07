import { AbstractEntity } from 'src/common/api/entities/abstract.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Item } from './item.entity';

@Entity('item_categories')
export class ItemCategory extends AbstractEntity<ItemCategory> {
  @PrimaryColumn()
  item_id: number;

  @PrimaryColumn()
  category_id: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
