import { Entity, Column, BeforeInsert, PrimaryGeneratedColumn } from 'typeorm';
import * as argon2 from 'argon2';
import { IsEmail } from 'class-validator';

@Entity('task')
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  statusId: number;
  @Column()
  ownerId: number;
  @Column()
  creatorId: number;
  @Column({ type: 'date' })
  createdAt: string;
  @Column({ type: 'date' })
  updatedAt: string;
  //  @Column()
  //  creator: string; //create user
  //  @Column()
  //  owner: string; //owner user
}
