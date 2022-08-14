import { enumTaskLogStatus } from './../../buisness/enums/enumTaskLogStatus';
import { TaskLogService } from './taskLogService';
import { TaskStatusDTO } from './../dto/taskStatusDTO';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { UsersService } from 'src/dataAccess/services/usersService';
import { TaskDTO, UserTaskDTO } from './../dto/taskDTO';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from '../entity/task.entity';
import { validate } from 'class-validator';
import { EnumTaskStatus } from 'src/buisness/enums/EnumTaskStatus';
import { TaskLog } from '../entity/taskLog.entity';

@Injectable()
export class TaskService {
  private readonly usersService: UsersService;
  private readonly taskLogService: TaskLogService;
  //private readonly taskRepository: Repository<TaskEntity>,

  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
    usersService: UsersService,
    taskLogService: TaskLogService,
  ) {
    this.usersService = usersService;
    this.taskLogService = taskLogService;
  }

  findAll(): Promise<TaskEntity[]> {
    return this.taskRepository.find();
  }

  findOne(id: number): Promise<TaskEntity> {
    return this.taskRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }
  async getOneTask(id: number): Promise<TaskDTO> {
    const taskEntity = await this.findOne(id);
    const AllUsers = await this.usersService.findAll();

    const result = new TaskDTO();
    result.id = taskEntity.id;
    result.title = taskEntity.title;
    result.description = taskEntity.description;
    result.ownerId = taskEntity.ownerId;
    result.statusId = taskEntity.statusId;
    result.statusId = taskEntity.statusId;
    result.statusName =
      this.getAllTaskStatus().find((x) => x.id === taskEntity.statusId)?.name ??
      '';

    const userOwner = new UserTaskDTO();
    const userDbOwner = AllUsers.find((x) => x.id === taskEntity.ownerId);
    if (userDbOwner && userDbOwner.id > 0) {
      userOwner.id = userDbOwner.id;
      userOwner.firstname = userDbOwner.firstName;
      userOwner.lastname = userDbOwner.lastName;
    }
    result.owner = userOwner;

    result.creatorId = taskEntity.creatorId;
    const userCreator = new UserTaskDTO();
    const userDbCreator = AllUsers.find((x) => x.id === taskEntity.creatorId);
    if (userDbCreator && userDbCreator.id > 0) {
      userCreator.id = userDbCreator.id;
      userCreator.firstname = userDbCreator.firstName;
      userCreator.lastname = userDbCreator.lastName;
    }

    result.creator = userCreator;
    result.createdAt = taskEntity.createdAt;
    result.updatedAt = taskEntity.updatedAt;
    let logData = await this.taskLogService.readAll();
    logData = logData.filter((x) => x.taskId === taskEntity.id);
    const mapLogData = logData.map((taskLogEntity) => ({
      name: taskLogEntity.name,
      taskId: taskLogEntity.taskId,
      beforeEntity: taskLogEntity.beforeEntity,
      nextEntity: taskLogEntity.nextEntity,
      description: taskLogEntity.description,
      statusLog: taskLogEntity.statusLog,
    }));
    result.taskLog = mapLogData;

    return result;
  }
  async getAll(): Promise<TaskDTO[]> {
    const AllTask = await this.findAll();
    const AllUsers = await this.usersService.findAll();
    let newMapTask = new TaskDTO();
    const returnList = [];
    AllTask.forEach((element) => {
      newMapTask = new TaskDTO();
      newMapTask.id = element.id;
      newMapTask.title = element.title;
      newMapTask.description = element.description;
      newMapTask.ownerId = element.ownerId;
      newMapTask.statusId = element.statusId;
      newMapTask.statusName =
        this.getAllTaskStatus().find((x) => x.id === element.statusId)?.name ??
        '';

      const userOwner = new UserTaskDTO();
      const userDbOwner = AllUsers.find((x) => x.id === element.ownerId);
      if (userDbOwner && userDbOwner.id > 0) {
        userOwner.id = userDbOwner.id;
        userOwner.firstname = userDbOwner.firstName;
        userOwner.lastname = userDbOwner.lastName;
      }
      newMapTask.owner = userOwner;
      newMapTask.creatorId = element.creatorId;
      const userCreator = new UserTaskDTO();
      const userDbCreator = AllUsers.find((x) => x.id === element.creatorId);
      if (userDbCreator && userDbCreator.id > 0) {
        userCreator.id = userDbCreator.id;
        userCreator.firstname = userDbCreator.firstName;
        userCreator.lastname = userDbCreator.lastName;
      }

      newMapTask.creator = userCreator;
      newMapTask.createdAt = element.createdAt;
      newMapTask.updatedAt = element.updatedAt;

      returnList.push(newMapTask);
    });
    return returnList;
  }
  async checkUserId(ownerId: number, creatorId: number): Promise<boolean> {
    const AllUsers = await this.usersService.findAll();

    if (
      !(
        AllUsers.filter((x) => x.id == ownerId).length > 0 &&
        AllUsers.filter((x) => x.id == creatorId).length > 0
      )
    ) {
      return true;
    }
    false;
  }
  checkStatusId(statusId: number): boolean {
    const allStatus = this.getAllTaskStatus();
    if (allStatus.filter((x) => x.id == statusId).length > 0) {
      return false;
    }
    return true;
  }

  async create(dto: TaskDTO): Promise<TaskEntity> {
    const checkUserId = await this.checkUserId(dto.ownerId, dto.creatorId);
    if (checkUserId) {
      const errors = { userIds: 'Creator or Owner user not found' };
      throw new HttpException(
        { message: 'User Not Found', errors },
        HttpStatus.BAD_REQUEST,
      );
    }
    const checkStatusId = this.checkStatusId(dto.statusId);
    if (checkStatusId) {
      const errors = { statusId: 'Status not found' };
      throw new HttpException(
        { message: 'Status Not Found', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    // create new user
    const newTask = new TaskEntity();

    newTask.title = dto.title;
    newTask.description = dto.description;
    newTask.statusId = dto.statusId;

    newTask.ownerId = dto.ownerId;
    newTask.creatorId = dto.creatorId;
    newTask.createdAt = dto.createdAt;
    newTask.updatedAt = dto.updatedAt;

    const errors = await validate(newTask);
    if (errors.length > 0) {
      const _errors = { username: 'Userinput is not valid.' };
      throw new HttpException(
        { message: 'Input data validation failed', _errors },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const savedTask = await this.taskRepository.save(newTask);
      //new data log
      const newTaskLog = new TaskLog();
      newTaskLog.taskId = savedTask.id;
      newTaskLog.beforeEntity = JSON.stringify(newTask);
      newTaskLog.statusLog = enumTaskLogStatus.NEW;
      const ownerUser = await this.usersService.findOne(newTask.ownerId);
      newTaskLog.description =
        'task named ' +
        newTask.title +
        ' ' +
        'assigned to ' +
        ownerUser.firstName +
        ' ' +
        ownerUser.lastName +
        ' ';
      this.taskLogService.create(newTaskLog);

      return newTask;
    }
  }

  async update(id: number, dto: TaskDTO): Promise<TaskEntity> {
    const check = await this.checkUserId(dto.ownerId, dto.creatorId);
    if (check) {
      const errors = { userIds: 'Creator or Owner user not found' };
      throw new HttpException(
        { message: 'User Not Found', errors },
        HttpStatus.BAD_REQUEST,
      );
    }
    dto.updatedAt == new Date().toString();

    const toUpdate = await this.findOne(id);
    const updated = Object.assign(toUpdate, dto);
    const updateTask = await this.taskRepository.save(updated);
    //task log create
    //new data log
    const newTaskLog = new TaskLog();
    newTaskLog.taskId = updateTask.id;
    newTaskLog.beforeEntity = JSON.stringify(toUpdate);
    newTaskLog.nextEntity = JSON.stringify(updateTask);
    newTaskLog.statusLog = enumTaskLogStatus.UPDATE;
    if (toUpdate.ownerId != updateTask.ownerId) {
      const ownerUser = await this.usersService.findOne(updateTask.ownerId);

      newTaskLog.description =
        'The task named ' +
        updateTask.title +
        ' ' +
        'has been updated by assigning it to the ' +
        ownerUser.firstName +
        ' ' +
        ownerUser.lastName +
        ' ' +
        'person';
    } else {
      newTaskLog.description =
        'The task named ' + updateTask.title + 'has been updated';
    }

    this.taskLogService.create(newTaskLog);
    ///task log create

    return updateTask;
  }
  getAllTaskStatus(): TaskStatusDTO[] {
    //const result: TaskStatusDTO | { id: any; name: string; }[] = [];
    const result = [];

    for (const n in EnumTaskStatus) {
      if (typeof EnumTaskStatus[n] === 'number') {
        result.push({ id: <any>EnumTaskStatus[n], name: n });
      }
    }

    return result;
  }
}
