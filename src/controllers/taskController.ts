import { TaskDTO } from './../dataAccess/dto/taskDTO';
import {
  Get,
  Controller,
  UsePipes,
  Post,
  Body,
  ValidationPipe,
  Delete,
  Param,
  Put,
  Request,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TaskEntity } from 'src/dataAccess/entity/task.entity';

import { TaskService } from 'src/dataAccess/services/taskService';

import { UpdateUserDto } from 'src/dataAccess/dto/updateUserDto';
import { AuthService } from 'src/dataAccess/services/authService';
import { TaskStatusDTO } from 'src/dataAccess/dto/taskStatusDTO';

@ApiBearerAuth()
@ApiTags('task')
@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async findAll(): Promise<TaskEntity[]> {
    return await this.taskService.findAll();
  }
  @Get('getAll')
  async getAll(): Promise<TaskEntity[]> {
    return await this.taskService.getAll();
  }
  @Get('getOne/:slug')
  async getOne(@Request() req, @Param() params): Promise<TaskDTO> {
    return await this.taskService.getOneTask(parseInt(params.slug));
  }
  @Get('getAllTaskStatus')
  async getAllTaskStatus(): Promise<TaskStatusDTO[]> {
    return await this.taskService.getAllTaskStatus();
  }
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Request() req, @Body('task') taskData: TaskDTO) {
    const token = req.headers.authorization;
    const currUser = await this.authService.findCurrentUser(token);
    taskData.creatorId = currUser.user.id;
    taskData.createdAt = new Date().toString();
    taskData.updatedAt = new Date().toString();
    return this.taskService.create(taskData);
  }

  @Put('update')
  async update(@Body('task') userData: TaskDTO) {
    return await this.taskService.update(userData.id, userData);
  }
  @Delete(':slug')
  async delete(@Request() req, @Param() params): Promise<any> {
    const token = req.headers.authorization;
    const currUser = await this.authService.findCurrentUser(token);
    const currTask = await this.taskService.findOne(parseInt(params.slug));
    if (currTask.creatorId === currUser.user.id) {
      return this.taskService.remove(params.slug);
    } else {
      const errors = { creatorId: 'you are not creator' };
      throw new HttpException(
        { message: 'you are not creator', errors },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
