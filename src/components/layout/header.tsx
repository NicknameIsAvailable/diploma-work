import Image from "next/image";
import { Drawer } from "./drawer";
import Logo from "/public/logo.png";
import { Separator } from "../ui/separator";
import { CalendarCheck2 } from "lucide-react";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg border-b">
      <div className="container py-4 mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Image src={Logo} alt="Логотип" height={40} />
          <Separator orientation="vertical" className="h-8" />
          <Link href="/" className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CalendarCheck2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Расписание</h1>
            </div>
          </Link>
        </div>
        <Drawer />
      </div>
    </header>
  );
};
