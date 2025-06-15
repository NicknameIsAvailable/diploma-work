import { IGetSchedule } from "../schedule";

export interface IGetScheduleDTO {
  filters?: {
    group_ids?: string[];
    teacher_ids?: string[];
    lesson_ids?: string[];
  };
}

export function getScheduleToDTO(req: IGetSchedule): IGetScheduleDTO {
  return {
    filters: {
      group_ids: req?.groupIDs,
      teacher_ids: req?.teacherIDs,
      lesson_ids: req?.lessonIDs,
    },
  };
}
