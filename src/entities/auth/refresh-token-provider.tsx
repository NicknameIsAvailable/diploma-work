"use client";

import { toast } from "sonner";
import { useUserStore } from "./provider";
import { authApi } from "./api";
import { PropsWithChildren, useEffect } from "react";

export default function RefreshTokenProvider({ children }: PropsWithChildren) {
  const { setCurrentUser } = useUserStore((store) => store);

  const refreshToken = async () => {
    if (
      !document.cookie.split("; ").find((c) => c.startsWith("refreshToken="))
    ) {
      return;
    }

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

  return <>{children}</>;
}
