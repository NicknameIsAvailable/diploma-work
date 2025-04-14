import { IUser } from "./user";

export enum EWeekDay {
  MONDAY = "monday",
  TUESDAY = "tuesday",
  WEDNESDAY = "wednesday",
  THURSDAY = "thursday",
  FRIDAY = "friday",
  SATURDAY = "saturday",
  SUNDAY = "sunday",
}

export interface IAudience {
  number: string;
  teacher: IUser;
}

export interface ILesson {
  id?: string;
  label: string;
  desciption: string;
}

export interface IScheduleLesson {
  id?: string;
  order: number;
  audiences: string[];
  lessonId: string;
  scheduleDayId: string;
  lesson: ILesson;
  teachers: IUser[];
}
