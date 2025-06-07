import { AbstractEntity } from 'src/common/api/entities/abstract.entity';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('top_up_balances')
export class TopUpBalance extends AbstractEntity<TopUpBalance> {
  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Partial<Customer>;

  @Column()
  nominal: number;
}
