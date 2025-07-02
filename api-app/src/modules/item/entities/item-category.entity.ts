import { AbstractPivotEntity } from 'src/common/api/entities/abstract-pivot.entity';
import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Item } from './item.entity';
import { Category } from 'src/modules/category/entities/category.entity';

@Entity('item_category')
export class ItemCategory extends AbstractPivotEntity<ItemCategory> {
  @PrimaryColumn('bigint')
  item_id: number;

  @PrimaryColumn('bigint')
  category_id: number;

  @ManyToOne(() => Item, (item) => item.item_categories)
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @ManyToOne(() => Category, (category) => category.item_categories)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
