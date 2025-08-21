import { AbstractEntity } from 'src/common/api/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('categories')
export class Category extends AbstractEntity<Category> {
  @Column()
  name: string;
}
