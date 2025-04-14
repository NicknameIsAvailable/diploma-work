"use client";

import { DataTable } from "@/components/ui/data-table";
import { lessonApi } from "@/entities/lesson";
import { ILesson } from "@/types/lesson";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";

export const LessonTable = () => {
  const { data, isLoading } = useQuery<ILesson[]>({
    queryKey: [...lessonApi.queryKey],
    queryFn: () => lessonApi.endpoints.getAllLesson(),
  });

  const columns: ColumnDef<ILesson>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: (info) => info.getValue() ?? "N/A",
      enableSorting: true,
    },
    {
      accessorKey: "label",
      header: "Название",
      cell: (info) => info.getValue(),
      enableSorting: true,
    },
    {
      accessorKey: "desciption",
      header: "Описание",
      cell: (info) => info.getValue(),
    },
  ];

  return (
    <DataTable<ILesson>
      isLoading={isLoading}
      data={data || []}
      columns={columns}
      searchFor={{
        label: "названию",
        key: "label",
      }}
    />
  );
};
