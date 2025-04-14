import api, { createApiHandler } from "@/shared/api";
import { IApi } from "@/types/api";
import { IGetSchedule, IGetScheduleResponse } from "./types";

export const scheduleApi: IApi = {
  queryKey: ["schedule"],
  endpoints: {
    getAllSchedule: createApiHandler(
      async (params?: IGetSchedule): Promise<IGetScheduleResponse[]> => {
        let queryParams = {};

        if (params?.groupIDs && params.groupIDs.length > 0) {
          queryParams = {
            groupIDs: params.groupIDs.join(","),
          };
        }

        const res = await api.get<IGetScheduleResponse[]>("/schedule", {
          params: queryParams,
        });
        return res.data;
      },
      "Не удалось получить расписания",
    ),
    getOneSchedule: createApiHandler(
      async (id: string): Promise<IGetScheduleResponse> => {
        const { data } = await api.get<IGetScheduleResponse>(`/schedule/${id}`);
        return data;
      },
      "Не удалось получить расписание",
    ),
  },
};
