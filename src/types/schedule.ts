import { IEntity } from "./api";
import { IDay } from "./day";
import { IGroup } from "./group";

export interface ISchedule extends IEntity {
  groupId?: string;
  group?: IGroup;
  days: IDay[];
}
