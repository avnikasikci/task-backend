import { TaskLogService } from './../services/taskLogService';
import { TaskLog, TaskLogSchema } from './../entity/taskLog.entity';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/taskLog'),
    MongooseModule.forFeature([{ name: TaskLog.name, schema: TaskLogSchema }]),
  ],
  providers: [TaskLogService],
})
export class TaskLogModule {}
