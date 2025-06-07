import { AbstractEntity } from 'src/common/api/entities/abstract.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { TransactionTypeEnum } from '../enums/transaction-type.enum';
import { Item } from 'src/modules/item/entities/item.entity';

@Entity('stock')
export class Stock extends AbstractEntity<Stock> {
  @Column()
  transaction_number: string;

  @Column({
    type: 'enum',
    enum: TransactionTypeEnum,
  })
  type: TransactionTypeEnum;

  @Column()
  description: string;

  @OneToOne(() => Item, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: Partial<Item>;

  @Column()
  quantity: number;
}
