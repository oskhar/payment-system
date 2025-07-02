import { Item } from 'src/modules/item/entities/item.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { AbstractPivotEntity } from 'src/common/api/entities/abstract-pivot.entity';

@Entity('transaction_items')
export class TransactionItem extends AbstractPivotEntity<TransactionItem> {
  @PrimaryColumn()
  transaction_id: number;

  @PrimaryColumn()
  item_id: number;

  @ManyToOne(() => Transaction)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @OneToOne(() => Item)
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Column()
  quantity: number;

  @Column()
  price: number;
}
