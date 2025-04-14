import Image from "next/image";
import { Card } from "../ui/card";
import { Drawer } from "./drawer";
import Logo from "/public/logo.png";
import { Separator } from "../ui/separator";
import { CalendarCheck2 } from "lucide-react";

export const Header = () => {
  return (
    <header>
      <Card className="rounded-none py-4 mb-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image src={Logo} alt="Логотип" height={40} />
            <Separator orientation="vertical" className="h-8" />
            <div className="flex gap-2 justify-center items-center">
              <CalendarCheck2 />
              <h1 className="text-xl font-bold">Расписание</h1>
            </div>
          </div>
          <Drawer />
        </div>
      </Card>
    </header>
  );
};
