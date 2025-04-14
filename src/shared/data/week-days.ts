import { EWeekDay } from "@/types/lesson";

export function getWeekDays(count?: number) {
  const days = [
    {
      value: EWeekDay.MONDAY,
      label: "Понедельник",
    },
    {
      value: EWeekDay.TUESDAY,
      label: "Вторник",
    },
    {
      value: EWeekDay.WEDNESDAY,
      label: "Среда",
    },
    {
      value: EWeekDay.THURSDAY,
      label: "Четверг",
    },
    {
      value: EWeekDay.FRIDAY,
      label: "Пятница",
    },
    {
      value: EWeekDay.SATURDAY,
      label: "Суббота",
    },
    {
      value: EWeekDay.SUNDAY,
      label: "Воскресенье",
    },
  ];

  if (count) return days.slice(0, count);
  return days;
}
