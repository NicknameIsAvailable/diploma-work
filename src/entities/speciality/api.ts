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
  },
};
