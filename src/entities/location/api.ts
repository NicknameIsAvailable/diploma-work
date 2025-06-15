import api, { createApiHandler } from "@/shared/api";
import { IApi } from "@/types/api";
import { ILocation } from "./type";

export const locationApi: IApi = {
  queryKey: ["location"],
  endpoints: {
    getAllLocation: createApiHandler(
      async (): Promise<ILocation[]> => {
        const { data } = await api.get<ILocation[]>("/location");
        return data;
      },
    ),
    getOneLocation: createApiHandler(
      async (id: string): Promise<ILocation> => {
        const { data } = await api.get<ILocation>(`/location/${id}`);
        return data;
      },
    ),
    createLocation: createApiHandler(
      async (body: ILocation): Promise<ILocation> => {
        const { data } = await api.post<ILocation>("/location", body);
        return data;
      },
    ),
    createManyLocation: createApiHandler(
      async (body: ILocation[]): Promise<ILocation[]> => {
        const { data } = await api.post<ILocation[]>("/location/many", body);
        return data;
      },
    ),
    updateLocation: createApiHandler(
      async (id: string, body: Partial<ILocation>): Promise<ILocation> => {
        const { data } = await api.patch<ILocation>(`/location/${id}`, body);
        return data;
      },
    ),
    deleteLocation: createApiHandler(
      async (id: string): Promise<void> => {
        await api.delete<void>(`/location/${id}`);
      },
    ),
  },
};