import { Item } from 'src/modules/item/entities/item.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { AbstractPivotEntity } from 'src/common/api/entities/abstract-pivot.entity';
import { StockOut } from './stock-out.entity';

@Entity('stock_out_item')
export class StockOutItem extends AbstractPivotEntity<StockOutItem> {
  @PrimaryColumn()
  stock_out_id: number;

  @PrimaryColumn()
  item_id: number;

  @ManyToOne(() => StockOut)
  @JoinColumn({ name: 'stock_out_id' })
  stock_out: Partial<StockOut>;

  @OneToOne(() => Item)
  @JoinColumn({ name: 'item_id' })
  item: Partial<Item>;

  @Column()
  quantity: number;
}
