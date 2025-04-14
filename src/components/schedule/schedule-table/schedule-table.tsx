"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getWeekDays } from "@/shared/data/week-days";
import { ISchedule } from "@/types/schedule";
import { FC } from "react";
import { createDayArray } from "./utils/createDayArray";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { GroupDialog } from "@/components/group/group-dialog";
import { UserCard } from "@/components/user/user-card";
import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useScheduleStore } from "@/entities/schedule/provider";

export interface IScheduleTableProps {
  schedule: ISchedule;
}

const lessonNumbers = [1, 2, 3, 4, 5, 6, 7, 8];

export const ScheduleTable: FC<IScheduleTableProps> = ({ schedule }) => {
  const [currentDay, setCurrentDay] = useState<number>(0);
  const { currentFilters } = useScheduleStore((state) => state);

  useEffect(() => {
    const today = new Date().getDay();
    setCurrentDay(today === 0 ? 6 : today - 1);
  }, []);

  const days = schedule.days?.map((day) => ({
    ...day,
    lessons: createDayArray(day.lessons),
  }));

  const isLessonHighlighted = (lessonId: string | undefined) => {
    return currentFilters?.lessonIDs?.includes(lessonId || "");
  };

  return (
    <div>
      <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-2xl">
        Группа {schedule.group?.number}
      </h1>
      <GroupDialog id={schedule.group?.id ?? ""}>
        <Badge>{schedule.group?.label}</Badge>
      </GroupDialog>
      <div className="mt-2 border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>№</TableHead>
              {getWeekDays(5).map((day, index) => (
                <TableHead
                  key={day.value}
                  className={index === currentDay ? "bg-accent/30" : ""}
                >
                  {day.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessonNumbers.map((number, index) => (
              <TableRow key={number}>
                <TableCell className="p-2 text-center">{number}</TableCell>
                {days?.map((day, dayIndex) => {
                  const scheduleLesson = day.lessons[index];
                  const isHighlighted = isLessonHighlighted(
                    scheduleLesson?.lesson?.id,
                  );

                  return (
                    <TableCell
                      key={day.id}
                      className={cn(
                        "transition-all",
                        dayIndex === currentDay && "bg-accent/30",
                        isHighlighted &&
                          "border-2 border-primary/30 bg-primary/10",
                        scheduleLesson && [
                          "hover:bg-accent/50",
                          "cursor-pointer",
                          isHighlighted
                            ? "hover:border-primary hover:bg-primary/20"
                            : "hover:shadow-sm",
                        ],
                      )}
                    >
                      {scheduleLesson && (
                        <Dialog>
                          <DialogTrigger className="w-full">
                            <div className="flex flex-col gap-2 justify-start w-full">
                              <h3 className="font-bold text-start w-full flex-1">
                                {scheduleLesson.lesson.label}
                              </h3>
                              <div className="flex flex-col gap-2 w-full">
                                {scheduleLesson.teachers.map(
                                  (teacher, index) => (
                                    <div
                                      key={teacher.id}
                                      className="flex justify-between gap-4 w-full"
                                    >
                                      <span className="text-sm text-start flex-1">
                                        {teacher.name} {teacher.surname}
                                      </span>
                                      <span className="text-sm">
                                        {scheduleLesson.audiences[index]}
                                      </span>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogTitle>
                              {scheduleLesson.lesson.label}
                            </DialogTitle>
                            <DialogDescription>
                              {scheduleLesson.lesson.desciption}
                            </DialogDescription>
                            <div className="flex flex-col gap-4">
                              {scheduleLesson.teachers.map((teacher, index) => (
                                <Card
                                  key={teacher.id}
                                  className="flex flex-col gap-2 flex-1 p-2"
                                >
                                  {scheduleLesson.teachers.length > 1 && (
                                    <CardTitle>
                                      Для {index + 1}-ой подгруппы
                                    </CardTitle>
                                  )}
                                  <span className="font-bold">
                                    Преподаватель
                                  </span>
                                  <UserCard user={teacher} />
                                  <p className="font-bold">
                                    Аудитория: {scheduleLesson.audiences[index]}
                                  </p>
                                </Card>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
