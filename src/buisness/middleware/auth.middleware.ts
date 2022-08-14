import { UsersEntity } from './../../dataAccess/entity/users.entity';
import { JwtService } from '@nestjs/jwt';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PRIVATEKEY, SECRET } from 'src/config';
import { UserData, UserRO } from 'src/dataAccess/dto/userDTO';
import { UsersService } from 'src/dataAccess/services/usersService';
import { AuthService } from 'src/dataAccess/services/authService';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  //constructor(private readonly userService: UsersService) {}

  private readonly jwtService: JwtService;
  //private readonly usersService: UsersService;
  private readonly authService: AuthService;
  constructor(
    //usersService: UsersService,
    jwtService: JwtService,
    authService: AuthService,
  ) {
    this.jwtService = jwtService;
    //this.usersService = usersService;
    this.authService = authService;
  }
  async use(
    req: Request & { user?: UserRO & { id?: number } },
    res: Response,
    next: NextFunction,
  ) {
    const authHeaders = req.headers.authorization;
    //if (authHeaders || (authHeaders as string).split(' ')[1]) {
    if (authHeaders) {
      //const token = (authHeaders as string).split(' ')[1];
      const token = authHeaders;
      //const decoded: any = jwt.verify(token, SECRET);

      const decoded: any = this.jwtService.verify(token, {
        secret: SECRET,
        //privateKey: PRIVATEKEY,
      });
      //let user = await this.usersService.findOne(decoded.id);
      const user = await this.authService.findWithTokenId(decoded.id);

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
      }
      //let av=req.user;
      //res.user=user.user;
      //req.user.user = user.user;
      //req.user.email = user.email;
      //req.user.id = user.id;
      //req.user.username = user.username;
      //req.user.id = decoded.id;
      next();
    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }
}
