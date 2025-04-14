"use client";

import { IUser } from "@/types/user";
import { FC, useState } from "react";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";

export interface IUserCardProps {
  user: IUser;
}

export const UserCard: FC<IUserCardProps> = ({ user }) => {
  const [showMoreInfo, setShowMoreInfo] = useState<boolean>(false);

  const handleMouseOver = () => setShowMoreInfo(true);
  const handleMouseLeave = () => setShowMoreInfo(false);

  return (
    <Card
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      className="flex gap-2 items-center p-2"
    >
      <Avatar>
        <AvatarFallback>
          {user.name[0]}
          {user.surname[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex gap-2 w-full justify-between items-center">
        <h3 className="bold">
          {user.name} {user.surname}
        </h3>
        {showMoreInfo && <Button size="sm">Посмотреть профиль</Button>}
      </div>
    </Card>
  );
};
