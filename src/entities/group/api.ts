import api, { createApiHandler } from "@/shared/api";
import { IApi } from "@/types/api";
import { IGroupResponse } from "./types";
import { IGroup } from "@/types/group";

export const groupApi: IApi = {
  queryKey: ["group"],
  endpoints: {
    getAllGroups: createApiHandler(async (): Promise<IGroupResponse[]> => {
      const res = await api.get<IGroupResponse[]>("/group");
      return res.data;
    }),
    getGroupById: createApiHandler(
      async (id: string): Promise<IGroupResponse[]> => {
        const res = await api.get<IGroupResponse[]>(`/group/${id}`);
        return res.data;
      },
    ),
    createGroup: createApiHandler(
      async (data: IGroup): Promise<IGroupResponse> => {
        const res = await api.post<IGroupResponse>('/group', data)
        return res.data
      }
    ),
    updateGroup: createApiHandler(
      async (id: string, data: IGroup): Promise<IGroupResponse> => {
        const res = await api.patch<IGroupResponse>(`/group/${id}`, data)
        return res.data
      }
    ),
    deleteGroup: createApiHandler(
      async (id: string): Promise<IGroupResponse> => {
        const res = await api.delete<IGroupResponse>(`/group/${id}`)
        return res.data
      }
    ),
  },
};
