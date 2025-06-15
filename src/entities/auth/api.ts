import api, { createApiHandler } from "@/shared/api";
import { IApi } from "@/types/api";
import { ILoginDTO, ILoginResponse } from "./types";
import { IUser } from "@/types/user";

export const authApi: IApi = {
  queryKey: ["auth"],
  endpoints: {
    login: createApiHandler(async ({ login, password }: ILoginDTO) => {
      const res = await api.post<ILoginResponse>("/auth/login", {
        login,
        password,
      });
      return res.data;
    }),
    getMe: createApiHandler(async () => {
      const res = await api.post<{ user: IUser }>("/auth/profile");
      return res.data.user;
    }),
    getAccessToken: createApiHandler(async () => {
      const res = await api.post<IUser>("/auth/login/access-token");
      return res.data;
    }),
    logout: createApiHandler(async () => {
      const res = await api.post<unknown>("/auth/logout");
      return res.data;
    }),
  },
};
