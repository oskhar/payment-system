import { Item } from 'src/modules/item/entities/item.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { StockIn } from './stock-in.entity';
import { AbstractPivotEntity } from 'src/common/api/entities/abstract-pivot.entity';

@Entity('stock_in_item')
export class StockInItem extends AbstractPivotEntity<StockInItem> {
  @PrimaryColumn()
  stock_in_id: number;

  @PrimaryColumn()
  item_id: number;

  @ManyToOne(() => StockIn)
  @JoinColumn({ name: 'stock_in_id' })
  stock_in: Partial<StockIn>;

  @OneToOne(() => Item)
  @JoinColumn({ name: 'item_id' })
  item: Partial<Item>;

  @Column()
  quantity: number;
}
