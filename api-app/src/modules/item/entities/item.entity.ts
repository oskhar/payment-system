import { AbstractEntity } from 'src/common/api/entities/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ItemCategory } from './item-category.entity';
import { Stock } from 'src/modules/stock/entities/stock.entity';
import { ItemPrices } from './item-prices.entity';

@Entity('items')
export class Item extends AbstractEntity<Item> {
  @OneToMany(() => ItemCategory, (item_category) => item_category.item)
  item_categories: ItemCategory[];

  @OneToMany(() => Stock, (stock) => stock.item)
  stocks: Stock[];

  @OneToMany(() => ItemPrices, (item_prices) => item_prices.item)
  item_prices: ItemPrices[];

  @Column()
  name: string;

  @Column({ nullable: true })
  barcode: string | null;

  @Column({ nullable: true })
  image_url: string | null;

  @Column({ nullable: true })
  description: string | null;
}
