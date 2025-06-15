import api, { createApiHandler } from "@/shared/api";
import { IApi } from "@/types/api";
import { IUser } from "@/types/user";

export const userApi: IApi = {
  queryKey: ["user"],
  endpoints: {
    getAllUser: createApiHandler(
      async (params?: Partial<IUser>): Promise<IUser[]> => {
        const { data } = await api.get<IUser[]>("/user", {
          ...(params?.name && { name: params.name }),
          ...(params?.surname && { surname: params.surname }),
          ...(params?.studentGroupId && { studentGroupId: params.studentGroupId }),
          ...(params?.role && { role: params.role }),
          ...(params?.email && { email: params.email }),
          ...(params?.login && { login: params.login }),
          ...(params?.id && { id: params.id }),
        });
        return data;
      },
    ),
    getOneUser: createApiHandler(
      async (id: string): Promise<IUser> => {
        const { data } = await api.get<IUser>(`/user/${id}`);
        return data;
      },
    ),
    createUser: createApiHandler(
      async (body: IUser): Promise<IUser> => {
        const { data } = await api.post<IUser>("/user", body);
        return data;
      },
    ),
    createManyUser: createApiHandler(
      async (body: IUser[]): Promise<IUser[]> => {
        const { data } = await api.post<IUser[]>("/user/many", body);
        return data;
      },
    ),
    updateUser: createApiHandler(
      async (id: string, body: Partial<IUser>): Promise<IUser> => {
        const { data } = await api.patch<IUser>(`/user/${id}`, body);
        return data;
      },
    ),
    deleteUser: createApiHandler(
      async (id: string): Promise<void> => {
        await api.delete<void>(`/user/${id}`);
      },
    ),
  },
};