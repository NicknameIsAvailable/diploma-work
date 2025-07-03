import api, { createApiHandler } from "@/shared/api";
import { IApi } from "@/types/api";
import { ISpeciality } from "./types";

export const specialityApi: IApi = {
  queryKey: ["group"],
  endpoints: {
    getAllSpecialities: createApiHandler(async (): Promise<ISpeciality[]> => {
      const res = await api.get<ISpeciality[]>("/speciality");
      return res.data;
    }),
    getSpecialityById: createApiHandler(
      async (id: string): Promise<ISpeciality[]> => {
        const res = await api.get<ISpeciality[]>(`/speciality/${id}`);
        return res.data;
      },
    ),
    createSpeciality: createApiHandler(
      async (body: ISpeciality): Promise<ISpeciality> => {
        const { data } = await api.post<ISpeciality>("/speciality", body);
        return data;
      },
    ),
    updateSpeciality: createApiHandler(
      async (id: string, body: Partial<ISpeciality>): Promise<ISpeciality> => {
        const { data } = await api.patch<ISpeciality>(`/speciality/${id}`, body);
        return data;
      },
    ),
    deleteSpeciality: createApiHandler(
      async (id: string): Promise<void> => {
        await api.delete<void>(`/speciality/${id}`);
      },
    ),
  },
};
