import { AbstractEntity } from 'src/common/api/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TransactionTypeEnum } from '../enums/transaction-type.enum';
import { Item } from 'src/modules/item/entities/item.entity';
import { Branch } from 'src/modules/branch/entities/branch.entity';

@Entity('stock')
export class Stock extends AbstractEntity<Stock> {
  @Column()
  transaction_number: string;

  @ManyToOne(() => Item, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: Partial<Item>;

  @ManyToOne(() => Branch, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'branch_id' })
  branch: Partial<Branch>;

  @Column({
    type: 'enum',
    enum: TransactionTypeEnum,
  })
  type: TransactionTypeEnum;

  @Column()
  description: string;

  @Column()
  quantity: number;
}
