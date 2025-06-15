"use client";

import React, { useEffect } from "react";
import { useScheduleStore } from "@/entities/schedule/provider";
import { useQuery } from "@tanstack/react-query";
import { IGetSchedule, scheduleApi } from "@/entities/schedule";
import { ScheduleTable } from "./schedule-table";
import { ISchedule } from "@/types/schedule";
import { Loader, SearchX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQueryState } from "nuqs";
import { lessonOrderApi } from "@/entities/lesson-order/api";

export const ScheduleTables = () => {
  const { currentFilters, setCurrentFilters } = useScheduleStore(
    (state) => state
  );

  const [filterHash] = useQueryState("f", {
    parse: (value: string) => {
      try {
        return JSON.parse(atob(value)) as IGetSchedule;
      } catch {
        return {} as IGetSchedule;
      }
    },
    serialize: (value: IGetSchedule) => btoa(JSON.stringify(value)),
    defaultValue: {} as IGetSchedule,
  });

  const { data: schedules, isLoading: schedulesLoading } = useQuery({
    queryKey: [...scheduleApi.queryKey, currentFilters],
    queryFn: () => scheduleApi.endpoints.getAllSchedule(filterHash),
  });

  const { data: lessonOrders, isLoading: lessonOrdersLoading } = useQuery({
    queryKey: [...scheduleApi.queryKey, "lessonOrders"],
    queryFn: () => lessonOrderApi.endpoints.getAllLessonOrder(),
  });

  const resetFilters = () => {
    setCurrentFilters({
      groupIDs: [],
      teacherIDs: [],
      lessonIDs: [],
    });
  };

  useEffect(() => {
    if (schedules && schedules.length > 0 && !schedulesLoading) {
      const timer = setTimeout(() => {
        window.scrollTo({ top: window.scrollY + 100, behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [schedules, schedulesLoading]);

  console.log({ lessonOrders });

  return (
    <div className="flex flex-col gap-6">
      {schedulesLoading ||
        (lessonOrdersLoading && (
          <div className="flex justify-center items-center h-48 bg-card/50 rounded-lg border border-dashed">
            <div className="flex flex-col items-center gap-2">
              <Loader className="animate-spin h-20 w-20 text-primary" />
              <p className="text-muted-foreground animate-pulse">
                Загрузка расписания...
              </p>
            </div>
          </div>
        ))}
      {!schedulesLoading && schedules?.length === 0 && (
        <Card className="w-full border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <SearchX className="h-20 w-20 text-primary/60 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Ничего не найдено
            </h2>
            <p className="text-muted-foreground mb-6">
              Попробуйте изменить параметры поиска
            </p>
            <Button onClick={resetFilters} variant="default" className="gap-2">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
              >
                <path
                  d="M4.85355 2.14645C5.04882 2.34171 5.04882 2.65829 4.85355 2.85355L3.70711 4H9C11.4853 4 13.5 6.01472 13.5 8.5C13.5 10.9853 11.4853 13 9 13H5C4.72386 13 4.5 12.7761 4.5 12.5C4.5 12.2239 4.72386 12 5 12H9C10.933 12 12.5 10.433 12.5 8.5C12.5 6.567 10.933 5 9 5H3.70711L4.85355 6.14645C5.04882 6.34171 5.04882 6.65829 4.85355 6.85355C4.65829 7.04882 4.34171 7.04882 4.14645 6.85355L2.14645 4.85355C1.95118 4.65829 1.95118 4.34171 2.14645 4.14645L4.14645 2.14645C4.34171 1.95118 4.65829 1.95118 4.85355 2.14645Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
              Сбросить фильтры
            </Button>
          </CardContent>
        </Card>
      )}
      <div className="grid grid-cols-1 gap-6">
        {schedules &&
          schedules.map((schedule: ISchedule) => (
            <ScheduleTable
              key={schedule.id}
              schedule={schedule}
              orders={lessonOrders}
            />
          ))}
      </div>
      {schedules && schedules.length > 0 && (
        <div className="text-sm text-muted-foreground text-center mt-2">
          Найдено расписаний: {schedules.length}
        </div>
      )}
    </div>
  );
};
