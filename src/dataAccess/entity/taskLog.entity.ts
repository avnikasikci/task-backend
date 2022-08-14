import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskLogDocument = TaskLog & Document;

@Schema()
export class TaskLog {
  @Prop()
  name: string;
  @Prop()
  taskId: number;
  @Prop()
  beforeEntity: string;
  @Prop()
  nextEntity: string;
  @Prop()
  description: string;
  @Prop()
  statusLog: string;
}

export const TaskLogSchema = SchemaFactory.createForClass(TaskLog);
