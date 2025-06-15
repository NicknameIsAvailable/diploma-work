"use client";

import { ScheduleStoreProvider } from "@/entities/schedule/provider";
import { FC, PropsWithChildren } from "react";
import { ThemeProvider } from "../theme-provider";
import { QueryProvider } from "@/entities/queryClient";
import { Toaster } from "../ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { UserStoreProvider } from "@/entities/auth/provider";
import RefreshTokenProvider from "@/entities/auth/refresh-token-provider";

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryProvider>
      <NuqsAdapter>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <SidebarProvider> */}
          <ScheduleStoreProvider>
            <UserStoreProvider>
              <RefreshTokenProvider>
                <Toaster />
                {children}
              </RefreshTokenProvider>
            </UserStoreProvider>
          </ScheduleStoreProvider>
          {/* </SidebarProvider> */}
        </ThemeProvider>
      </NuqsAdapter>
    </QueryProvider>
  );
};
