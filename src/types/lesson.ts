import { IEntity } from "./api";
import { IDay } from "./day";
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
  description: string;
}

export interface ILessonOrder extends IEntity {
  order: number;
  startTime: string;
  endTime: string;
  scheduleLessons?: IScheduleLesson[];
}

export interface IScheduleLesson extends IEntity {
  scheduleDayId: string;
  lessonId: string;
  audiences: string[];
  orderId: string;
  lesson: ILesson;
  order: ILessonOrder;
  scheduleDay: IDay | null;
  teachers: IUser[];
}
