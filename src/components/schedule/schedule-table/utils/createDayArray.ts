import { IScheduleLesson } from "@/types/lesson";

export function createDayArray(
  items: IScheduleLesson[],
): (IScheduleLesson | null)[] {
  const result: (IScheduleLesson | null)[] = new Array(8).fill(null);
  items.forEach((item) => {
    if (item.order >= 1 && item.order <= 8) {
      result[item.order - 1] = item;
    }
  });

  return result;
}
