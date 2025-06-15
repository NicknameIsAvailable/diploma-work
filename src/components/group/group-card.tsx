import { IGroup } from "@/types/group";
import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { Badge } from "../ui/badge";
import {
  BookOpen,
  ChevronRight,
  GraduationCap,
  MapPin,
  Users,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { getGroupStatus, getYearRange } from "@/shared/utils";

export interface IGroupCard {
  group: IGroup;
}

export const GroupCard: FC<IGroupCard> = ({ group }) => {
  const groupStatus = getGroupStatus(group);

  return (
    <Card
      key={group.id}
      className="backdrop-blur-sm hover:shadow-lg transition-all duration-200 cursor-pointer group"
    >
      <CardHeader className="pb-4">
        <Link
          href={`/groups/${group.id}`}
          className="flex items-start justify-between"
        >
          <div>
            <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
              Группа {group.number}
            </CardTitle>
            <Badge variant={groupStatus.variant} className="mb-2">
              {groupStatus.status}
            </Badge>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
        </Link>
      </CardHeader>

      <Separator />

      <CardContent className="pt-4 space-y-4">
        {/* Course and Year */}
        <div className="flex items-center gap-3">
          <GraduationCap className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{group.course} курс</p>
            <p className="text-xs text-muted-foreground">
              {getYearRange(group)}
            </p>
          </div>
        </div>

        {/* Speciality */}
        {group.speciality && (
          <div className="flex items-start gap-3">
            <BookOpen className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">{group.speciality.title}</p>
              <p className="text-xs text-muted-foreground">
                Код: {group.speciality.code}
              </p>
            </div>
          </div>
        )}

        {/* Location */}
        {group.speciality?.location && (
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                {group.speciality.location.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {group.speciality.location.address}
              </p>
            </div>
          </div>
        )}

        {/* Curator */}
        {group.curator && (
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs">
                {group.curator.name?.[0]}
                {group.curator.surname?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">
                {group.curator.name} {group.curator.surname}
              </p>
              <p className="text-xs text-muted-foreground">Куратор</p>
            </div>
          </div>
        )}

        {/* Students count */}
        {group.students && (
          <div className="flex items-center gap-3 pt-2 border-t">
            <Users className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm">
              <span className="font-medium">{group.students.length}</span>{" "}
              студентов
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
