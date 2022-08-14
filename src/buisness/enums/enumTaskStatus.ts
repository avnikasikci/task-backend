export enum EnumTaskStatus {
  NEW = 1,
  ASSIGNED = 2,
  PENDING = 3,
  
}
export const EnumTaskStatusLabel = new Map<number, string>([
  [EnumTaskStatus.NEW, 'New'],
  [EnumTaskStatus.ASSIGNED, 'Assigned'],
  [EnumTaskStatus.PENDING, 'Pending'],
]);
