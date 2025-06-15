"use client";

import Link from "next/link";
import { Avatar, AvatarFallback } from "../ui/avatar";
import BoringAvatar from "boring-avatars";

import { Card } from "../ui/card";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/entities/auth/api";

export const UserCard = () => {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: authApi.endpoints.getMe,
  });

  if (user)
    return (
      <Link href="/profile" className="flex-1">
        <Card className="flex gap-2 p-2 items-center">
          <Avatar className="h-6 w-6">
            <AvatarFallback>
              <BoringAvatar
                size={40}
                name={`${user?.name} ${user?.surname}`}
                variant="marble"
              />
            </AvatarFallback>
          </Avatar>
          <span className="font-bold">
            {user?.name} {user?.surname}
          </span>
        </Card>
      </Link>
    );
};
