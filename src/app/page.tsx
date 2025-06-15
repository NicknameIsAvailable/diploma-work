"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  Calendar,
  Users,
  BookOpen,
  GraduationCap,
  Shield,
  Clock,
  Bell,
  ChevronRight,
  Star,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: Calendar,
      title: "Актуальное расписание",
      description:
        "Всегда свежее расписание занятий с возможностью быстрого поиска",
      color: "text-blue-600",
    },
    {
      icon: Bell,
      title: "Уведомления об изменениях",
      description: "Мгновенные оповещения о переносах и отменах занятий",
      color: "text-green-600",
    },
    {
      icon: Users,
      title: "Управление группами",
      description: "Удобное администрирование учебных групп и студентов",
      color: "text-purple-600",
    },
    {
      icon: Shield,
      title: "Безопасность данных",
      description: "Надежная защита персональной информации студентов",
      color: "text-red-600",
    },
    {
      icon: Clock,
      title: "Режим реального времени",
      description: "Синхронизация данных в режиме реального времени",
      color: "text-orange-600",
    },
    {
      icon: BookOpen,
      title: "История изменений",
      description: "Полная история всех изменений в расписании",
      color: "text-teal-600",
    },
  ];

  const stats = [
    { number: "2000+", label: "Студентов" },
    { number: "150+", label: "Преподавателей" },
    { number: "50+", label: "Учебных групп" },
    { number: "99.9%", label: "Время работы" },
  ];

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Расписание Колледжа</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/schedule">
                <Calendar className="w-4 h-4 mr-2" />
                Расписание
              </Link>
            </Button>
            <Button asChild>
              <Link href="/login">
                <Shield className="w-4 h-4 mr-2" />
                Войти
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Star className="w-3 h-3 mr-1" />
                  Современная система управления
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Расписание занятий{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    нового поколения
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Удобная и современная система для просмотра расписания
                  занятий, управления группами и получения актуальной информации
                  об учебном процессе.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="text-lg">
                  <Link href="/schedules">
                    <Calendar className="w-5 h-5 mr-2" />
                    Посмотреть расписание
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="text-lg">
                  <Link href="/login">
                    <Shield className="w-5 h-5 mr-2" />
                    Войти в систему
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-primary">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-1 gap-6">
                <Card className="backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-blue-600" />
                      Сегодня, 11 июня
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">Математика</div>
                        <div className="text-sm text-muted-foreground">
                          Группа ИС-21
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">9:00 - 10:30</div>
                        <div className="text-sm text-muted-foreground">
                          Ауд. 201
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">Программирование</div>
                        <div className="text-sm text-muted-foreground">
                          Группа ИС-21
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">10:45 - 12:15</div>
                        <div className="text-sm text-muted-foreground">
                          Ауд. 305
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Возможности системы
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Все необходимые инструменты для эффективного управления учебным
              процессом
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="backdrop-blur-sm hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center mb-4`}
                  >
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="backdrop-blur-sm">
            <CardContent className="py-12">
              <div className="text-center space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold">
                  Готовы начать работу с системой?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Присоединяйтесь к тысячам студентов и преподавателей, которые
                  уже используют нашу систему для управления расписанием.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild className="text-lg">
                    <Link href="/schedules">
                      <Calendar className="w-5 h-5 mr-2" />
                      Посмотреть расписание
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="text-lg"
                  >
                    <Link href="/login">
                      Войти в систему
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Расписание Колледжа</span>
              </div>
              <p className="text-muted-foreground">
                Современная система управления расписанием для образовательных
                учреждений.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Быстрые ссылки</h3>
              <div className="space-y-2">
                <Link
                  href="/schedules"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Расписание занятий
                </Link>
                <Link
                  href="/login"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Вход в систему
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Контакты</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>г. Москва, ул. Образцова, 15</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>+7 (495) 123-45-67</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>info@college-schedule.ru</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 Расписание Колледжа. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
