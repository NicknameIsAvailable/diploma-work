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
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useScheduleStore } from "@/entities/schedule/provider";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Bookmark, MapPin } from "lucide-react";
import { ILessonOrder, IScheduleLesson } from "@/types/lesson";

export interface IScheduleTableProps {
  schedule: ISchedule;
  orders?: ILessonOrder[];
}

export const ScheduleTable: FC<IScheduleTableProps> = ({
  schedule,
  orders,
}) => {
  const [currentDay, setCurrentDay] = useState<number>(0);
  const { currentFilters } = useScheduleStore((state) => state);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const today = new Date().getDay();
    setCurrentDay(today === 0 ? 6 : today - 1);
    setMounted(true);
  }, []);

  const { days } = schedule;

  const isLessonHighlighted = (lesson: IScheduleLesson | undefined) => {
    return (
      currentFilters?.lessonIDs?.includes(lesson?.id || "") ||
      currentFilters?.teacherIDs?.includes(
        lesson?.teachers[0]?.id || lesson?.teachers[1]?.id || ""
      )
    );
  };

  const weekDays = getWeekDays(5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 bg-muted/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">
              Группа {schedule.group?.number}
            </h1>
            <GroupDialog id={schedule.group?.id ?? ""}>
              <Badge className="hover:bg-primary/80 cursor-pointer transition-colors">
                {schedule.group?.speciality?.title}
              </Badge>
            </GroupDialog>
          </div>
          {weekDays[currentDay] && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Текущий день: {weekDays[currentDay]?.label}</span>
            </div>
          )}
        </div>
        <div className="rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">№</TableHead>
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
              {orders?.map((order, index) => (
                <TableRow key={order.id}>
                  <TableCell className="p-2 flex flex-col text-center">
                    <span className="text-base font-bold">{order.order}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {order.startTime} <br />
                      {order.endTime}
                    </span>
                  </TableCell>
                  {days?.map((day, dayIndex) => {
                    const sortedLessons = [...day.lessons].sort(
                      (a, b) => (a.order?.order ?? 0) - (b.order?.order ?? 0)
                    );
                    const scheduleLesson = sortedLessons[index];
                    const isHighlighted = isLessonHighlighted(scheduleLesson);

                    return (
                      <TableCell
                        key={day.id}
                        className={cn(
                          "transition-all p-1",
                          dayIndex === currentDay && "bg-accent/30",
                          isHighlighted &&
                            "border-2 border-primary/30 bg-primary/10",
                          scheduleLesson && [
                            "hover:bg-accent/50",
                            "cursor-pointer",
                            isHighlighted
                              ? "hover:border-primary hover:bg-primary/20"
                              : "hover:shadow-sm",
                          ]
                        )}
                      >
                        {scheduleLesson && (
                          <Dialog>
                            <DialogTrigger className="w-full">
                              <div className="flex items-center gap-1">
                                <Bookmark className="h-4 w-4 text-primary" />
                                <h3 className="font-bold text-start w-full flex-1">
                                  {scheduleLesson.lesson.label}
                                </h3>
                              </div>
                              <div className="flex flex-col gap-2 w-full mt-1">
                                {scheduleLesson.teachers.map(
                                  (teacher, index) => (
                                    <div
                                      key={teacher.id}
                                      className="flex justify-between gap-4 w-full text-muted-foreground items-center"
                                    >
                                      <span
                                        className={cn(
                                          "text-xs text-start flex-1 p-1 rounded-sm",
                                          currentFilters?.teacherIDs?.includes(
                                            teacher.id
                                          ) && "font-semibold bg-destructive/50"
                                        )}
                                      >
                                        {teacher.name} {teacher.surname}
                                      </span>
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        <span className="text-xs font-medium">
                                          {scheduleLesson.audiences[index]}
                                        </span>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogTitle className="flex items-center gap-2">
                                <Bookmark className="h-5 w-5 text-primary" />
                                {scheduleLesson.lesson.label}
                              </DialogTitle>
                              <DialogDescription className="text-sm italic">
                                {scheduleLesson.lesson.description ||
                                  "Нет описания"}
                              </DialogDescription>
                              <div className="grid grid-cols-1 gap-4 mt-2">
                                {scheduleLesson.teachers.map(
                                  (teacher, index) => (
                                    <motion.div
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{
                                        duration: 0.3,
                                        delay: index * 0.1,
                                      }}
                                      key={teacher.id}
                                    >
                                      <Card className="overflow-hidden border-primary/20 hover:border-primary transition-colors">
                                        <div className="bg-primary/5 px-4 py-2 border-b">
                                          {scheduleLesson.teachers.length >
                                            1 && (
                                            <CardTitle className="text-base">
                                              Подгруппа {index + 1}
                                            </CardTitle>
                                          )}
                                          {scheduleLesson.teachers.length ===
                                            1 && (
                                            <CardTitle className="text-base">
                                              Информация о занятии
                                            </CardTitle>
                                          )}
                                        </div>
                                        <CardContent className="p-4 space-y-3">
                                          <div>
                                            <h4 className="font-medium text-sm text-muted-foreground mb-1">
                                              Преподаватель:
                                            </h4>
                                            <UserCard user={teacher} />
                                          </div>
                                          <div className="flex items-center gap-2 bg-accent/30 p-2 rounded">
                                            <MapPin className="h-5 w-5 text-primary" />
                                            <p className="font-medium">
                                              Аудитория:{" "}
                                              {scheduleLesson.audiences[index]}
                                            </p>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </motion.div>
                                  )
                                )}
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
      <span className="text-xs text-muted-foreground mt-2">
        Обновлено: {new Date(schedule?.updatedAt || "").toLocaleDateString()}
      </span>
    </motion.div>
  );
};
