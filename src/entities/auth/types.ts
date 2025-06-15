import { IEntity } from "@/types/api";
import { IUser } from "@/types/user";

export interface IGroupResponse extends IEntity {
  label: string;
  number: string;
  curatorId?: string;
  curator?: IUser;
  students?: IUser[];
}

export interface ILoginDTO {
  login: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
  user: IUser;
}

export interface IAccessTokenResponse {
  refreshToken: string;
  accessToken: string;
}
