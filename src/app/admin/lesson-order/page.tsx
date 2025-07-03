"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Upload,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { lessonOrderApi } from "@/entities/lesson-order/api";
import { useToast } from "@/hooks/use-toast";
import { ILessonOrder } from "@/types/lesson";
import { LessonOrderFormDialog } from "@/components/admin/lesson-order/lesson-order-form";

export interface ILessonOrderFormData {
  order: number;
  startTime: string;
  endTime: string;
}

const initialFormData: ILessonOrderFormData = {
  order: 1,
  startTime: "",
  endTime: "",
};

export default function LessonOrderPage() {
  const [lessonOrders, setLessonOrders] = useState<ILessonOrder[]>([]);
  const [filteredLessonOrders, setFilteredLessonOrders] = useState<
    ILessonOrder[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] =
    useState<ILessonOrderFormData>(initialFormData);
  const [editingLessonOrderId, setEditingLessonOrderId] = useState<
    string | null
  >(null);
  const [bulkLessonOrders, setBulkLessonOrders] = useState<string>("");
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { toast } = useToast();

  // Загрузка порядка занятий
  const loadLessonOrders = async () => {
    try {
      setLoading(true);
      const data = await lessonOrderApi.endpoints.getAllLessonOrder();
      setLessonOrders(data);
      setFilteredLessonOrders(data);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список порядка занятий",
        variant: "destructive",
      });
      console.error("Error loading lesson orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessonOrders();
  }, []);

  // Фильтрация порядка занятий
  useEffect(() => {
    let filtered = lessonOrders;

    // Поиск по времени или порядку
    if (searchQuery) {
      filtered = filtered.filter(
        (lessonOrder) =>
          lessonOrder.order.toString().includes(searchQuery) ||
          lessonOrder.startTime.includes(searchQuery) ||
          lessonOrder.endTime.includes(searchQuery)
      );
    }

    setFilteredLessonOrders(filtered);
    setCurrentPage(1);
  }, [lessonOrders, searchQuery]);

  // Пагинация
  const totalPages = Math.ceil(filteredLessonOrders.length / pageSize);
  const paginatedLessonOrders = filteredLessonOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Создание порядка занятий
  const handleCreateLessonOrder = async () => {
    try {
      await lessonOrderApi.endpoints.createLessonOrder({
        ...formData,
      } as ILessonOrder);
      toast({
        title: "Успешно",
        description: "Порядок занятий создан",
      });
      setIsCreateDialogOpen(false);
      setFormData(initialFormData);
      loadLessonOrders();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать порядок занятий",
        variant: "destructive",
      });
      console.error("Error creating lesson order:", error);
    }
  };

  // Обновление порядка занятий
  const handleUpdateLessonOrder = async () => {
    if (!editingLessonOrderId) return;

    try {
      await lessonOrderApi.endpoints.updateLessonOrder(
        editingLessonOrderId,
        formData as Partial<ILessonOrder>
      );
      toast({
        title: "Успешно",
        description: "Порядок занятий обновлен",
      });
      setIsEditDialogOpen(false);
      setFormData(initialFormData);
      setEditingLessonOrderId(null);
      loadLessonOrders();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить порядок занятий",
        variant: "destructive",
      });
      console.error("Error updating lesson order:", error);
    }
  };

  // Удаление порядка занятий
  const handleDeleteLessonOrder = async (lessonOrderId: string) => {
    try {
      await lessonOrderApi.endpoints.deleteLessonOrder(lessonOrderId);
      toast({
        title: "Успешно",
        description: "Порядок занятий удален",
      });
      loadLessonOrders();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить порядок занятий",
        variant: "destructive",
      });
      console.error("Error deleting lesson order:", error);
    }
  };

  // Массовое создание порядка занятий
  const handleBulkCreate = async () => {
    try {
      const lessonOrdersData = JSON.parse(bulkLessonOrders);
      if (!Array.isArray(lessonOrdersData)) {
        throw new Error("Данные должны быть массивом");
      }

      for (const lessonOrderData of lessonOrdersData) {
        await lessonOrderApi.endpoints.createLessonOrder({
          ...lessonOrderData,
          scheduleLessons: [],
        });
      }

      toast({
        title: "Успешно",
        description: `Создано ${lessonOrdersData.length} записей порядка занятий`,
      });
      setImportDialogOpen(false);
      setBulkLessonOrders("");
      loadLessonOrders();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать записи. Проверьте формат данных.",
        variant: "destructive",
      });
      console.error("Error bulk creating lesson orders:", error);
    }
  };

  // Открытие диалога редактирования
  const openEditDialog = (lessonOrder: ILessonOrder) => {
    setFormData({
      order: lessonOrder.order,
      startTime: lessonOrder.startTime,
      endTime: lessonOrder.endTime,
    });
    setEditingLessonOrderId(lessonOrder.id || null);
    setIsEditDialogOpen(true);
  };

  // Форматирование времени
  const formatTime = (time: string) => {
    return time || "--:--";
  };

  // Вычисление длительности
  const calculateDuration = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return "--";

    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const duration = endMinutes - startMinutes;

    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    if (hours > 0) {
      return `${hours}ч ${minutes}м`;
    }
    return `${minutes}м`;
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Управление порядком занятий
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Просмотр, создание и редактирование расписания времени занятий
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={loadLessonOrders}
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
                <DialogTitle>Массовое создание порядка занятий</DialogTitle>
                <DialogDescription>
                  Введите JSON массив записей для создания
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder={`[
  {
    "order": 1,
    "startTime": "08:00",
    "endTime": "09:30"
  },
  {
    "order": 2,
    "startTime": "09:45",
    "endTime": "11:15"
  }
]`}
                  value={bulkLessonOrders}
                  onChange={(e) => setBulkLessonOrders(e.target.value)}
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
            Добавить время
          </Button>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Всего периодов
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lessonOrders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Утренние</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                lessonOrders.filter((lo) => {
                  const hour = parseInt(lo.startTime?.split(":")[0] || "0");
                  return hour < 12;
                }).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Дневные</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                lessonOrders.filter((lo) => {
                  const hour = parseInt(lo.startTime?.split(":")[0] || "0");
                  return hour >= 12 && hour < 18;
                }).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Вечерние</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                lessonOrders.filter((lo) => {
                  const hour = parseInt(lo.startTime?.split(":")[0] || "0");
                  return hour >= 18;
                }).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры и поиск */}
      <Card>
        <CardHeader>
          <CardTitle>Список времени занятий</CardTitle>
          <CardDescription>
            Управление временными периодами занятий
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по порядку или времени..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Таблица порядка занятий */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Порядок</TableHead>
                  <TableHead>Время начала</TableHead>
                  <TableHead>Время окончания</TableHead>
                  <TableHead>Длительность</TableHead>
                  <TableHead>Количество занятий</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Загрузка времени занятий...
                    </TableCell>
                  </TableRow>
                ) : paginatedLessonOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Время занятий не найдено
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLessonOrders?.map((lessonOrder) => (
                    <TableRow key={lessonOrder.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                              {lessonOrder.order}
                            </span>
                          </div>
                          <Badge variant="outline">
                            {lessonOrder.order}-й урок
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-mono">
                            {formatTime(lessonOrder.startTime)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-mono">
                            {formatTime(lessonOrder.endTime)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {calculateDuration(
                            lessonOrder.startTime,
                            lessonOrder.endTime
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {lessonOrder.scheduleLessons?.length || 0} занятий
                          </span>
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
                              onClick={() => openEditDialog(lessonOrder)}
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
                                    Удалить время занятий?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Это действие нельзя будет отменить. Время
                                    занятий{" "}
                                    <strong>
                                      {lessonOrder.order}-я пара (
                                      {formatTime(lessonOrder.startTime)} -{" "}
                                      {formatTime(lessonOrder.endTime)})
                                    </strong>{" "}
                                    будет удалено навсегда.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteLessonOrder(lessonOrder.id!)
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

      <LessonOrderFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateLessonOrder}
        formData={formData}
        setFormData={setFormData}
        title="Создание времени занятий"
        description="Введите данные нового временного периода"
      />

      <LessonOrderFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateLessonOrder}
        formData={formData}
        setFormData={setFormData}
        title="Редактирование времени занятий"
        description="Измените данные временного периода"
      />
    </div>
  );
}
