import { ILessonOrderFormData } from "@/app/admin/lesson-order/page";
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

export const LessonOrderFormDialog = ({
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
  formData: ILessonOrderFormData;
  setFormData: (data: ILessonOrderFormData) => void;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="label">Номер очереди</Label>
          <Input
            id="label"
            placeholder="Введите номер очереди"
            type="number"
            value={formData.order}
            onChange={(e) =>
              setFormData({ ...formData, order: Number(e.target.value) })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Время начала</Label>
          <Input
            id="label"
            placeholder="Введите время начала"
            type="time"
            value={formData.startTime}
            onChange={(e) =>
              setFormData({ ...formData, startTime: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Время конца</Label>
          <Input
            id="label"
            placeholder="Введите время конца"
            type="time"
            value={formData.endTime}
            onChange={(e) =>
              setFormData({ ...formData, endTime: e.target.value })
            }
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Отмена
        </Button>
        <Button onClick={onSubmit} disabled={!formData.order}>
          {title.includes("Создание") ? "Создать" : "Сохранить"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
