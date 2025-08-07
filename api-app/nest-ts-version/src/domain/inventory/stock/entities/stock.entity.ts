import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { StockTypeEnum } from '../enums/stock-type.enum';
import { AbstractEntity } from 'src/common/api/entities/abstract.entity';
import { Branch } from '../../branch/entities/branch.entity';
import { Item } from 'src/domain/product/item/entities/item.entity';

@Entity('stocks')
export class Stock extends AbstractEntity<Stock> {
  @Column()
  transaction_number: string;

  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branch_id' })
  branch: Partial<Branch>;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'item_id' })
  item: Partial<Item>;

  @Column()
  quantity_change: number;

  @Column({ type: 'enum', enum: StockTypeEnum })
  type: StockTypeEnum;

  @Column()
  description: string;
}
