import { IGetSchedule } from "./types";

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
      group_ids: req.filters?.groupIDs,
      teacher_ids: req.filters?.groupIDs,
      lesson_ids: req.filters?.lessonIDs,
    },
  };
}
