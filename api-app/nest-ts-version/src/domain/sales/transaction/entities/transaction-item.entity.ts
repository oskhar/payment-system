import { AbstractEntity } from 'src/common/api/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TransactionEntity } from './transaction.entity';
import { Item } from 'src/domain/product/item/entities/item.entity';
import { Unit } from 'src/domain/product/unit/entities/unit.entity';

@Entity()
export class TransactionItem extends AbstractEntity<TransactionItem> {
  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column()
  total_amount: number;

  @ManyToOne(() => TransactionEntity)
  @JoinColumn({ name: 'transaction_id' })
  transaction: TransactionEntity;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @ManyToOne(() => Unit)
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;
}
