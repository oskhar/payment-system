import { Column, Entity, OneToMany } from 'typeorm';
import { TransactionItem } from './transaction-item.entity';
import { AbstractEntity } from 'src/common/api/entities/abstract.entity';
import { PaymentMethodEnum } from '../enums/payment-method.enum';

@Entity('transactions')
export class Transaction extends AbstractEntity<Transaction> {
  @Column()
  transaction_number: string;

  @Column({ type: 'enum', enum: PaymentMethodEnum })
  payment_method: PaymentMethodEnum;

  @Column()
  is_paid_off: boolean;

  @OneToMany(
    () => TransactionItem,
    (transaction_item) => transaction_item.transaction,
  )
  transaction_items: TransactionItem[];
}
