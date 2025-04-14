"use client";

import { Combobox } from "@/components/ui/combobox";
import { groupApi } from "@/entities/group/api";
import { useQuery } from "@tanstack/react-query";
import { groupsToItems, lessonsToItems } from "./utils/groupsToItems";
import { useScheduleStore } from "@/entities/schedule/provider";
import { lessonApi } from "@/entities/lesson";
import { useCallback, useEffect, useRef } from "react";
import debounce from "lodash/debounce";
import { IGetSchedule } from "@/entities/schedule";
import { useQueryState } from "nuqs";

interface FilterState {
  g?: string[];
  l?: string[];
}

export const ScheduleFilters = () => {
  const { setCurrentFilters, currentFilters } = useScheduleStore(
    (state) => state,
  );

  const [filterHash, setFilterHash] = useQueryState("f", {
    parse: (value: string) => {
      try {
        return JSON.parse(atob(value)) as FilterState;
      } catch {
        return {} as FilterState;
      }
    },
    serialize: (value: FilterState) => btoa(JSON.stringify(value)),
    defaultValue: {} as FilterState,
  });

  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: [...groupApi.queryKey],
    queryFn: () => groupApi.endpoints.getAllGroups(),
  });

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: [...lessonApi.queryKey],
    queryFn: () => lessonApi.endpoints.getAllLesson(),
  });

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      setCurrentFilters({
        groupIDs: filterHash.g || [],
        teacherIDs: currentFilters?.teacherIDs || [],
        lessonIDs: filterHash.l || [],
      });
      isInitialMount.current = false;
    }
  }, []);

  const debouncedSetFilters = useCallback(
    debounce(async (newFilters: IGetSchedule) => {
      const newFilterHash: FilterState = {
        g: newFilters.groupIDs,
        l: newFilters.lessonIDs,
      };
      await setFilterHash(newFilterHash);
      setCurrentFilters(newFilters);
    }, 300),
    [],
  );

  const handleGroupSelect = useCallback(
    (ids: string[]) => {
      debouncedSetFilters({
        groupIDs: ids,
        teacherIDs: currentFilters?.teacherIDs || [],
        lessonIDs: currentFilters?.lessonIDs || [],
      });
    },
    [
      currentFilters?.teacherIDs,
      currentFilters?.lessonIDs,
      debouncedSetFilters,
    ],
  );

  const handleLessonSelect = useCallback(
    (ids: string[]) => {
      debouncedSetFilters({
        groupIDs: currentFilters?.groupIDs || [],
        teacherIDs: currentFilters?.teacherIDs || [],
        lessonIDs: ids,
      });
    },
    [currentFilters?.groupIDs, currentFilters?.teacherIDs, debouncedSetFilters],
  );

  useEffect(() => {
    return () => {
      debouncedSetFilters.cancel();
    };
  }, [debouncedSetFilters]);

  return (
    <div className="w-full flex gap-4">
      <Combobox
        isLoading={groupsLoading}
        onSelect={handleGroupSelect}
        values={filterHash.g || []}
        items={groups && groupsToItems(groups)}
        placeholder="Выберите группу"
        label="Группа"
        className="flex-1"
        multiple={true}
      />
      <Combobox
        isLoading={lessonsLoading}
        onSelect={handleLessonSelect}
        values={filterHash.l || []}
        items={lessons && lessonsToItems(lessons)}
        placeholder="Выберите дисциплину"
        label="Дисциплина"
        className="flex-1"
        multiple={true}
      />
    </div>
  );
};
