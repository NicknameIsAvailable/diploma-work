import { ScheduleFilters } from "@/components/schedule/schedule-table/schedule-filters";
import { ScheduleTables } from "@/components/schedule/schedule-table/schedule-tables";
import { HelpCircle, Calendar } from "lucide-react";
import { Suspense } from "react";

export default function SchedulePage() {
  return (
    <div className="flex flex-col gap-6 container mx-auto py-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Расписание занятий
        </h1>
        <p className="text-muted-foreground">
          Просматривайте актуальное расписание, выбирайте группы и дисциплины
        </p>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-4">
        <h2 className="text-xl font-semibold mb-3">Фильтры</h2>
        <Suspense fallback={<div>Загрузка фильтров...</div>}>
          <ScheduleFilters />
        </Suspense>
      </div>

      <Suspense fallback={<div>Загрузка расписания...</div>}>
        <ScheduleTables />
      </Suspense>

      <div className="bg-muted/50 rounded-lg p-4 border border-dashed mt-2">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <HelpCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Подсказка</h3>
            <p className="text-sm text-muted-foreground">
              Вы можете быстро переключаться между группами и дисциплинами с
              помощью фильтров. Текущий день недели автоматически выделяется в
              таблице расписания.
            </p>
            <div className="flex gap-6 mt-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-xs">
                  Текущая неделя:{" "}
                  {new Date().toLocaleDateString("ru", {
                    day: "2-digit",
                    month: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(
                    new Date().setDate(new Date().getDate() + 6)
                  ).toLocaleDateString("ru", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
