import api, { createApiHandler } from "@/shared/api";
import { IApi } from "@/types/api";
import { ILesson } from "@/types/lesson";

export const lessonApi: IApi = {
  queryKey: ["lesson"],
  endpoints: {
    getAllLesson: createApiHandler(async (): Promise<ILesson[]> => {
      const res = await api.get<ILesson[]>("/lesson");
      return res.data;
    }),
    getOneLesson: createApiHandler(async (id: string): Promise<ILesson> => {
      const { data } = await api.get<ILesson>(`/lesson/${id}`);
      return data;
    }),
    createLesson: createApiHandler(async (body: ILesson): Promise<ILesson> => {
      const { data } = await api.post<ILesson>("/lesson", body);
      return data;
    }),
    updateLesson: createApiHandler(
      async (id: string, body: ILesson): Promise<ILesson> => {
        const { data } = await api.patch<ILesson>(`/lesson/${id}`, body);
        return data;
      },
    ),
    deleteLesson: createApiHandler(async (id: string): Promise<ILesson> => {
      const { data } = await api.patch<ILesson>(`/lesson/${id}`);
      return data;
    }),
  },
};
