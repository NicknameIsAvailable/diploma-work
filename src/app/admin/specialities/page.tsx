"use client";

import { useState, useEffect } from "react";
import {
  GraduationCap,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Upload,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Users,
  BookOpen,
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { SpecialtyFormDialog } from "@/components/admin/specialities/specialty-form";
import { IUser } from "@/types/user";
import { IGroup } from "@/types/group";
import { ISpeciality } from "@/entities/speciality/types";
import { specialityApi } from "@/entities/speciality/api";

// Временные типы - замените на реальные из вашего проекта
interface ISpecialty {
  id?: string;
  title: string;
  code: string;
  description?: string;
  students?: IUser[];
  groups?: IGroup[];
}

export interface ISpecialtyFormData {
  title: string;
  code: string;
  number: string;
  description: string;
}

const initialFormData: ISpecialtyFormData = {
  title: "",
  code: "",
  number: "",
  description: "",
};

export default function SpecialtyPage() {
  const [specialties, setSpecialties] = useState<ISpecialty[]>([]);
  const [filteredSpecialties, setFilteredSpecialties] = useState<ISpecialty[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ISpecialtyFormData>(initialFormData);
  const [editingSpecialtyId, setEditingSpecialtyId] = useState<string | null>(
    null
  );
  const [bulkSpecialties, setBulkSpecialties] = useState<string>("");
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { toast } = useToast();

  // Загрузка специальностей
  const loadSpecialties = async () => {
    try {
      setLoading(true);
      const data = await specialityApi.endpoints.getAllSpecialities();
      setSpecialties(data);
      setFilteredSpecialties(data);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список специальностей",
        variant: "destructive",
      });
      console.error("Error loading specialties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpecialties();
  }, []);

  // Фильтрация специальностей
  useEffect(() => {
    let filtered = specialties;

    // Поиск по названию, коду или описанию
    if (searchQuery) {
      filtered = filtered.filter(
        (specialty) =>
          specialty.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          specialty.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          specialty.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    setFilteredSpecialties(filtered);
    setCurrentPage(1);
  }, [specialties, searchQuery]);

  // Пагинация
  const totalPages = Math.ceil(filteredSpecialties.length / pageSize);
  const paginatedSpecialties = filteredSpecialties.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Создание специальности
  const handleCreateSpecialty = async () => {
    try {
      await specialityApi.endpoints.createSpeciality({
        title: formData.title,
        number: formData.code,
        code: formData.code,
        description: formData.description,
      } as ISpeciality);
      toast({
        title: "Успешно",
        description: "Специальность создана",
      });
      setIsCreateDialogOpen(false);
      setFormData(initialFormData);
      loadSpecialties();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать специальность",
        variant: "destructive",
      });
      console.error("Error creating specialty:", error);
    }
  };

  // Обновление специальности
  const handleUpdateSpecialty = async () => {
    if (!editingSpecialtyId) return;

    try {
      await specialityApi.endpoints.updateSpeciality(
        editingSpecialtyId,
        formData as Partial<ISpeciality>
      );
      toast({
        title: "Успешно",
        description: "Специальность обновлена",
      });
      setIsEditDialogOpen(false);
      setFormData(initialFormData);
      setEditingSpecialtyId(null);
      loadSpecialties();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить специальность",
        variant: "destructive",
      });
      console.error("Error updating specialty:", error);
    }
  };

  // Удаление специальности
  const handleDeleteSpecialty = async (specialtyId: string) => {
    try {
      await specialityApi.endpoints.deleteSpeciality(specialtyId);
      toast({
        title: "Успешно",
        description: "Специальность удалена",
      });
      loadSpecialties();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить специальность",
        variant: "destructive",
      });
      console.error("Error deleting specialty:", error);
    }
  };

  // Массовое создание специальностей
  const handleBulkCreate = async () => {
    try {
      const specialtiesData = JSON.parse(bulkSpecialties);
      if (!Array.isArray(specialtiesData)) {
        throw new Error("Данные должны быть массивом");
      }

      for (const specialtyData of specialtiesData) {
        await specialityApi.endpoints.createSpeciality({
          ...specialtyData,
        } as ISpeciality);
      }

      toast({
        title: "Успешно",
        description: `Создано ${specialtiesData.length} специальностей`,
      });
      setImportDialogOpen(false);
      setBulkSpecialties("");
      loadSpecialties();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать записи. Проверьте формат данных.",
        variant: "destructive",
      });
      console.error("Error bulk creating specialties:", error);
    }
  };

  // Открытие диалога редактирования
  const openEditDialog = (specialty: ISpecialty) => {
    setFormData({
      title: specialty.title,
      code: specialty.code,
      number: specialty.code,
      description: specialty.description || "",
    });
    setEditingSpecialtyId(specialty.id || null);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Управление специальностями
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Просмотр, создание и редактирование специальностей учебного
            заведения
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={loadSpecialties}
            disabled={loading}
          >
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
                <DialogTitle>Массовое создание специальностей</DialogTitle>
                <DialogDescription>
                  Введите JSON массив специальностей для создания
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder={`[
  {
    "name": "Информационные технологии",
    "code": "09.02.07",
    "description": "Разработка программного обеспечения"
  },
  {
    "name": "Экономика и бухгалтерский учет",
    "code": "38.02.01",
    "description": "Экономическая деятельность предприятий"
  }
]`}
                  value={bulkSpecialties}
                  onChange={(e) => setBulkSpecialties(e.target.value)}
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
                <Button onClick={handleBulkCreate}>Создать записи</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Добавить специальность
          </Button>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Всего специальностей
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{specialties.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Всего студентов
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {specialties.reduce(
                (acc, s) => acc + (s.students?.length || 0),
                0
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего групп</CardTitle>
            <BookOpen className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {specialties.reduce((acc, s) => acc + (s.groups?.length || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры и поиск */}
      <Card>
        <CardHeader>
          <CardTitle>Список специальностей</CardTitle>
          <CardDescription>
            Управление специальностями учебного заведения
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию, коду или описанию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Таблица специальностей */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Специальность</TableHead>
                  <TableHead>Код</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Студенты</TableHead>
                  <TableHead>Группы</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Загрузка специальностей...
                    </TableCell>
                  </TableRow>
                ) : paginatedSpecialties.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Специальности не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedSpecialties?.map((specialty) => (
                    <TableRow key={specialty.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                          </div>
                          <div>
                            <div className="font-medium">{specialty.title}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {specialty.code}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate text-sm text-muted-foreground">
                          {specialty.description || "Описание отсутствует"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {specialty.students?.length || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {specialty.groups?.length || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={"default"}>{"Активна"}</Badge>
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
                              onClick={() => openEditDialog(specialty)}
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
                                    Удалить специальность?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Это действие нельзя будет отменить.
                                    Специальность{" "}
                                    <strong>
                                      {specialty.title} ({specialty.code})
                                    </strong>{" "}
                                    будет удалена навсегда.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteSpecialty(specialty.id!)
                                    }
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

      <SpecialtyFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateSpecialty}
        formData={formData}
        setFormData={setFormData}
        title="Создание специальности"
        description="Введите данные новой специальности"
      />

      <SpecialtyFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateSpecialty}
        formData={formData}
        setFormData={setFormData}
        title="Редактирование специальности"
        description="Измените данные специальности"
      />
    </div>
  );
}
