import { EWeekDay } from "@/types/lesson";

export function getDay(day: EWeekDay): string {
  const days = {
    [EWeekDay.MONDAY]: "Понедельник",
    [EWeekDay.TUESDAY]: "Вторник",
    [EWeekDay.WEDNESDAY]: "Среда",
    [EWeekDay.THURSDAY]: "Четверг",
    [EWeekDay.FRIDAY]: "Пятница",
    [EWeekDay.SATURDAY]: "Суббота",
    [EWeekDay.SUNDAY]: "Воскресенье",
  };

  return days[day];
}
