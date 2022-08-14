import {
  Get,
  Controller,
  ValidationPipe,
  Post,
  UsePipes,
  Body,
  HttpException,
  UseGuards,
  Request,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from 'src/dataAccess/dto/createUserDTO';
import { LoginUserDto } from 'src/dataAccess/dto/loginUserDTO';
import { UserRO } from 'src/dataAccess/dto/userDTO';
import { TestEntity } from 'src/dataAccess/entity/test.entity';
import { AuthService } from 'src/dataAccess/services/authService';
import { TestService } from 'src/dataAccess/services/testService';
import { UsersService } from 'src/dataAccess/services/usersService';
import { AuthGuard } from '@nestjs/passport';

//@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(@Body('users') loginUserDto: LoginUserDto): Promise<UserRO> {
    const _user = await this.usersService.findOneEntity(loginUserDto);

    const errors = { User: ' not found' };
    if (!_user) throw new HttpException({ errors }, 401);

    const token = await this.authService.generateToken(_user);
    const { email, username, id } = _user;
    const user = { email, token, username, id };
    return { user };
  }

  @UseGuards(AuthGuard('local'))
  @Post('loginguard')
  async loginGuard(@Request() req) {
    return this.authService.loginWithCredentials(req.user);
  }

  @UsePipes(new ValidationPipe())
  @Post('register')
  async Register(@Body('users') userData: CreateUserDTO) {
    return this.usersService.create(userData);
  }
}
