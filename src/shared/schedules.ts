import { IGetScheduleDTO } from "@/entities/schedule/dto";
import { IGroup } from "@/types/group";
import { EWeekDay, IScheduleLesson } from "@/types/lesson";
import { ISchedule } from "@/types/schedule";
import { EUserRole, IUser } from "@/types/user";
import { v4 as uuidv4 } from "uuid";

export function generateMockSchedules(req: IGetScheduleDTO): ISchedule[] {
  const count = 100;
  let schedules: ISchedule[] = [];

  for (let i = 0; i < count; i++) {
    const group: IGroup = {
      id: uuidv4(),
      number: `${Math.floor(Math.random() * 5) + 1}${String(i).padStart(2, "0")}`,
      directionNumber: `09.03.${String(Math.floor(Math.random() * 5) + 1).padStart(2, "0")}`,
      label: `Направление ${i + 1}`,
      course: Math.floor(Math.random() * 4) + 1,
    };

    const lessons: IScheduleLesson[] = [];
    const weekDays = Object.values(EWeekDay).slice(0, 5); // Понедельник - Пятница

    weekDays.forEach((weekDay) => {
      const lessonCount = Math.floor(Math.random() * 5) + 4; // 4-8 занятий
      for (let j = 0; j < lessonCount; j++) {
        const teacher: IUser = {
          id: uuidv4(),
          name: `Имя${i}${j}`,
          surname: `Фамилия${i}${j}`,
          patronymic: `Отчество${i}${j}`,
          role: EUserRole.TEACHER,
          avatarURL: `https://example.com/avatar${i}${j}.jpg`,
          specialities: [
            {
              id: uuidv4(),
              label: `Специальность ${i}${j}`,
              description: `Описание специальности ${i}${j}`,
            },
          ],
          mail: `teacher${i}${j}@university.edu`,
          phone: `+7900${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
        };

        const lesson: IScheduleLesson = {
          id: uuidv4(),
          label: `Предмет ${i}${j}`,
          audiences: [
            {
              number: `${Math.floor(Math.random() * 5) + 1}${String(Math.floor(Math.random() * 100)).padStart(2, "0")}`,
              teacher: teacher,
            },
          ],
          order: j + 1,
          weekDay: weekDay,
        };

        lessons.push(lesson);
      }
    });

    const schedule: ISchedule = {
      id: uuidv4(),
      group: group,
      lessons: lessons,
    };

    schedules.push(schedule);
  }

  // Проверяем, есть ли хоть один непустой фильтр
  const hasFilters =
    req.filters &&
    ((req.filters.group_ids && req.filters.group_ids.length > 0) ||
      (req.filters.teacher_ids && req.filters.teacher_ids.length > 0) ||
      (req.filters.lesson_ids && req.filters.lesson_ids.length > 0));

  // Если фильтры не заданы, возвращаем полный массив
  if (!hasFilters) {
    return schedules;
  }

  // Применяем фильтрацию
  if (req.filters) {
    if (req.filters.group_ids && req.filters.group_ids.length > 0) {
      schedules = schedules.filter((schedule) =>
        req.filters!.group_ids!.includes(schedule.group.id!),
      );
    }

    if (req.filters.teacher_ids && req.filters.teacher_ids.length > 0) {
      schedules = schedules
        .map((schedule) => ({
          ...schedule,
          lessons: schedule.lessons.filter((lesson) =>
            lesson.audiences.some((audience) =>
              req.filters!.teacher_ids!.includes(audience.teacher.id!),
            ),
          ),
        }))
        .filter((schedule) => schedule.lessons.length > 0);
    }

    if (req.filters.lesson_ids && req.filters.lesson_ids.length > 0) {
      schedules = schedules
        .map((schedule) => ({
          ...schedule,
          lessons: schedule.lessons.filter((lesson) =>
            req.filters!.lesson_ids!.includes(lesson.id!),
          ),
        }))
        .filter((schedule) => schedule.lessons.length > 0);
    }
  }

  return schedules;
}
