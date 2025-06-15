import { IUser } from "@/types/user";
import { createStore } from "zustand/vanilla";

export type UserState = {
  currentUser: IUser | null;
};

export type UserActions = {
  setCurrentUser: (user: IUser) => void;
};

export type UserStore = UserState & UserActions;

export const defaultInitState: UserState = {
  currentUser: null,
};

export const createUserStore = (
  initState: UserState = defaultInitState,
) => {
  return createStore<UserStore>()((set) => ({
    ...initState,
    setCurrentUser: (user: IUser) =>
      set(() => ({ currentUser: user })),
  }));
};
