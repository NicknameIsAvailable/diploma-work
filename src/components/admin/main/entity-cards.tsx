import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { groupApi } from "@/entities/group/api";
import { lessonApi } from "@/entities/lesson";
import { lessonOrderApi } from "@/entities/lesson-order/api";
import { locationApi } from "@/entities/location/api";
import { scheduleApi } from "@/entities/schedule";
import { specialityApi } from "@/entities/speciality/api";
import { userApi } from "@/entities/user/api";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  GraduationCap,
  ListOrdered,
  MapPin,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";

interface IEntityCard {
  title: string;
  description: string;
  count: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  color: string;
  href: string;
  gradient: string;
}

export const EntityCards = async () => {
  const schedules = await scheduleApi.endpoints.getAllSchedule();
  const lessons = await lessonApi.endpoints.getAllLesson();
  const groups = await groupApi.endpoints.getAllGroups();
  const users = await userApi.endpoints.getAllUser();
  const specialities = await specialityApi.endpoints.getAllSpecialities();
  const locations = await locationApi.endpoints.getAllLocation();
  const lessonOrders = await lessonOrderApi.endpoints.getAllLessonOrder();

  const entityCards: IEntityCard[] = [
    {
      title: "Расписания",
      description: "Управление расписанием занятий и событий",
      count: schedules.length,
      icon: Calendar,
      color: "text-blue-600",
      href: "/admin/schedule",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Дисциплины",
      description: "Предметы и учебные курсы",
      count: lessons.length,
      icon: BookOpen,
      color: "text-green-600",
      href: "/admin/lessons",
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Группы",
      description: "Студенческие группы и потоки",
      count: groups.length,
      icon: Users,
      color: "text-purple-600",
      href: "/admin/groups",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Пользователи",
      description: "Студенты, преподаватели и администраторы",
      count: users.length,
      icon: User,
      color: "text-orange-600",
      href: "/admin/users",
      gradient: "from-orange-500 to-orange-600",
    },
    {
      title: "Порядок уроков",
      description: "Настройка временных слотов занятий",
      count: lessonOrders.length,
      icon: ListOrdered,
      color: "text-cyan-600",
      href: "/admin/lesson-order",
      gradient: "from-cyan-500 to-cyan-600",
    },
    {
      title: "Специальности",
      description: "Направления подготовки и специализации",
      count: specialities.length,
      icon: GraduationCap,
      color: "text-indigo-600",
      href: "/admin/specialities",
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      title: "Площадки",
      description: "Учебные корпуса и аудитории",
      count: locations.length,
      icon: MapPin,
      color: "text-red-600",
      href: "/admin/locations",
      gradient: "from-red-500 to-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {entityCards.map((entity, index) => {
        const Icon = entity.icon;
        return (
          <Link key={index} href={entity.href}>
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group overflow-hidden">
              <CardHeader className="relative pb-2">
                <div className="flex items-center justify-between">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${entity.gradient} shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mt-4">
                  {entity.title}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {entity.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {entity.count.toLocaleString("ru-RU")}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      записей
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Открыть
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};
