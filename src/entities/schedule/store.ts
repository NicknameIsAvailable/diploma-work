import { ISchedule } from "@/types/schedule";
import { createStore } from "zustand/vanilla";
import { IGetSchedule } from "./types";

export type ScheduleState = {
  currentSchedules: ISchedule[];
  currentFilters: IGetSchedule;
};

export type ScheduleActions = {
  setCurrentSchedules: (schedules: ISchedule[]) => void;
  setCurrentFilters: (filters: IGetSchedule) => void;
};

export type ScheduleStore = ScheduleState & ScheduleActions;

export const defaultInitState: ScheduleState = {
  currentSchedules: [],
  currentFilters: {} as IGetSchedule,
};

export const createScheduleStore = (
  initState: ScheduleState = defaultInitState,
) => {
  return createStore<ScheduleStore>()((set) => ({
    ...initState,
    setCurrentSchedules: (schedules: ISchedule[]) =>
      set(() => ({ currentSchedules: schedules })),
    setCurrentFilters: (filters: IGetSchedule) =>
      set(() => ({ currentFilters: filters })),
  }));
};
