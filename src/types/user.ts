import { IEntity } from "./api";
import { IGroup } from "./group";
import { ILocation } from "./location";

export enum EUserRole {
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
  ADMIN = "ADMIN",
  GUEST = "GUEST",
}

export interface ISpeciality {
  title: string;
  number: string;
  code: string;
  description?: string;
  groups: IGroup[];
  location?: ILocation;
  locationId?: string;
}

export interface IUser extends IEntity {
  name: string;
  surname: string;
  studentGroupId?: string;
  studentGroup?: IGroup;
  role: EUserRole;
  email: string;
  login: string;
}

export interface UserFormData {
  name: string;
  surname: string;
  email: string;
  login: string;
  password: string;
  repeatPassword: string;
  role: EUserRole;
  groupId?: string;
}
