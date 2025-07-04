"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Search,
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
import { ILesson } from "@/types/lesson";
import { lessonApi } from "@/entities/lesson/api";
import { useToast } from "@/hooks/use-toast";
import { LessonFormDialog } from "@/components/admin/lesson/lesson-form-dialog";

export interface ILessonFormData {
  label: string;
  description: string;
}

const initialFormData: ILessonFormData = {
  label: "",
  description: "",
};

export default function LessonsPage() {
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<ILesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ILessonFormData>(initialFormData);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [bulkLessons, setBulkLessons] = useState<string>("");
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { toast } = useToast();

  // Загрузка дисциплин
  const loadLessons = async () => {
    try {
      setLoading(true);
      const data = await lessonApi.endpoints.getAllLesson();
      setLessons(data);
      setFilteredLessons(data);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список дисциплин",
        variant: "destructive",
      });
      console.error("Error loading lessons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
  }, []);

  // Фильтрация дисциплин
  useEffect(() => {
    let filtered = lessons;

    // Поиск по названию или описанию
    if (searchQuery) {
      filtered = filtered.filter(
        (lesson) =>
          lesson.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredLessons(filtered);
    setCurrentPage(1); // сбросить страницу при фильтрации
  }, [lessons, searchQuery]);

  // Пагинация
  const totalPages = Math.ceil(filteredLessons.length / pageSize);
  const paginatedLessons = filteredLessons.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Создание дисциплины
  const handleCreateLesson = async () => {
    try {
      await lessonApi.endpoints.createLesson(formData as ILesson);
      toast({
        title: "Успешно",
        description: "Дисциплина создана",
      });
      setIsCreateDialogOpen(false);
      setFormData(initialFormData);
      loadLessons();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать дисциплину",
        variant: "destructive",
      });
      console.error("Error creating lesson:", error);
    }
  };

  // Обновление дисциплины
  const handleUpdateLesson = async () => {
    if (!editingLessonId) return;

    try {
      await lessonApi.endpoints.updateLesson(
        editingLessonId,
        formData as ILesson
      );
      toast({
        title: "Успешно",
        description: "Дисциплина обновлена",
      });
      setIsEditDialogOpen(false);
      setFormData(initialFormData);
      setEditingLessonId(null);
      loadLessons();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить дисциплину",
        variant: "destructive",
      });
      console.error("Error updating lesson:", error);
    }
  };

  // Удаление дисциплины
  const handleDeleteLesson = async (lessonId: string) => {
    try {
      await lessonApi.endpoints.deleteLesson(lessonId);
      toast({
        title: "Успешно",
        description: "Дисциплина удалена",
      });
      loadLessons();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить дисциплину",
        variant: "destructive",
      });
      console.error("Error deleting lesson:", error);
    }
  };

  // Массовое создание дисциплин
  const handleBulkCreate = async () => {
    try {
      const lessonsData = JSON.parse(bulkLessons);
      if (!Array.isArray(lessonsData)) {
        throw new Error("Данные должны быть массивом");
      }

      // Создаем дисциплины по одной, так как нет метода createMany
      for (const lessonData of lessonsData) {
        await lessonApi.endpoints.createLesson(lessonData);
      }

      toast({
        title: "Успешно",
        description: `Создано ${lessonsData.length} дисциплин`,
      });
      setImportDialogOpen(false);
      setBulkLessons("");
      loadLessons();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать дисциплины. Проверьте формат данных.",
        variant: "destructive",
      });
      console.error("Error bulk creating lessons:", error);
    }
  };

  // Открытие диалога редактирования
  const openEditDialog = (lesson: ILesson) => {
    setFormData({
      label: lesson.label,
      description: lesson.description,
    });
    setEditingLessonId(lesson.id || null);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Управление дисциплинами
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Просмотр, создание и редактирование дисциплин системы
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadLessons} disabled={loading}>
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
                <DialogTitle>Массовое создание дисциплин</DialogTitle>
                <DialogDescription>
                  Введите JSON массив дисциплин для создания
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder={`[
  {
    "label": "Математический анализ",
    "description": "Основы математического анализа"
  },
  {
    "label": "Программирование",
    "description": "Основы программирования"
  }
]`}
                  value={bulkLessons}
                  onChange={(e) => setBulkLessons(e.target.value)}
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
                <Button onClick={handleBulkCreate}>Создать дисциплины</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Добавить дисциплину
          </Button>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Всего дисциплин
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lessons.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">С описанием</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lessons.filter((l) => l.description.trim().length > 0).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Без описания</CardTitle>
            <BookOpen className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lessons.filter((l) => l.description.trim().length === 0).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры и поиск */}
      <Card>
        <CardHeader>
          <CardTitle>Список дисциплин</CardTitle>
          <CardDescription>
            Управление всеми дисциплинами системы
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию или описанию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Таблица дисциплин */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Загрузка дисциплин...
                    </TableCell>
                  </TableRow>
                ) : paginatedLessons.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Дисциплины не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLessons?.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                          </div>
                          <div className="font-medium">{lesson.label}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md">
                          {lesson.description ? (
                            <span className="text-sm text-muted-foreground">
                              {lesson.description.length > 100
                                ? `${lesson.description.substring(0, 100)}...`
                                : lesson.description}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">
                              Описание отсутствует
                            </span>
                          )}
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
                              onClick={() => openEditDialog(lesson)}
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
                                    Удалить дисциплину?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Это действие нельзя будет отменить.
                                    Дисциплина <strong>{lesson.label}</strong>{" "}
                                    будет удалена навсегда.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteLesson(lesson.id!)
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

      {/* Диалоги */}
      <LessonFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateLesson}
        formData={formData}
        setFormData={setFormData}
        title="Создание дисциплины"
        description="Введите данные новой дисциплины"
      />

      <LessonFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateLesson}
        formData={formData}
        setFormData={setFormData}
        title="Редактирование дисциплины"
        description="Измените данные дисциплины"
      />
    </div>
  );
}
