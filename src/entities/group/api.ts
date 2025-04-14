import api, { createApiHandler } from "@/shared/api";
import { IApi } from "@/types/api";
import { IGroupResponse } from "./types";

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
  },
};
