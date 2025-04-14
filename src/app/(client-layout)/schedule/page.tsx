import { ScheduleFilters } from "@/components/schedule/schedule-table/schedule-filters";
import { ScheduleTables } from "@/components/schedule/schedule-table/schedule-tables";

export default function SchedulePage() {
  return (
    <div className="flex flex-col gap-4 container mx-auto">
      <ScheduleFilters />
      <ScheduleTables />
    </div>
  );
}
