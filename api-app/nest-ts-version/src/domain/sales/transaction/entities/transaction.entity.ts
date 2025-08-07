import { AbstractEntity } from 'src/common/api/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PaymentMethodEnum } from '../enums/patment-method.enum';
import { User } from 'src/modules/user/entities/user.entity';
import { Branch } from 'src/domain/inventory/branch/entities/branch.entity';

@Entity('transactions')
export class TransactionEntity extends AbstractEntity<TransactionEntity> {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column()
  transaction_number: string;

  @Column()
  total_amount: number;

  @Column({ type: 'enum', enum: PaymentMethodEnum })
  payment_method: PaymentMethodEnum;
}
