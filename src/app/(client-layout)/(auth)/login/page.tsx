"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { authApiApi, ILoginDTO } from "@/entities/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  Shield,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { useUserStore } from "@/entities/auth/provider";

const loginSchema = z.object({
  login: z.string().min(1, "Введите логин"),
  password: z.string().min(1, "Введите пароль"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setCurrentUser } = useUserStore((store) => store);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: ILoginDTO) => authApiApi.endpoints.login(data),
    onSuccess: (data) => {
      setCurrentUser(data.user);
      toast.success("Добро пожаловать в систему!", {
        description: "Авторизация прошла успешно",
      });
      router.push("/schedule");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      setErrorMessage(err.response?.data?.message || "Ошибка авторизации");
      toast.error("Ошибка входа", {
        description: "Проверьте правильность логина и пароля",
      });
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setErrorMessage("");
    login(data);
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4">
        {/* Левая часть - информация */}
        <div className="hidden lg:block space-y-8">
          <div>
            <h1 className="text-5xl font-bold mb-6">Расписание</h1>
            <p className="text-xl leading-relaxed">
              Войдите в свой аккаунт для доступа к персональному расписанию и
              функциям системы
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 flex items-center justify-center backdrop-blur-sm rounded-xl">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Расписание занятий</h3>
                <p className="text-slate-600">
                  Просматривайте и управляйте своим расписанием
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-16 h-16 flex items-center justify-center backdrop-blur-sm rounded-xl">
                <GraduationCap className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Управление группами</h3>
                <p className="">Администрирование учебных групп</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-16 h-16 flex items-center justify-center backdrop-blur-sm rounded-xl">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Безопасный доступ</h3>
                <p className="">Защищенная авторизация и данные</p>
              </div>
            </div>
          </div>
        </div>

        {/* Правая часть - форма входа */}
        <div className="w-full max-w-md mx-auto">
          <Card className="backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl">Вход в систему</CardTitle>
              <p className="text-muted-foreground">
                Введите свои данные для входа
              </p>
            </CardHeader>

            <Separator />

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Введите ваш логин"
                      {...register("login")}
                      disabled={isPending}
                      className="pl-10 mt-6"
                    />
                  </div>
                  {errors.login && (
                    <p className="text-sm text-destructive">
                      {errors.login.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Введите ваш пароль"
                      {...register("password")}
                      disabled={isPending}
                      className="pl-10 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive text-center">
                      {errorMessage}
                    </p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Вход в систему...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Войти
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Мобильные фичи */}
          <div className="lg:hidden mt-6 flex flex-wrap gap-3 justify-center">
            <Badge variant="secondary">
              <BookOpen className="w-3 h-3 mr-1" />
              Управление расписанием
            </Badge>
            <Badge variant="secondary">
              <GraduationCap className="w-3 h-3 mr-1" />
              Учебные группы
            </Badge>
            <Badge variant="secondary">
              <Shield className="w-3 h-3 mr-1" />
              Безопасный доступ
            </Badge>
          </div>
        </div>
      </div>
    </main>
  );
}
