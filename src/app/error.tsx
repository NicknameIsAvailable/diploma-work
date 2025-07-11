"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, RefreshCw, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-destructive via-primary to-secondary bg-clip-text text-transparent animate-pulse">
                500
              </h1>
            </div>

            <Card className="backdrop-blur-sm border-2 mb-8 shadow-xl">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-gradient-to-r from-red-100 to-yellow-100 rounded-full">
                      <AlertTriangle className="w-16 h-16 text-red-600" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold mb-3">
                    Внутренняя ошибка сервера
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Произошла непредвиденная ошибка. Пожалуйста, попробуйте
                    обновить страницу или вернуться позже.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/">
                    <Button size="lg" className="w-full sm:w-auto">
                      <Home className="w-5 h-5 mr-2" />
                      На главную
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                    onClick={() => window.history.back()}
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Назад
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                    onClick={() => window.location.reload()}
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Обновить
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
