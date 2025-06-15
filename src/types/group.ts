import { IEntity } from "./api";
import { ISchedule } from "./schedule";
import { ISpeciality, IUser } from "./user";

export interface IGroup extends IEntity {
  endYear?: number;
  specialityId: string;
  startYear?: number;
  number: string;
  course: number;
  curator?: IUser;
  speciality?: ISpeciality;
  schedule?: ISchedule;
  students?: IUser[];
}
