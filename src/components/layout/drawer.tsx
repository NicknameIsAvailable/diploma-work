"use client";

import {
  AlignJustify,
  CalendarCheck2,
  Settings,
  UserPenIcon,
  ChevronRight,
  Home,
  LogOut,
  Moon,
  Sun,
  Users,
  Hammer,
  Map,
  Edit,
  LogInIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import Logo from "/public/logo.png";
import { Sheet, SheetContent, SheetTrigger, SheetHeader } from "../ui/sheet";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ReactNode, useState } from "react";
import Link from "next/link";
import { UserCard } from "./user-card";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useUserStore } from "@/entities/auth/provider";
import roleChecker from "../role/check-role";

interface ILink {
  label: string;
  url: string;
  icon?: ReactNode;
  badge?: string;
  isActive?: boolean;
}

const links: ILink[] = [
  {
    label: "Главная",
    url: "/",
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: "Личный кабинет",
    url: "/profile",
    icon: <UserPenIcon className="w-5 h-5" />,
  },
  {
    label: "Админ панель",
    url: "/admin",
    icon: <Edit className="w-5 h-5" />,
  },
  {
    label: "Расписание",
    url: "/schedule",
    icon: <CalendarCheck2 className="w-5 h-5" />,
  },
  {
    label: "Группы",
    url: "/groups",
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: "Специальности",
    url: "/specialities",
    icon: <Hammer className="w-5 h-5" />,
  },
  {
    label: "Площадки",
    url: "/locations",
    icon: <Map className="w-5 h-5" />,
  },
];

const settingsLinks: ILink[] = [
  {
    label: "Настройки",
    url: "/settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

export const getLinks = (isAuth: boolean): ILink[] => {
  if (isAuth) {
    return links.filter((link) => link.url !== "/admin");
  }

  if (roleChecker.ADMIN()) {
    return links;
  }
  return links.filter(
    (link) => link.url !== "/profile" && link.url !== "/admin"
  );
};

export const Drawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useUserStore((store) => store);
  const isAuth = Boolean(currentUser);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <AlignJustify className="w-5 h-5" />
          <span className="sr-only">Открыть меню</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-80 p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4">
          <div className="flex items-center gap-4 mx-auto">
            <Image src={Logo} alt="Логотип" height={40} />
            <Separator orientation="vertical" className="h-8" />
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CalendarCheck2 className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        </SheetHeader>

        <Separator />

        {/* Профиль пользователя */}
        <div className="p-4">
          <UserCard />
          {!isAuth && (
            <Button variant="outline" className="w-full">
              <LogInIcon className="mr-2" />
              Авторизоваться
            </Button>
          )}
        </div>

        <Separator />

        {/* Основная навигация */}
        <div className="flex-1 overflow-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2">
              Навигация
            </h3>
            <nav className="space-y-1">
              {getLinks(isAuth).map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center justify-between w-full p-3 rounded-lg text-sm font-medium transition-colors
                    ${
                      link.isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {link.icon}
                    <span>{link.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {link.badge && (
                      <Badge
                        variant="secondary"
                        className="text-xs px-2 py-0.5 min-w-[20px] h-5"
                      >
                        {link.badge}
                      </Badge>
                    )}
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          <Separator />

          {/* Настройки */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2">
              Настройки
            </h3>
            <nav className="space-y-1">
              {settingsLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between w-full p-3 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="flex items-center gap-3">
                    {link.icon}
                    <span>{link.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </Link>
              ))}

              {/* Переключатель темы */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-between w-full p-3 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <div className="flex items-center gap-3">
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                  <span>Тема: {theme === "dark" ? "Светлая" : "Темная"}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            </nav>
          </div>
        </div>

        {isAuth && (
          <>
            <Separator />

            {/* Футер с выходом */}
            <div className="p-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Выйти из аккаунта
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
