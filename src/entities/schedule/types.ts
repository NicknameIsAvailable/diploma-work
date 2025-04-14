import { IEntity } from "@/types/api";
import { IGroupResponse } from "../group/types";
import { IDay } from "@/types/day";

export interface IGetSchedule {
  groupIDs: string[];
  teacherIDs: string[];
  lessonIDs: string[];
}

export interface IGetScheduleResponse extends IEntity {
  groupId: string;
  days: IDay[];
  group: IGroupResponse;
}
