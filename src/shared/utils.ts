import { IGroup } from "@/types/group";

export type EnumToObject<T extends Record<string, string | number>> = {
  [K in keyof T as T[K] extends string | number ? T[K] : never]: T[K];
};

export const getYearRange = (group: IGroup) => {
  if (group.startYear && group.endYear) {
    return `${group.startYear} - ${group.endYear}`;
  }
  return "Не указано";
};

export const getCurrentYear = () => new Date().getFullYear();

export const getGroupStatus = (group: IGroup) => {
  const currentYear = getCurrentYear();
  if (group.endYear && currentYear > group.endYear) {
    return { status: "Выпущена", variant: "secondary" as const };
  }
  if (group.startYear && currentYear < group.startYear) {
    return { status: "Будущая", variant: "outline" as const };
  }
  return { status: "Активная", variant: "default" as const };
};
