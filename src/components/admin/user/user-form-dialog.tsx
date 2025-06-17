"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { groupApi } from "@/entities/group/api";
import { IGroup } from "@/types/group";
import { EUserRole, UserFormData } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export const UserFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  title,
  description,
  formData,
  setFormData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  title: string;
  description: string;
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
}) => {
  const { data: groups } = useQuery({
    queryKey: groupApi.queryKey,
    queryFn: groupApi.endpoints.getAllGroups,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Введите имя"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="surname">Фамилия</Label>
              <Input
                id="surname"
                value={formData.surname}
                onChange={(e) =>
                  setFormData({ ...formData, surname: e.target.value })
                }
                placeholder="Введите фамилию"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Введите email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login">Логин</Label>
            <Input
              id="login"
              value={formData.login}
              onChange={(e) =>
                setFormData({ ...formData, login: e.target.value })
              }
              placeholder="Введите логин"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login">Пароль</Label>
            <Input
              id="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Введите пароль"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login">Повторите пароль</Label>
            <Input
              id="repeatPassword"
              value={formData.repeatPassword}
              onChange={(e) =>
                setFormData({ ...formData, repeatPassword: e.target.value })
              }
              placeholder="Введите пароль"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Роль</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value as EUserRole })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите роль" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={EUserRole.ADMIN}>Администратор</SelectItem>
                <SelectItem value={EUserRole.TEACHER}>Преподаватель</SelectItem>
                <SelectItem value={EUserRole.STUDENT}>Студент</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.role === EUserRole.STUDENT && (
            <div className="space-y-2">
              <Label htmlFor="studentGroupId">Группа</Label>
              <Select
                value={formData.groupId}
                onValueChange={(value) =>
                  setFormData({ ...formData, groupId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите группу" />
                </SelectTrigger>
                <SelectContent>
                  {groups?.map((group: IGroup) => (
                    <SelectItem value={group.id} key={group.id}>
                      {group.number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={onSubmit}>
            {title.includes("Создание") ? "Создать" : "Сохранить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
