import { TaskLog, TaskLogDocument } from './../entity/taskLog.entity';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TaskLogService {
  constructor(
    @InjectModel(TaskLog.name) private taskLogModel: Model<TaskLogDocument>,
  ) {}

  async create(taskLog: TaskLog): Promise<TaskLog> {
    const newProduct = new this.taskLogModel(taskLog);
    return newProduct.save();
  }

  async readAll(): Promise<TaskLog[]> {
    return await this.taskLogModel.find().exec();
  }

  async readById(id): Promise<TaskLog> {
    return await this.taskLogModel.findById(id).exec();
  }

  async update(id, TaskLog: TaskLog): Promise<TaskLog> {
    return await this.taskLogModel.findByIdAndUpdate(id, TaskLog, {
      new: true,
    });
  }

  async delete(id): Promise<any> {
    return await this.taskLogModel.findByIdAndRemove(id);
  }
}
