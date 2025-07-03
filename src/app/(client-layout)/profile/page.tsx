"use client";

import { authApi } from "@/entities/auth/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LogOut,
  Mail,
  User,
  Users,
  Shield,
  Settings,
  Edit,
  Calendar,
  CogIcon,
} from "lucide-react";
import BoringAvatar from "boring-avatars";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IUser } from "@/types/user";
import Link from "next/link";
import roleChecker from "@/components/role/check-role";

export default function ProfilePage() {
  const router = useRouter();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<IUser>({
    queryKey: ["user"],
    queryFn: authApi.endpoints.getMe,
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.endpoints.logout,
    onSuccess: () => {
      toast.success("Вы успешно вышли из системы");
      router.push("/login");
    },
    onError: () => {
      toast.error("Ошибка при выходе из системы");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate({});
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive">Ошибка загрузки профиля</p>
            <Button
              variant="outline"
              onClick={() => router.push("/login")}
              className="mt-4"
            >
              Вернуться к входу
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  console.log({ roleChecker: roleChecker.ADMIN(), user });

  const getRoleBadgeVariant = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "destructive";
      case "teacher":
        return "default";
      case "student":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header с кнопкой выхода */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Профиль</h1>
            <p className="mt-1">Управление личной информацией</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Настройки
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {logoutMutation.isPending ? "Выход..." : "Выйти"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Основная карточка профиля */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24 ring-4 shadow-lg">
                        <AvatarFallback className="">
                          <BoringAvatar
                            size={96}
                            name={`${user?.name} ${user?.surname}`}
                            variant="marble"
                          />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold">
                        {user.name} {user.surname}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Mail className="h-4 w-4" />
                        <span className="">{user.email}</span>
                      </div>
                      <Badge
                        variant={getRoleBadgeVariant(user.role)}
                        className="mt-3"
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg">
                      <User className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium">Логин</p>
                        <p>{user.login}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg">
                      <Shield className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium">Роль</p>
                        <p className="capitalize">{user.role}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg">
                      <Mail className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-slate-600">{user.email}</p>
                      </div>
                    </div>

                    {user.studentGroup && (
                      <Link
                        href={`/groups/${user.studentGroup.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg"
                      >
                        <Users className="h-5 w-5" />
                        <div>
                          <p className="text-sm font-medium">
                            Группа {user.studentGroup.number}
                          </p>
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">
            {/* Быстрые действия */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {user.role === "ADMIN" && (
                  <>
                    <Link href="/admin">
                      <Button variant="ghost" className="w-full justify-start">
                        <CogIcon className="h-4 w-4 mr-2" />
                        Войти в админ-панель
                      </Button>
                    </Link>
                  </>
                )}
                {user.role === "STUDENT" && (
                  <>
                    <Link href="/schedule">
                      <Button variant="ghost" className="w-full justify-start">
                        <Calendar className="h-4 w-4 mr-2" />
                        Посмотреть расписание
                      </Button>
                    </Link>

                    {user.studentGroup && (
                      <Link href={`/groups/${user?.studentGroup?.id}`}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Посмотреть группу
                        </Button>
                      </Link>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
