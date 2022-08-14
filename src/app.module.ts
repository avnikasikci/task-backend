import { MongooseModule } from '@nestjs/mongoose';
import { TaskLogService } from './dataAccess/services/taskLogService';
import { TaskEntity } from './dataAccess/entity/task.entity';
import { TaskService } from './dataAccess/services/taskService';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './dataAccess/services/authService';
import { UsersModule } from './dataAccess/module/users.module';
import { UsersController } from './controllers/usersController';
import { UsersEntity } from './dataAccess/entity/users.entity';
import { UsersService } from './dataAccess/services/usersService';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './controllers/authController';
import { TaskModule } from './dataAccess/module/task.module';
import { TaskController } from './controllers/taskController';
import { TaskLogModule } from './dataAccess/module/taskLog.module';
import { TaskLog, TaskLogSchema } from './dataAccess/entity/taskLog.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'test',
      //entities: ['src/**/**.entity{.ts,.js}'],
      entities: [UsersEntity, TaskEntity],
      synchronize: true,
      //synchronize: false,
      //migrations: ['dist/migrations/*{.ts,.js}'],
      //migrationsTableName: 'migrations_typeorm',
      //migrationsRun: true,
    }),
    MongooseModule.forRoot('mongodb://localhost/taskLog'),
    MongooseModule.forFeature([{ name: TaskLog.name, schema: TaskLogSchema }]),

    UsersModule,
    TaskModule,
    TaskLogModule,
  ],
  controllers: [AppController, UsersController, AuthController, TaskController],
  providers: [
    AppService,
    UsersService,
    AuthService,
    JwtService,
    TaskService,
    TaskLogService,
  ],
})
export class AppModule {}
