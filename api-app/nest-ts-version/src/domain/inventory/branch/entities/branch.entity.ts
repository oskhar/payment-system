import { AbstractEntity } from 'src/common/api/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('branches')
export class Branch extends AbstractEntity<Branch> {
  @Column()
  name: string;

  @Column()
  address: string;
}
