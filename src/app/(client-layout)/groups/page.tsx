"use client";

import { useQuery } from "@tanstack/react-query";
import { groupApi } from "@/entities/group/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Users,
  GraduationCap,
  Search,
  Filter,
  BookOpen,
  Clock,
} from "lucide-react";
import { useState, useMemo } from "react";
import { IGroup } from "@/types/group";
import Link from "next/link";
import { GroupCard } from "@/components/group/group-card";
import { getGroupStatus } from "@/shared/utils";

export default function GroupsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  const {
    data: groups = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: groupApi.queryKey,
    queryFn: groupApi.endpoints.getAllGroups,
  });

  const filteredGroups = useMemo(() => {
    return groups.filter((group: IGroup) => {
      const matchesSearch =
        group.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.speciality?.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        group.speciality?.code.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCourse =
        selectedCourse === null || group.course === selectedCourse;

      return matchesSearch && matchesCourse;
    });
  }, [groups, searchTerm, selectedCourse]);

  const courses: number[] = useMemo(() => {
    const uniqueCourses = Array.from(
      new Set(groups.map((group: IGroup) => group.course))
    ) as number[];
    return uniqueCourses.sort((a, b) => a - b);
  }, [groups]);

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6 text-center">
                <p className="text-destructive">Ошибка загрузки групп</p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="mt-4"
                >
                  Обновить страницу
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Учебные группы</h1>
          <p>Список всех учебных групп и их информация</p>
        </div>

        {/* Filters */}
        <Card className="mb-8 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Фильтры и поиск
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск по номеру группы, специальности или коду..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCourse === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCourse(null)}
                >
                  Все курсы
                </Button>
                {courses.map((course: number) => (
                  <Button
                    key={course}
                    variant={selectedCourse === course ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCourse(course)}
                  >
                    {course} курс
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{groups.length}</p>
                  <p className="text-sm text-muted-foreground">Всего групп</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className=" backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {
                      groups.filter(
                        (g: IGroup) => getGroupStatus(g).status === "Активная"
                      ).length
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">Активных</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Link href="/specialities">
            <Card className=" backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {
                        [
                          ...new Set(
                            groups.map((g: IGroup) => g.speciality?.title)
                          ),
                        ].length
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Специальностей
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{filteredGroups.length}</p>
                  <p className="text-sm text-muted-foreground">Найдено</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group: IGroup) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>

        {/* No results */}
        {filteredGroups.length === 0 && (
          <Card className=" backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Группы не найдены</h3>
              <p className="text-muted-foreground mb-4">
                Попробуйте изменить параметры поиска или фильтры
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCourse(null);
                }}
              >
                Сбросить фильтры
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
