import { JwtSignOptions } from './../../../node_modules/@nestjs/jwt/dist/interfaces/jwt-module-options.interface.d';
import { Secret } from './../../../node_modules/@types/jsonwebtoken/index.d';
import { UsersEntity } from './../entity/users.entity';
import { UsersService } from './usersService';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PRIVATEKEY, SECRET } from 'src/config';
import jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserData, UserRO } from '../dto/userDTO';

@Injectable()
export class AuthService {
  private readonly jwtService: JwtService;
  private readonly usersService: UsersService;
  constructor(usersService: UsersService, jwtService: JwtService) {
    this.jwtService = jwtService;
    this.usersService = usersService;
  }

  generateJWT(user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    const token = jwt.sign({ sub: user.id }, SECRET, { expiresIn: '7d' });

    return jwt.sign(
      {
        email: user.email,
        exp: exp.getTime() / 1000,
        id: user.id,
        username: user.username,
      },
      SECRET,
    );
  }
  async loginWithCredentials(user: any) {
    const payload = { username: user.username, sub: user.userId };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUserCredentials(
    username: string,
    password: string,
  ): Promise<any> {
    const user = await this.usersService.findOneUserName(username);

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Decoding the JWT Token
  public async decode(token: string): Promise<unknown> {
    return this.jwtService.decode(token, null);
  }

  // Get User by User ID we get from decode()
  public async validateUser(decoded: any): Promise<UsersEntity> {
    return this.usersService.findOne(decoded.id);
  }

  // Generate JWT Token
  public generateToken(user: UsersEntity): string {
    const token = this.jwtService.sign(
      { id: user.id, email: user.email },
      { secret: SECRET, privateKey: PRIVATEKEY },
    );
    return token;
  }
  async findCurrentUser(token: string): Promise<UserRO> {
    const decoded: any = this.jwtService.verify(token, {
      secret: SECRET,
      //privateKey: PRIVATEKEY,
    });
    //let user = await this.usersService.findOne(decoded.id);
    const user = await this.findWithTokenId(decoded.id);
    return user;
  }
  async findWithTokenId(id: number): Promise<UserRO> {
    const user = await this.usersService.findOne(id);

    if (!user) {
      const errors = { User: ' not found' };
      throw new HttpException({ errors }, 401);
    }

    const userRO = {
      id: user.id,
      username: user.username,
      email: user.email,
      token: this.generateToken(user),
    };

    return { user: userRO };
  }

  // Validate User's password
  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }

  // Encode User's password
  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }

  // Validate JWT Token, throw forbidden error if JWT Token is invalid
  private async validate(token: string): Promise<boolean | never> {
    const decoded: unknown = this.jwtService.verify(token);

    if (!decoded) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const user: UsersEntity = await this.validateUser(decoded);

    if (!user) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
