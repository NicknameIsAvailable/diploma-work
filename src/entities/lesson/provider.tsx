"use client";

import {
  createContext,
  useRef,
  useContext,
  PropsWithChildren,
  FC,
} from "react";
import { useStore } from "zustand";

import { type LessonStore, createLessonStore } from "./store";

export type LessonStoreApi = ReturnType<typeof createLessonStore>;

export const LessonStoreContext = createContext<LessonStoreApi | undefined>(
  undefined,
);

export const LessonStoreProvider: FC<PropsWithChildren> = ({ children }) => {
  const storeRef = useRef<LessonStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createLessonStore();
  }

  return (
    <LessonStoreContext.Provider value={storeRef.current}>
      {children}
    </LessonStoreContext.Provider>
  );
};

export const useLessonStore = <T,>(selector: (store: LessonStore) => T): T => {
  const lessonStoreContext = useContext(LessonStoreContext);

  if (!lessonStoreContext) {
    throw new Error(`useScheduleStore must be used within LessonStoreProvider`);
  }

  return useStore(lessonStoreContext, selector);
};
