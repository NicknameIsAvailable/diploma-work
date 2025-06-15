import { IEntity } from "@/types/api";
import { IGroup } from "@/types/group";
import { ILocation } from "@/types/location";

export interface ISpeciality extends IEntity {
  title: string;
  number: string;
  code: string
  description?: string
  groups: IGroup[]
  location?: ILocation;
  locationId?: string
}
