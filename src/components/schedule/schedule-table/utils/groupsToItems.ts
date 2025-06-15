import { IGroup } from "@/types/group";
import { IItem } from "@/components/ui/combobox";
import { ILesson } from "@/types/lesson";
import { IUser } from "@/types/user";

export const groupsToItems = (groups?: IGroup[]): IItem[] => {
  return groups?.map((group, index) => ({
    label: `№${group.number} (${group.speciality?.title})`,
    value: group.id ?? String(index),
  })) ?? [];
};

export const lessonsToItems = (lessons?: ILesson[]): IItem[] => {
  return lessons?.map((lesson, index) => ({
    label: lesson.label,
    value: lesson.id ?? String(index),
  })) ?? [];
};

export const usersToItems = (users?: IUser[]): IItem[] => {
  return users?.map((user, index) => ({
    label: `${user.surname} ${user.name}`.trim(),
    value: user.id ?? String(index),
  })) ?? [];
}
