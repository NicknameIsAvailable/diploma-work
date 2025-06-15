"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  BookOpen,
  Users,
  User,
  Clock,
  ArrowRight,
  Search,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EntityCards } from "@/components/admin/main/entity-cards";

interface QuickAction {
  title: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  href: string;
  color: string;
}

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Быстрые действия
  const quickActions: QuickAction[] = [
    {
      title: "Создать расписание",
      description: "Новое расписание для группы",
      icon: Calendar,
      href: "/admin/schedule/create",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Добавить дисциплину",
      description: "Новый предмет или курс",
      icon: BookOpen,
      href: "/admin/lessons/create",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Создать группу",
      description: "Новая студенческая группа",
      icon: Users,
      href: "/admin/groups/create",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Добавить пользователя",
      description: "Новый студент или преподаватель",
      icon: User,
      href: "/admin/users/create",
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Заголовок и время */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Панель управления
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Управление образовательной системой
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>
            {currentTime.toLocaleDateString("ru-RU", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="font-mono">
            {currentTime.toLocaleTimeString("ru-RU")}
          </span>
        </div>
      </div>

      {/* Поиск */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Поиск по системе..." className="pl-10" />
        </div>
      </div>

      {/* Быстрые действия */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Быстрые действия
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} href={action.href}>
                <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-3 rounded-lg ${action.color} transition-colors`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {action.description}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Основные сущности */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Управление системой
        </h2>
        <EntityCards />
      </div>
    </div>
  );
}
