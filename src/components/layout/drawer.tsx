import {
  AlignJustify,
  BookTextIcon,
  CalendarCheck2,
  Settings,
  UserPenIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { ModeToggle } from "../mode-toggle";
import { ReactNode } from "react";
import Link from "next/link";
import { UserCard } from "./user-card";

interface ILink {
  label: string;
  url: string;
  icon?: ReactNode;
}

const links: ILink[] = [
  {
    label: "Личный кабинет",
    url: "/schedule",
    icon: <UserPenIcon className="mr-2" />,
  },
  {
    label: "Расписание",
    url: "/schedule",
    icon: <CalendarCheck2 className="mr-2" />,
  },
  {
    label: "Документы",
    url: "/schedule",
    icon: <BookTextIcon className="mr-2" />,
  },
];

export const Drawer = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Button size="icon" variant="secondary">
          <AlignJustify />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-4 h-full justify-center">
            {links.map((link) => (
              <Link key={link.url} href={link.url}>
                <Button className="w-full" variant="ghost">
                  {link.icon}
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
          <div className="flex gap-2">
            <UserCard />
            <Link href="/settings">
              <Button size="icon" variant="outline">
                <Settings />
              </Button>
            </Link>
            <ModeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
