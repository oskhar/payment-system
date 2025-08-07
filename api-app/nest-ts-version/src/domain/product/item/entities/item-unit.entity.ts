import { AbstractEntity } from 'src/common/api/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Unit } from '../../unit/entities/unit.entity';
import { Item } from './item.entity';

@Entity('item_units')
export class ItemUnit extends AbstractEntity<ItemUnit> {
  @Column()
  item_id: number;

  @Column()
  unit_id: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'item_id' })
  item: Partial<Item>;

  @ManyToOne(() => Unit)
  @JoinColumn({ name: 'unit_id' })
  unit: Partial<Unit>;

  @Column()
  conversion_to_base: number;

  @Column()
  price: number;

  @Column()
  cost: number;
}
