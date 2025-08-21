import { AbstractEntity } from 'src/common/api/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('units')
export class Unit extends AbstractEntity<Unit> {
  @Column()
  name: string;

  @Column()
  abbreviation: string;
}
