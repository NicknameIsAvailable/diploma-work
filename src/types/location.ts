import { ISpeciality } from "./user";

export interface ILocation {
  title: string;
  address: string;
  code: string;
  description?: string;
  Speciality: ISpeciality[];
}
