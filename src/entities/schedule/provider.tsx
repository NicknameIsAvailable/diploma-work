"use client";

import {
  createContext,
  useRef,
  useContext,
  PropsWithChildren,
  FC,
} from "react";
import { useStore } from "zustand";

import { type ScheduleStore, createScheduleStore } from "./store";

export type ScheduleStoreApi = ReturnType<typeof createScheduleStore>;

export const ScheduleStoreContext = createContext<ScheduleStoreApi | undefined>(
  undefined,
);

export const ScheduleStoreProvider: FC<PropsWithChildren> = ({ children }) => {
  const storeRef = useRef<ScheduleStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createScheduleStore();
  }

  return (
    <ScheduleStoreContext.Provider value={storeRef.current}>
      {children}
    </ScheduleStoreContext.Provider>
  );
};

export const useScheduleStore = <T,>(
  selector: (store: ScheduleStore) => T,
): T => {
  const counterStoreContext = useContext(ScheduleStoreContext);

  if (!counterStoreContext) {
    throw new Error(
      `useScheduleStore must be used within ScheduleStoreProvider`,
    );
  }

  return useStore(counterStoreContext, selector);
};
