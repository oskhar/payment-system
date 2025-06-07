import { AbstractEntity } from 'src/common/api/entities/abstract.entity';
import { TopUpBalance } from 'src/modules/top-up-balance/entities/top-up-balance.entity';
import { Column, Entity, OneToMany, UpdateDateColumn } from 'typeorm';

@Entity('customers')
export class Customer extends AbstractEntity<Customer> {
  @OneToMany(() => TopUpBalance, (top_up_balance) => top_up_balance.customer)
  top_up_balance: TopUpBalance[];

  @Column()
  name: string;

  @Column({ unique: false, nullable: true })
  uid_card: string | null;

  @Column('boolean', { default: false })
  is_waiting_scan: boolean;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date | null;
}
