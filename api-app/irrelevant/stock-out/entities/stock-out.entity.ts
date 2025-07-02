import { AbstractEntity } from 'src/common/api/entities/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { StockOutItem } from './stock-out-item.entity';

@Entity('stock_out')
export class StockOut extends AbstractEntity<StockOut> {
  @Column()
  transaction_number: string;

  @Column()
  description: string;

  @OneToMany(() => StockOutItem, (stock_out_item) => stock_out_item.stock_out)
  stock_out_items: StockOutItem[];
}
