import { AbstractEntity } from 'src/common/api/entities/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { StockInItem } from './stock-in-item.entity';

@Entity('stock_in')
export class StockIn extends AbstractEntity<StockIn> {
  @Column()
  transaction_number: string;

  @Column()
  description: string;

  @OneToMany(() => StockInItem, (stock_in_item) => stock_in_item.stock_in)
  stock_in_items: StockInItem[];
}
