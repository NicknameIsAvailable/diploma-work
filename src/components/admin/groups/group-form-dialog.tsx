import { IGroupFormData } from "@/app/admin/groups/page";
import { ISpeciality } from "@/types/user";
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

export const GroupFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  title,
  description,
  formData,
  setFormData,
  specialities,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  title: string;
  description: string;
  formData: IGroupFormData;
  setFormData: (data: IGroupFormData) => void;
  specialities: ISpeciality[];
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  const courses = [1, 2, 3, 4, 5, 6];

  const isFormValid = formData.number.trim() && formData.specialityId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="number">Номер группы</Label>
            <Input
              id="number"
              placeholder="Например: ПИ-21, ИС-22"
              value={formData.number}
              onChange={(e) =>
                setFormData({ ...formData, number: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="speciality">Специальность</Label>
            <Select
              value={formData.specialityId}
              onValueChange={(value) =>
                setFormData({ ...formData, specialityId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите специальность" />
              </SelectTrigger>
              <SelectContent>
                {specialities?.map((speciality, index) => (
                  <SelectItem
                    key={speciality.id || index}
                    value={speciality.id! || String(index)}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{speciality.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {speciality.code}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Курс</Label>
            <Select
              value={formData.course.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, course: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите курс" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course} value={course.toString()}>
                    {course} курс
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startYear">Год поступления</Label>
              <Select
                value={formData.startYear?.toString() || ""}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    startYear: value ? parseInt(value) : undefined,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите год" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endYear">Год выпуска</Label>
              <Select
                value={formData.endYear?.toString() || ""}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    endYear: value ? parseInt(value) : undefined,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите год" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.startYear &&
            formData.endYear &&
            formData.endYear <= formData.startYear && (
              <div className="text-sm text-red-500">
                Год выпуска должен быть больше года поступления
              </div>
            )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button
            onClick={onSubmit}
            disabled={Boolean(
              !isFormValid ||
                (formData.startYear &&
                  formData.endYear &&
                  formData.endYear <= formData.startYear)
            )}
          >
            {title.includes("Создание") ? "Создать" : "Сохранить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
