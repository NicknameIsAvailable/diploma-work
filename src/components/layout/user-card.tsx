import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";

export const UserCard = () => {
  return (
    <Link href="/profile" className="flex-1">
      <Card className="flex gap-2 p-2 items-center">
        <Avatar className="h-6 w-6">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="font-bold">Иван Иванов</span>
      </Card>
    </Link>
  );
};
