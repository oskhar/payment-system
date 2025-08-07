import { AbstractEntity } from 'src/common/api/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Unit } from '../../unit/entities/unit.entity';
import { ItemUnit } from './item-unit.entity';
import { ItemCategory } from './item-category.entity';

@Entity('items')
export class Item extends AbstractEntity<Item> {
  @Column()
  name: string;

  @Column()
  barcode: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  image_url?: string;

  @ManyToOne(() => Unit)
  @JoinColumn({ name: 'base_unit_id' })
  base_unit: Partial<Unit>;

  @OneToMany(() => ItemCategory, (itemCategory) => itemCategory.item)
  item_categories: ItemCategory[];

  @OneToMany(() => ItemUnit, (itemUnit) => itemUnit.item)
  item_units: ItemUnit[];
}
