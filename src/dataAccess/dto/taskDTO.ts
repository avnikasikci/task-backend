export class TaskDTO {
  id: number;
  title: string;
  description: string;
  statusId: number;
  statusName: string;
  ownerId: number;
  owner: UserTaskDTO;
  creatorId: number;
  creator: UserTaskDTO;
  createdAt: string;
  updatedAt: string;
  taskLog: TaskLogDTO[];
}
export class UserTaskDTO {
  id: number;
  firstname: string;
  lastname: string;
}
export class TaskLogDTO {
  name: string;

  taskId: number;

  beforeEntity: string;

  nextEntity: string;

  description: string;

  statusLog: string;
}
