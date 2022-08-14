import { UsersEntity } from './../entity/users.entity';
import { UsersService } from 'src/dataAccess/services/usersService';
import { AuthService } from 'src/dataAccess/services/authService';
import { TaskEntity } from './../entity/task.entity';
import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/buisness/middleware/auth.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity, UsersEntity]),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
  exports: [TypeOrmModule],
  providers: [JwtService, AuthService, UsersService],
})
//export class UsersModule {}
export class TaskModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'task', method: RequestMethod.GET },
        { path: 'task/getAll', method: RequestMethod.GET },
        { path: 'task/getAllTaskStatus', method: RequestMethod.GET },
        { path: 'task/getOne/:slug', method: RequestMethod.GET },
        { path: 'task', method: RequestMethod.PUT },
        { path: 'task/create', method: RequestMethod.POST },
        { path: 'task/update', method: RequestMethod.PUT },
        { path: 'task/:slug', method: RequestMethod.DELETE },
      );
  }
}
