import api, { createApiHandler } from "@/shared/api";
import { IApi } from "@/types/api";
import { ILessonOrder } from "./type";

export const lessonOrderApi: IApi = {
  queryKey: ["lesson-order"],
  endpoints: {
    getAllLessonOrder: createApiHandler(
      async (): Promise<ILessonOrder[]> => {
        const { data } = await api.get<ILessonOrder[]>("/lesson-order");
        return data;
      },
    ),
    getOneLessonOrder: createApiHandler(
      async (id: string): Promise<ILessonOrder> => {
        const { data } = await api.get<ILessonOrder>(`/lesson-order/${id}`);
        return data;
      },
    ),
    createLessonOrder: createApiHandler(
      async (body: ILessonOrder): Promise<ILessonOrder> => {
        const { data } = await api.post<ILessonOrder>("/lesson-order", body);
        return data;
      },
    ),
    updateLessonOrder: createApiHandler(
      async (id: string, body: Partial<ILessonOrder>): Promise<ILessonOrder> => {
        const { data } = await api.put<ILessonOrder>(`/lesson-order/${id}`, body);
        return data;
      },
    ),
    deleteLessonOrder: createApiHandler(
      async (id: string): Promise<void> => {
        await api.delete<void>(`/lesson-order/${id}`);
      },
    ),
  },
};