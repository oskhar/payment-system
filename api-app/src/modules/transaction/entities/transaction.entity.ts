import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { TransactionItem } from './transaction-item.entity';
import { AbstractEntity } from 'src/common/api/entities/abstract.entity';
import { PaymentMethodEnum } from '../enums/payment-method.enum';
import { User } from 'src/modules/user/entities/user.entity';
import { Branch } from 'src/modules/branch/entities/branch.entity';

@Entity('transactions')
export class Transaction extends AbstractEntity<Transaction> {
  @Column()
  transaction_number: string;

  @Column({ type: 'enum', enum: PaymentMethodEnum })
  payment_method: PaymentMethodEnum;

  @OneToMany(
    () => TransactionItem,
    (transaction_item) => transaction_item.transaction,
  )
  transaction_items: TransactionItem[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;
}
