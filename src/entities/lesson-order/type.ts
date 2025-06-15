import { IScheduleLesson } from './../../types/lesson';
import { IEntity } from "@/types/api"

export interface ILessonOrder extends IEntity {
  order: number;
  startTime: string;
  endTime: string
  scheduleLessons: IScheduleLesson[]
}