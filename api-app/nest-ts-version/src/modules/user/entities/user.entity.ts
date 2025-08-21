import { Column, Entity } from 'typeorm';
import { RoleEnum } from '../enums/role.enum';
import { AbstractEntity } from 'src/common/api/entities/abstract.entity';

@Entity('users')
export class User extends AbstractEntity<User> {
  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  whatsapp: string;

  @Column()
  email: string;

  @Column({ type: 'enum', enum: RoleEnum })
  role: RoleEnum;
}
