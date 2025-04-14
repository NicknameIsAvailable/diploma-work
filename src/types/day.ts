import { EWeekDay, IScheduleLesson } from "./lesson";

export interface IDay {
  id?: string;
  day: EWeekDay;
  scheduleId?: string;
  lessons: IScheduleLesson[];
}
