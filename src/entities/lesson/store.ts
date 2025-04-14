import { ILesson } from "@/types/lesson";
import { createStore } from "zustand/vanilla";

export type LessonState = {
  currentLesson: ILesson[];
};

export type LessonActions = {
  setCurrentLessons: (lessons: ILesson[]) => void;
};

export type LessonStore = LessonState & LessonActions;

export const defaultInitState: LessonState = {
  currentLesson: [],
};

export const createLessonStore = (
  initState: LessonState = defaultInitState,
) => {
  return createStore<LessonStore>()((set) => ({
    ...initState,
    setCurrentLessons: (schedules: ILesson[]) =>
      set(() => ({ currentLesson: schedules })),
  }));
};
