import { IEntity } from "@/types/api";
import { IUser } from "@/types/user";

export interface IGroupResponse extends IEntity {
  label: string;
  number: string;
  curatorId?: string;
  curator?: IUser;
  students?: IUser[];
}
