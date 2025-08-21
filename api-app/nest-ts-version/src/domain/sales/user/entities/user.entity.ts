import { AbstractEntity } from 'src/common/api/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('users')
export class User extends AbstractEntity<User> {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  whatsapp: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;
}
