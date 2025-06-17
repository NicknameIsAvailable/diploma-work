"use client";

import { useState, useEffect } from "react";
import {
  User,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Upload,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { IUser, EUserRole } from "@/types/user";
import { userApi } from "@/entities/user/api";
import { useToast } from "@/hooks/use-toast";
import { UserFormDialog } from "@/components/admin/user/user-form-dialog";

export interface UserFormData {
  name: string;
  surname: string;
  email: string;
  login: string;
  password: string;
  repeatPassword: string;
  role: EUserRole;
  groupId?: string;
}

const initialFormData: UserFormData = {
  name: "",
  surname: "",
  email: "",
  login: "",
  password: "",
  repeatPassword: "",
  role: EUserRole.STUDENT,
  groupId: undefined,
};

export default function UsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [bulkUsers, setBulkUsers] = useState<string>("");
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { toast } = useToast();

  // Загрузка пользователей
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userApi.endpoints.getAllUser();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список пользователей",
        variant: "destructive",
      });
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Соберите список всех групп пользователей для фильтра
  const allGroups = Array.from(
    new Set(users.map((u) => u.studentGroup?.number).filter(Boolean))
  ) as string[];

  // Фильтрация пользователей
  useEffect(() => {
    let filtered = users;

    // Поиск по имени, фамилии, email или логину
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.login.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Фильтр по роли
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Фильтр по группе
    if (groupFilter !== "all") {
      filtered = filtered.filter(
        (user) => user.studentGroup?.number === groupFilter
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // сбросить страницу при фильтрации
  }, [users, searchQuery, roleFilter, groupFilter]);

  // Пагинация
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Создание пользователя
  const handleCreateUser = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await userApi.endpoints.createUser(formData as any as IUser);
      toast({
        title: "Успешно",
        description: "Пользователь создан",
      });
      setIsCreateDialogOpen(false);
      setFormData(initialFormData);
      loadUsers();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать пользователя",
        variant: "destructive",
      });
      console.error("Error creating user:", error);
    }
  };

  // Обновление пользователя
  const handleUpdateUser = async () => {
    if (!editingUserId) return;

    try {
      await userApi.endpoints.updateUser(editingUserId, formData);
      toast({
        title: "Успешно",
        description: "Пользователь обновлён",
      });
      setIsEditDialogOpen(false);
      setFormData(initialFormData);
      setEditingUserId(null);
      loadUsers();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить пользователя",
        variant: "destructive",
      });
      console.error("Error updating user:", error);
    }
  };

  // Удаление пользователя
  const handleDeleteUser = async (userId: string) => {
    try {
      await userApi.endpoints.deleteUser(userId);
      toast({
        title: "Успешно",
        description: "Пользователь удалён",
      });
      loadUsers();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить пользователя",
        variant: "destructive",
      });
      console.error("Error deleting user:", error);
    }
  };

  // Массовое создание пользователей
  const handleBulkCreate = async () => {
    try {
      const usersData = JSON.parse(bulkUsers);
      if (!Array.isArray(usersData)) {
        throw new Error("Данные должны быть массивом");
      }

      await userApi.endpoints.createManyUser(usersData);
      toast({
        title: "Успешно",
        description: `Создано ${usersData.length} пользователей`,
      });
      setImportDialogOpen(false);
      setBulkUsers("");
      loadUsers();
    } catch (error) {
      toast({
        title: "Ошибка",
        description:
          "Не удалось создать пользователей. Проверьте формат данных.",
        variant: "destructive",
      });
      console.error("Error bulk creating users:", error);
    }
  };

  // Открытие диалога редактирования
  const openEditDialog = (user: IUser) => {
    setFormData({
      name: user.name,
      surname: user.surname,
      email: user.email,
      login: user.login,
      role: user.role,
      password: "",
      repeatPassword: "",
      groupId: user.studentGroupId,
    });
    setEditingUserId(user.id);
    setIsEditDialogOpen(true);
  };

  // Получение цвета роли
  const getRoleColor = (role: EUserRole) => {
    switch (role) {
      case EUserRole.ADMIN:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case EUserRole.TEACHER:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case EUserRole.STUDENT:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Получение текста роли
  const getRoleText = (role: EUserRole) => {
    switch (role) {
      case EUserRole.ADMIN:
        return "Администратор";
      case EUserRole.TEACHER:
        return "Преподаватель";
      case EUserRole.STUDENT:
        return "Студент";
      default:
        return role;
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Управление пользователями
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Просмотр, создание и редактирование пользователей системы
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadUsers} disabled={loading}>
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Обновить
          </Button>
          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Импорт
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Массовое создание пользователей</DialogTitle>
                <DialogDescription>
                  Введите JSON массив пользователей для создания
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder={`[
  {
    "name": "Иван",
    "surname": "Иванов",
    "email": "ivan@example.com",
    "login": "ivan123",
    "role": "STUDENT"
  }
]`}
                  value={bulkUsers}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(e: any) => setBulkUsers(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setImportDialogOpen(false)}
                >
                  Отмена
                </Button>
                <Button onClick={handleBulkCreate}>
                  Создать пользователей
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Добавить пользователя
          </Button>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Всего пользователей
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Администраторы
            </CardTitle>
            <User className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.role === EUserRole.ADMIN).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Преподаватели</CardTitle>
            <User className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.role === EUserRole.TEACHER).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Студенты</CardTitle>
            <User className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.role === EUserRole.STUDENT).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры и поиск */}
      <Card>
        <CardHeader>
          <CardTitle>Список пользователей</CardTitle>
          <CardDescription>
            Управление всеми пользователями системы
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 min-w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по имени, фамилии, email или логину..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="sm:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Фильтр по роли" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все роли</SelectItem>
                <SelectItem value={EUserRole.ADMIN}>Администраторы</SelectItem>
                <SelectItem value={EUserRole.TEACHER}>Преподаватели</SelectItem>
                <SelectItem value={EUserRole.STUDENT}>Студенты</SelectItem>
              </SelectContent>
            </Select>
            {/* Фильтр по группе */}
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger className="sm:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Фильтр по группе" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все группы</SelectItem>
                {allGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    Группа {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Таблица пользователей */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Пользователь</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Логин</TableHead>
                  <TableHead>Роль</TableHead>
                  <TableHead>Создан</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Загрузка пользователей...
                    </TableCell>
                  </TableRow>
                ) : paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Пользователи не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {user.name} {user.surname}
                            </div>
                            {user.studentGroup && (
                              <div className="text-sm text-muted-foreground">
                                Группа: {user.studentGroup.number}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="font-mono">{user.login}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {getRoleText(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("ru-RU")
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Действия</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => openEditDialog(user)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Редактировать
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Удалить
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Удалить пользователя?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Это действие нельзя будет отменить.
                                    Пользователь{" "}
                                    <strong>
                                      {user.name} {user.surname}
                                    </strong>{" "}
                                    будет удалён навсегда.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Удалить
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Пагинация */}
          <div className="flex justify-end items-center gap-2 mt-4">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span>
              Страница {currentPage} из {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Диалоги */}
      <UserFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateUser}
        formData={formData}
        setFormData={setFormData}
        title="Создание пользователя"
        description="Введите данные нового пользователя"
      />

      <UserFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateUser}
        formData={formData}
        setFormData={setFormData}
        title="Редактирование пользователя"
        description="Измените данные пользователя"
      />
    </div>
  );
}
