import { IUser } from "./user";

export interface IGroup {
  id?: string;
  label: string;
  number: string;
  curatorId?: string;
  curator?: IUser;
  students?: IUser[];
}
