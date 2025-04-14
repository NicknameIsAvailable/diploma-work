import { IDay } from "./day";
import { IGroup } from "./group";

export interface ISchedule {
  id?: string;
  groupId?: string;
  group?: IGroup;
  days: IDay[];
}
