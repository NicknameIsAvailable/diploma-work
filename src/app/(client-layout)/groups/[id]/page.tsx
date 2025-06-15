"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  GraduationCap,
  Calendar,
  MapPin,
  User,
  Mail,
  BookOpen,
  Clock,
  Building,
  ArrowLeft,
  Edit,
  UserPlus,
  Download,
} from "lucide-react";
import BoringAvatar from "boring-avatars";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { groupApi } from "@/entities/group/api"; // предполагаемый API
import Link from "next/link";
import { IUser } from "@/types/user";

export default function GroupPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const {
    data: group,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["group", params.id],
    queryFn: () => groupApi.endpoints.getGroupById(params.id),
  });

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </main>
    );
  }

  if (error || !group) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive">Ошибка загрузки группы</p>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mt-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const currentYear = new Date().getFullYear();
  const isActive = !group.endYear || group.endYear >= currentYear;

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Группа {group.number}</h1>
              <p className="mt-1">
                {group.speciality?.title} • {group.course} курс
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Основная информация */}
          <div className="lg:col-span-2 space-y-6">
            {/* Карточка группы */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">
                        Группа {group.number}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={isActive ? "default" : "secondary"}>
                          {isActive ? "Активная" : "Завершена"}
                        </Badge>
                        <Badge variant="outline">{group.course} курс</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Год поступления</p>
                        <p className="text-muted-foreground">
                          {group.startYear || "Не указан"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Год выпуска</p>
                        <p className="text-muted-foreground">
                          {group.endYear || "Не указан"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Специальность</p>
                        <p className="text-muted-foreground">
                          {group.speciality?.code} - {group.speciality?.title}
                        </p>
                      </div>
                    </div>

                    {group.speciality?.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Местоположение</p>
                          <p className="text-muted-foreground">
                            {group.speciality.location.title}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Куратор */}
            {group.curator && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Куратор группы
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>
                        <BoringAvatar
                          size={48}
                          name={`${group.curator.name} ${group.curator.surname}`}
                          variant="marble"
                        />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">
                        {group.curator.name} {group.curator.surname}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {group.curator.email}
                      </div>
                    </div>
                    <Link href={`mailto:${group.curator.email}`}>
                      <Button variant="outline" size="sm">
                        Связаться
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Студенты ({group.students?.length || 0})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {group.students && group.students.length > 0 ? (
                  <div className="space-y-4">
                    {group.students.map((student: IUser) => (
                      <div
                        key={student.id}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>
                            <BoringAvatar
                              size={40}
                              name={`${student.name} ${student.surname}`}
                              variant="marble"
                            />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">
                            {student.name} {student.surname}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            {student.email}
                          </div>
                        </div>
                        <Badge variant="outline">{student.role}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      В группе пока нет студентов
                    </p>
                    {/* <Button variant="outline" className="mt-4">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Добавить первого студента
                    </Button> */}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">
            {/* Статистика */}
            <Card>
              <CardHeader>
                <CardTitle>Статистика</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Всего студентов
                  </span>
                  <span className="text-2xl font-bold">
                    {group.students?.length || 0}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Курс</span>
                  <Badge variant="outline">{group.course}</Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Статус</span>
                  <Badge variant={isActive ? "default" : "secondary"}>
                    {isActive ? "Активная" : "Завершена"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Специальность */}
            {group.speciality && (
              <Card>
                <CardHeader>
                  <CardTitle>Специальность</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium">{group.speciality.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Код: {group.speciality.code}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Номер: {group.speciality.number}
                    </p>
                  </div>
                  {group.speciality.description && (
                    <>
                      <Separator />
                      <p className="text-sm text-muted-foreground">
                        {group.speciality.description}
                      </p>
                    </>
                  )}
                  {group.speciality.location && (
                    <>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <Building className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">
                            {group.speciality.location.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {group.speciality.location.address}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                  <Link href={`/specialities/${group.speciality.id}`}>
                    <Button className="w-full mt-2" variant="secondary">
                      Подробнее
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Быстрые действия */}
            <Card>
              <CardHeader>
                <CardTitle>Действия</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/schedule?groupId=${group.id}`}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Посмотреть расписание
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Управление студентами
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Edit className="w-4 h-4 mr-2" />
                  Редактировать группу
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Экспорт данных
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
