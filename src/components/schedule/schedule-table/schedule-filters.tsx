"use client";

import { Combobox } from "@/components/ui/combobox";
import { groupApi } from "@/entities/group/api";
import { useQuery } from "@tanstack/react-query";
import {
  groupsToItems,
  lessonsToItems,
  usersToItems,
} from "./utils/groupsToItems";
import { useScheduleStore } from "@/entities/schedule/provider";
import { lessonApi } from "@/entities/lesson";
import { useCallback, useEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";
import { IGetSchedule } from "@/entities/schedule";
import { useQueryState } from "nuqs";
import { UsersRound, BookOpen, RefreshCw, UserRoundSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { EUserRole } from "@/types/user";
import { userApi } from "@/entities/user/api";

export const ScheduleFilters = () => {
  const [mounted, setMounted] = useState(false);
  const { setCurrentFilters, currentFilters } = useScheduleStore(
    (state) => state
  );

  const [filterHash, setFilterHash] = useQueryState("f", {
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

  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: [...groupApi.queryKey],
    queryFn: () => groupApi.endpoints.getAllGroups(),
  });

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: [...lessonApi.queryKey],
    queryFn: () => lessonApi.endpoints.getAllLesson(),
  });

  const { data: teachers, isLoading: teachersLoading } = useQuery({
    queryKey: [...userApi.queryKey],
    queryFn: () => userApi.endpoints.getAllUser({ role: EUserRole.TEACHER }),
  });

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      setCurrentFilters({
        groupIDs: filterHash.groupIDs || [],
        teacherIDs: currentFilters?.teacherIDs || [],
        lessonIDs: filterHash.lessonIDs || [],
      });
      isInitialMount.current = false;
    }
    setMounted(true);
  }, []);

  const debouncedSetFilters = useCallback(
    debounce(async (newFilters: IGetSchedule) => {
      const newFilterHash: IGetSchedule = {
        groupIDs: newFilters.groupIDs,
        teacherIDs: newFilters.teacherIDs,
        lessonIDs: newFilters.lessonIDs,
      };
      await setFilterHash(newFilterHash);
      setCurrentFilters(newFilters);
    }, 300),
    []
  );

  const handleGroupSelect = useCallback(
    (ids: string[]) => {
      debouncedSetFilters({
        groupIDs: ids,
        teacherIDs: currentFilters?.teacherIDs || [],
        lessonIDs: currentFilters?.lessonIDs || [],
      });
    },
    [currentFilters?.teacherIDs, currentFilters?.lessonIDs, debouncedSetFilters]
  );

  const handleTeacherSelect = useCallback(
    (ids: string[]) => {
      debouncedSetFilters({
        groupIDs: currentFilters?.groupIDs || [],
        teacherIDs: ids,
        lessonIDs: currentFilters?.lessonIDs || [],
      });
    },
    [currentFilters?.groupIDs, currentFilters?.lessonIDs, debouncedSetFilters]
  );

  const resetFilters = () => {
    setCurrentFilters({
      groupIDs: [],
      teacherIDs: [],
      lessonIDs: [],
    });
    setFilterHash({
      groupIDs: [],
      teacherIDs: [],
      lessonIDs: [],
    });
  };

  const handleLessonSelect = useCallback(
    (ids: string[]) => {
      debouncedSetFilters({
        groupIDs: currentFilters?.groupIDs || [],
        teacherIDs: currentFilters?.teacherIDs || [],
        lessonIDs: ids,
      });
    },
    [currentFilters?.groupIDs, currentFilters?.teacherIDs, debouncedSetFilters]
  );

  useEffect(() => {
    return () => {
      debouncedSetFilters.cancel();
    };
  }, [debouncedSetFilters]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 10 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <UsersRound className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Выберите группу</h3>
          </div>
          <Combobox
            isLoading={groupsLoading}
            onSelect={handleGroupSelect}
            values={filterHash.groupIDs || []}
            items={groups && groupsToItems(groups)}
            placeholder="Поиск по группам..."
            label=""
            className="w-full"
            multiple={true}
          />
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-2">
            <UserRoundSearch className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Выберите преподавателя</h3>
          </div>
          <Combobox
            isLoading={teachersLoading}
            onSelect={handleTeacherSelect}
            values={filterHash.teacherIDs || []}
            items={Array.isArray(teachers) ? usersToItems(teachers) : []}
            placeholder="Поиск по преподавателям..."
            label=""
            className="w-full flex-1"
            multiple={true}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Выберите дисциплину</h3>
          </div>
          <Combobox
            isLoading={lessonsLoading}
            onSelect={handleLessonSelect}
            values={filterHash.lessonIDs || []}
            items={lessons && lessonsToItems(lessons)}
            placeholder="Поиск по дисциплинам..."
            label=""
            className="w-full"
            multiple={true}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="text-xs gap-1 h-8"
          disabled={
            (filterHash.groupIDs || []).length === 0 &&
            (filterHash.lessonIDs || []).length === 0
          }
        >
          <RefreshCw className="h-3 w-3" />
          Сбросить фильтры
        </Button>
      </div>
    </motion.div>
  );
};
