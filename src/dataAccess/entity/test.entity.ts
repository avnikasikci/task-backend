import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('testtable')
export class TestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;
}
