import api, { createApiHandler } from "@/shared/api";
import { IApi } from "@/types/api";
import { IGetSchedule, IGetScheduleResponse } from "./types";
import { toQueryString } from "@/lib/utils/to-query-string";

export const scheduleApi: IApi = {
  queryKey: ["schedule"],
  endpoints: {
    getAllSchedule: createApiHandler(
      async (params?: IGetSchedule): Promise<IGetScheduleResponse[]> => {
        const res = await api.get<IGetScheduleResponse[]>(
          `/schedule${toQueryString(params || {})}`,
        );
        return res.data;
      },
    ),
    getOneSchedule: createApiHandler(
      async (id: string): Promise<IGetScheduleResponse> => {
        const { data } = await api.get<IGetScheduleResponse>(`/schedule/${id}`);
        return data;
      },
    ),
  },
};
