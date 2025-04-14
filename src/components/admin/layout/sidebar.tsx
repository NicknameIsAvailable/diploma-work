import { UserCard } from "@/components/layout/user-card";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BookCheck, Calendar, User, Users } from "lucide-react";

const items = [
  {
    title: "Дисциплины",
    url: "/admin/lesson",
    icon: BookCheck,
  },
  {
    title: "Расписания",
    url: "/admin/schedule",
    icon: Calendar,
  },
  {
    title: "Пользователи",
    url: "/admin/user",
    icon: User,
  },
  {
    title: "Группы",
    url: "/admin/group",
    icon: Users,
  },
];

export const AdminSidebar = () => {
  return (
    <Sidebar className="w-64">
      <SidebarHeader>
        <h1 className="font-bold text-xl text-center">Админ панель</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserCard />
      </SidebarFooter>
    </Sidebar>
  );
};
