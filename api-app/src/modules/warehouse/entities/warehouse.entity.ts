import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Warehouse {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column('varchar', { length: 255, nullable: true })
  name: string;

  @Column('text', { nullable: true })
  address: string;

  @Column('varchar', { length: 255, nullable: true })
  phone: string;

  @Column('varchar', { length: 255, nullable: true })
  email: string;

  @Column('varchar', { length: 255, nullable: true })
  whatsapp: string;

  @Column('varchar', { length: 255, nullable: true })
  fax_number: string;
}
