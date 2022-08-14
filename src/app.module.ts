import { TestModule } from './dataAccess/module/test.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestController } from './controllers/testController';
import { TestService } from './dataAccess/services/testService';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'test',
      entities: ['src/**/**.entity{.ts,.js}'],
      //synchronize: true,
      synchronize: false,
      migrations: ['dist/migrations/*{.ts,.js}'],
      migrationsTableName: 'migrations_typeorm',
      migrationsRun: true,
    }),
    TestModule,
  ],
  controllers: [AppController, TestController],
  providers: [AppService, TestService],
})
export class AppModule {}
