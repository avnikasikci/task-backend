import { Entity, Column, BeforeInsert, PrimaryGeneratedColumn } from 'typeorm';
import * as argon2 from 'argon2';
import { IsEmail } from 'class-validator';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  username: string;
  @Column()
  @IsEmail()
  email: string;
  @Column()
  password: string;
  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }
}
