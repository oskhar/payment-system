import { AbstractEntity } from 'src/common/api/entities/abstract.entity';
import { Column, Entity } from 'typeorm';
import { nullable } from 'zod';

@Entity('branches')
export class Branch extends AbstractEntity<Branch> {
  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  image_url: string | null;
}
