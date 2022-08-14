export interface UserData {
  username: string;
  email: string;
  token: string;
  id: number;
}

export interface UserRO {
  user: UserData;
}
