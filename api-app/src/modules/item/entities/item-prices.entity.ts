import { AbstractEntity } from "src/common/api/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Item } from "./item.entity";

@Entity("item_prices")
export class ItemPrices extends AbstractEntity<ItemPrices> {
  @Column()
  item_id: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Column()
  price: number;

  @Column()
  min_quantity: number;
}
