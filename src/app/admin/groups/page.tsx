"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Upload,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Calendar,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { IGroup } from "@/types/group";
import { groupApi } from "@/entities/group/api";
import { useToast } from "@/hooks/use-toast";
import { GroupFormDialog } from "@/components/admin/groups/group-form-dialog";
import { useQuery } from "@tanstack/react-query";
import { specialityApi } from "@/entities/speciality/api";
import { ISpeciality } from "@/types/user";

export interface IGroupFormData {
  number: string;
  course: number;
  specialityId: string;
  startYear?: number;
  endYear?: number;
}

const initialFormData: IGroupFormData = {
  number: "",
  course: 1,
  specialityId: "",
  startYear: new Date().getFullYear(),
  endYear: undefined,
};

export default function GroupsPage() {
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<IGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [specialityFilter, setSpecialityFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<IGroupFormData>(initialFormData);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [bulkGroups, setBulkGroups] = useState<string>("");
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { toast } = useToast();

  const { data: specialities } = useQuery({
    queryKey: specialityApi.queryKey,
    queryFn: specialityApi.endpoints.getAllSpecialities,
  });

  const loadGroups = async () => {
    try {
      setLoading(true);
      const data: IGroup[] = await groupApi.endpoints.getAllGroups();
      setGroups(data);
      setFilteredGroups(data);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список групп",
        variant: "destructive",
      });
      console.error("Error loading groups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  // Фильтрация групп
  useEffect(() => {
    let filtered = groups;

    // Поиск по номеру группы или специальности
    if (searchQuery) {
      filtered = filtered.filter(
        (group) =>
          group.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.speciality?.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          group.speciality?.code
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Фильтр по курсу
    if (courseFilter !== "all") {
      filtered = filtered.filter(
        (group) => group.course === parseInt(courseFilter)
      );
    }

    // Фильтр по специальности
    if (specialityFilter !== "all") {
      filtered = filtered.filter(
        (group) => group.specialityId === specialityFilter
      );
    }

    setFilteredGroups(filtered);
    setCurrentPage(1); // сбросить страницу при фильтрации
  }, [groups, searchQuery, courseFilter, specialityFilter]);

  // Пагинация
  const totalPages = Math.ceil(filteredGroups.length / pageSize);
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Получение уникальных курсов
  const uniqueCourses = [
    ...new Set(groups.map((group) => group.course)),
  ].sort();

  // Создание группы
  const handleCreateGroup = async () => {
    try {
      await groupApi.endpoints.createGroup(formData as IGroup);
      toast({
        title: "Успешно",
        description: "Группа создана",
      });
      setIsCreateDialogOpen(false);
      setFormData(initialFormData);
      loadGroups();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать группу",
        variant: "destructive",
      });
      console.error("Error creating group:", error);
    }
  };

  console.log({ editingGroupId });

  // Обновление группы
  const handleUpdateGroup = async () => {
    if (!editingGroupId) return;

    try {
      await groupApi.endpoints.updateGroup(editingGroupId, formData as IGroup);
      toast({
        title: "Успешно",
        description: "Группа обновлена",
      });
      setIsEditDialogOpen(false);
      setFormData(initialFormData);
      setEditingGroupId(null);
      loadGroups();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить группу",
        variant: "destructive",
      });
      console.error("Error updating group:", error);
    }
  };

  // Удаление группы
  const handleDeleteGroup = async (groupId: string) => {
    try {
      await groupApi.endpoints.deleteGroup(groupId);
      toast({
        title: "Успешно",
        description: "Группа удалена",
      });
      loadGroups();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить группу",
        variant: "destructive",
      });
      console.error("Error deleting group:", error);
    }
  };

  // Массовое создание групп
  const handleBulkCreate = async () => {
    try {
      const groupsData = JSON.parse(bulkGroups);
      if (!Array.isArray(groupsData)) {
        throw new Error("Данные должны быть массивом");
      }

      // Создаем группы по одной, так как нет метода createMany
      for (const groupData of groupsData) {
        await groupApi.endpoints.createGroup(groupData);
      }

      toast({
        title: "Успешно",
        description: `Создано ${groupsData.length} групп`,
      });
      setImportDialogOpen(false);
      setBulkGroups("");
      loadGroups();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать группы. Проверьте формат данных.",
        variant: "destructive",
      });
      console.error("Error bulk creating groups:", error);
    }
  };

  // Открытие диалога редактирования
  const openEditDialog = (group: IGroup) => {
    setFormData({
      number: group.number,
      course: group.course,
      specialityId: group.specialityId,
      startYear: group.startYear,
      endYear: group.endYear,
    });
    setEditingGroupId(group.id || null);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Управление группами
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Просмотр, создание и редактирование групп системы
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadGroups} disabled={loading}>
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
                <DialogTitle>Массовое создание групп</DialogTitle>
                <DialogDescription>
                  Введите JSON массив групп для создания
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder={`[
  {
    "number": "ПИ-21",
    "course": 3,
    "specialityId": "uuid-speciality-id",
    "startYear": 2021,
    "endYear": 2025
  },
  {
    "number": "ИС-22",
    "course": 2,
    "specialityId": "uuid-speciality-id-2",
    "startYear": 2022,
    "endYear": 2026
  }
]`}
                  value={bulkGroups}
                  onChange={(e) => setBulkGroups(e.target.value)}
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
                <Button onClick={handleBulkCreate}>Создать группы</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Добавить группу
          </Button>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего групп</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groups.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Специальностей
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{specialities?.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Курсов</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCourses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Студентов</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {groups.reduce(
                (sum, group) => sum + (group.students?.length || 0),
                0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры и поиск */}
      <Card>
        <CardHeader>
          <CardTitle>Список групп</CardTitle>
          <CardDescription>Управление всеми группами системы</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по номеру группы или специальности..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Курс" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все курсы</SelectItem>
                {uniqueCourses.map((course) => (
                  <SelectItem key={course} value={course.toString()}>
                    {course} курс
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={specialityFilter}
              onValueChange={setSpecialityFilter}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Специальность" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все специальности</SelectItem>
                {specialities?.map((speciality: ISpeciality, index: number) => (
                  <SelectItem
                    key={speciality.id || index}
                    value={speciality.id! || String(index)}
                  >
                    {speciality.code} - {speciality.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Таблица групп */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Группа</TableHead>
                  <TableHead>Специальность</TableHead>
                  <TableHead>Курс</TableHead>
                  <TableHead>Период обучения</TableHead>
                  <TableHead>Студентов</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Загрузка групп...
                    </TableCell>
                  </TableRow>
                ) : paginatedGroups.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Группы не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedGroups?.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                          </div>
                          <div className="font-medium">{group.number}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {group.speciality?.title || "Не указана"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {group.speciality?.code}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{group.course} курс</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {group.startYear && group.endYear ? (
                            <span>
                              {group.startYear} - {group.endYear}
                            </span>
                          ) : group.startYear ? (
                            <span>с {group.startYear}</span>
                          ) : (
                            <span className="text-muted-foreground italic">
                              Не указан
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            {group.students?.length || 0}
                          </span>
                          <Users className="w-4 h-4 text-muted-foreground" />
                        </div>
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
                              onClick={() => openEditDialog(group)}
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
                                    Удалить группу?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Это действие нельзя будет отменить. Группа{" "}
                                    <strong>{group.number}</strong> будет
                                    удалена навсегда.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteGroup(group.id!)}
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
      <GroupFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateGroup}
        formData={formData}
        setFormData={setFormData}
        specialities={specialities}
        title="Создание группы"
        description="Введите данные новой группы"
      />

      <GroupFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateGroup}
        formData={formData}
        setFormData={setFormData}
        specialities={specialities}
        title="Редактирование группы"
        description="Измените данные группы"
      />
    </div>
  );
}
