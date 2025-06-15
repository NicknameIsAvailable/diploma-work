import { IEntity } from "@/types/api"
import { ISpeciality } from "@/types/user";

export interface ILocation extends IEntity {
  title: string;
  address: string
  code: string
  description?: string
  specialities?: ISpeciality[]
}