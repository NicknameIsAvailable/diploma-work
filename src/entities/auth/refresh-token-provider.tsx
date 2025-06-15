"use client";

import { PropsWithChildren, useEffect } from "react";
import { authApi } from "./api";
import { toast } from "sonner";
import { useUserStore } from "./provider";

export default function RefreshTokenProvider({ children }: PropsWithChildren) {
  const { setCurrentUser } = useUserStore((store) => store);

  const refreshToken = async () => {
    const res = await authApi.endpoints.getAccessToken().catch(() => {
      toast("Ошибка обновления токена");
    });

    if (res) {
      setCurrentUser(res.user);
    }
  };

  useEffect(() => {
    refreshToken();

    const interval = setInterval(async () => {
      refreshToken();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return children;
}
