import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class AbstractEntity<T> {
  constructor(payload: Partial<T>) {
    Object.assign(this, payload);
  }

  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @CreateDateColumn()
  created_at: Date;
}
