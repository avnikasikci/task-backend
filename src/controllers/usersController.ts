import { UsersService } from './../dataAccess/services/usersService';
import { UsersEntity } from './../dataAccess/entity/users.entity';
import {
  Get,
  Controller,
  Post,
  Put,
  ValidationPipe,
  Body,
  UsePipes,
  Param,
  Delete,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from 'src/dataAccess/dto/updateUserDto';
import { CreateUserDTO } from 'src/dataAccess/dto/createUserDTO';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<UsersEntity[]> {
    return await this.usersService.findAll();
  }
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body('users') userData: CreateUserDTO) {
    return this.usersService.create(userData);
  }

  @Put()
  async update(@Body('users') userData: UpdateUserDto) {
    return await this.usersService.update(userData.id, userData);
  }
  @Delete(':slug')
  async delete(@Param() params): Promise<any> {
    return this.usersService.remove(params.slug);
  }

}
