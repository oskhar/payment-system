import { CreateDateColumn } from 'typeorm';

export class AbstractPivotEntity<T> {
  constructor(payload: Partial<T>) {
    Object.assign(this, payload);
  }

  @CreateDateColumn()
  created_at: Date;
}
