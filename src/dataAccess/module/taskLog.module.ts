import { TaskLogService } from './../services/taskLogService';
import { TaskLog, TaskLogSchema } from './../entity/taskLog.entity';
import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/taskLog'),
    MongooseModule.forFeature([{ name: TaskLog.name, schema: TaskLogSchema }]),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
  providers: [TaskLogService],
})
export class TaskLogModule {}
