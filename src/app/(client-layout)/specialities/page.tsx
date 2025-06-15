import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { specialityApi } from "@/entities/speciality/api";
import { ISpeciality } from "@/entities/speciality/types";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function SpecialitiesPage() {
  const specialities = await specialityApi.endpoints.getAllSpecialities();

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Учебные специальности</h1>
          <p>Список всех учебных специальностей и их информация</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialities.map((speciality: ISpeciality) => (
            <Card
              key={speciality.id}
              className="backdrop-blur-sm hover:shadow-lg transition-all duration-200 cursor-pointer group"
            >
              <CardHeader className="pb-4">
                <Link
                  href={`/specialities/${speciality.id}`}
                  className="flex items-start justify-between"
                >
                  <div>
                    <CardTitle>{speciality.title}</CardTitle>
                    <Badge className="mt-2 mb-2">{speciality.code}</Badge>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
              </CardHeader>
              <Separator />
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
