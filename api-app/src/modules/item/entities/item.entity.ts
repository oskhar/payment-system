import { AbstractEntity } from 'src/common/api/entities/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ItemCategory } from './item-category.entity';

@Entity('items')
export class Item extends AbstractEntity<Item> {
  @OneToMany(() => ItemCategory, (item_category) => item_category.item)
  item_categories: ItemCategory[];

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  image_url: string | null;

  @Column({ nullable: true })
  description: string | null;
}
