"use client";

import React from "react";
import { useScheduleStore } from "@/entities/schedule/provider";
import { useQuery } from "@tanstack/react-query";
import { scheduleApi } from "@/entities/schedule";
import { ScheduleTable } from "./schedule-table";
import { ISchedule } from "@/types/schedule";
import { Loader, SearchX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const ScheduleTables = () => {
  const { currentFilters, setCurrentFilters } = useScheduleStore(
    (state) => state,
  );

  const { data: schedules, isLoading: schedulesLoading } = useQuery({
    queryKey: [...scheduleApi.queryKey, currentFilters],
    queryFn: () => scheduleApi.endpoints.getAllSchedule(currentFilters),
  });

  const resetFilters = () => {
    setCurrentFilters({
      groupIDs: [],
      teacherIDs: [],
      lessonIDs: [],
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {schedulesLoading && (
        <div className="flex justify-center items-center h-48">
          <Loader className="animate-spin h-20 w-20" />
        </div>
      )}
      {!schedulesLoading && schedules?.length === 0 && (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <SearchX className="h-20 w-20 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Ничего не найдено
            </h2>
            <p className="text-gray-500 mb-6">
              Попробуйте изменить параметры поиска
            </p>
            <Button onClick={resetFilters} variant="outline">
              Сбросить фильтры
            </Button>
          </CardContent>
        </Card>
      )}
      {schedules?.map((schedule: ISchedule) => (
        <ScheduleTable key={schedule.id} schedule={schedule} />
      ))}
    </div>
  );
};
