import { FC, PropsWithChildren } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { groupApi } from "@/entities/group/api";
import { Loader } from "lucide-react";
import { UserCard } from "../user/user-card";
import { ScrollArea } from "../ui/scroll-area";
import { IUser } from "@/types/user";
import { IGroupResponse } from "@/entities/group/types";

export interface IGroupDialog extends PropsWithChildren {
  id: string;
}

export const GroupDialog: FC<IGroupDialog> = ({ children, id }) => {
  const { data: group, isLoading: groupLoading } = useQuery<IGroupResponse>({
    queryKey: [...groupApi.queryKey, id],
    queryFn: () => groupApi.endpoints.getGroupById(id),
  });

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        {groupLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader className="animate-spin h-20 w-20" />
          </div>
        ) : (
          <>
            <DialogTitle>Группа {group?.number}</DialogTitle>
            <DialogDescription>{group?.label}</DialogDescription>
            <div className="flex flex-col gap-4">
              <div className="gap-2">
                <h3>Куратор</h3>
                {group?.curator && <UserCard user={group?.curator} />}{" "}
              </div>
              <div>
                <h3>Студенты</h3>
                <ScrollArea className="rounded-md h-52 border flex flex-col gap-4 p-2">
                  {group?.students &&
                    group?.students.map((student: IUser) => (
                      <div key={student.id} className="mb-2">
                        <UserCard user={student} />
                      </div>
                    ))}
                </ScrollArea>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
