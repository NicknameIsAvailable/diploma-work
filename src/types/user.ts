import { IGroup } from "./group";

export enum EUserRole {
  TEACHER = "teacher",
  STUDENT = "student",
  ADMIN = "admin",
}

export interface ISpeciality {
  id?: string;
  label: string;
  description: string;
}

export interface IUser {
  id?: string;
  name: string;
  surname: string;
  studentGroupId?: string;
  group?: IGroup;
}
