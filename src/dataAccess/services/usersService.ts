import { CreateUserDTO } from '../dto/createUserDTO';
import { UsersEntity } from './../entity/users.entity';
import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
//import { Repository } from 'typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { validate } from 'class-validator';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { UpdateUserDto } from '../dto/updateUserDto';
import { LoginUserDto } from '../dto/loginUserDTO';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}
  async getAllCache(): Promise<UsersEntity[]> {
    const value = await this.cacheManager.get<UsersEntity[]>('get-user');
    if (value) {
      return value;
    }
    const allUser = await this.findAll();
    return await this.cacheManager.set<UsersEntity[]>('get-user', allUser, {
      ttl: 300,
    });
  }
  async deleteCache() {
    await this.cacheManager.del('get-user');
  }

  findAll(): Promise<UsersEntity[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<UsersEntity> {
    return this.usersRepository.findOneBy({ id });
  }
  findOneUserName(username: string): Promise<UsersEntity> {
    return this.usersRepository.findOneBy({ username });
  }
  async findOneEntity({ email, password }: LoginUserDto): Promise<UsersEntity> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      return null;
    }

    if (await argon2.verify(user.password, password)) {
      return user;
    }

    return null;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async create(dto: CreateUserDTO): Promise<UsersEntity> {
    // check uniqueness of username/email
    const { username, email, password, firstName, lastName } = dto;
    // const qb = await getRepository(UsersEntity)
    // .createQueryBuilder('users')
    //.where('users.username = :username', { username })
    //.orWhere('users.email = :email', { email });
    const qb = this.usersRepository
      .createQueryBuilder('users')
      .where('users.username = :username', { username })
      .orWhere('users.email = :email', { email });

    const user = await qb.getOne();

    if (user) {
      const errors = { username: 'Username and email must be unique.' };
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    // create new user
    const newUser = new UsersEntity();
    newUser.username = username;
    newUser.email = email;
    newUser.password = password;
    newUser.firstName = dto.firstName;
    newUser.lastName = dto.lastName;
    const errors = await validate(newUser);
    if (errors.length > 0) {
      const _errors = { username: 'Userinput is not valid.' };
      throw new HttpException(
        { message: 'Input data validation failed', _errors },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const savedUser = await this.usersRepository.save(newUser);
      //      return this.buildUserRO(savedUser);
      this.deleteCache();
      return newUser;
    }
    
  }

  async update(id: number, dto: UpdateUserDto): Promise<UsersEntity> {
    const toUpdate = await this.findOne(id);
    delete toUpdate.password;
    //delete toUpdate.favorites;

    const updated = Object.assign(toUpdate, dto);
    this.deleteCache();
    return await this.usersRepository.save(updated);

  }
}
