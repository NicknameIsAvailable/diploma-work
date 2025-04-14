import { IGroup } from "@/types/group";
import { IItem } from "@/components/ui/combobox";
import { ILesson } from "@/types/lesson";

export const groupsToItems = (groups: IGroup[]): IItem[] => {
  return groups.map((group, index) => ({
    label: `№${group.number} (${group.label})`,
    value: group.id ?? String(index),
  }));
};

export const lessonsToItems = (lessons: ILesson[]): IItem[] => {
  return lessons.map((lesson, index) => ({
    label: lesson.label,
    value: lesson.id ?? String(index),
  }));
};
