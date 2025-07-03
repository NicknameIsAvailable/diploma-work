"use client";

import { useState, useEffect } from "react";
import { Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EntityCards } from "@/components/admin/main/entity-cards";

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
