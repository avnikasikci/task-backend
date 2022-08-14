import { AuthService } from 'src/dataAccess/services/authService';
import { JwtService } from '@nestjs/jwt';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/buisness/middleware/auth.middleware';
import { UsersEntity } from '../entity/users.entity';
import { UsersService } from '../services/usersService';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  exports: [TypeOrmModule, UsersService],
  providers: [UsersService, JwtService, AuthService],

})
//export class UsersModule {}
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'users', method: RequestMethod.GET },
        { path: 'users', method: RequestMethod.PUT },
      );
  }
}
