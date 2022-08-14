import { UsersEntity } from './../entity/users.entity';
import { UsersService } from 'src/dataAccess/services/usersService';
import { AuthService } from 'src/dataAccess/services/authService';
import { TaskService } from 'src/dataAccess/services/taskService';
import { TaskEntity } from './../entity/task.entity';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/buisness/middleware/auth.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity,UsersEntity])],
  exports: [TypeOrmModule],
  providers: [ JwtService,AuthService,UsersService],



})
//export class UsersModule {}
export class TaskModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'task', method: RequestMethod.GET },
        { path: 'task', method: RequestMethod.PUT },
      );
  }
}
