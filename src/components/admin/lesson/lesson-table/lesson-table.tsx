"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ILesson } from "@/types/lesson";
import { ColumnDef } from "@tanstack/react-table";
import { FC } from "react";

export interface ILessonTableProps {
  data: ILesson[];
  isLoading: boolean;
}

export const LessonTable: FC<ILessonTableProps> = ({ data, isLoading }) => {
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
    <Card>
      <CardHeader>
        <CardTitle>Список дисциплин</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable<ILesson>
          isLoading={isLoading}
          data={data || []}
          columns={columns}
          searchFor={{
            label: "названию",
            key: "label",
          }}
        />
      </CardContent>
    </Card>
  );
};
