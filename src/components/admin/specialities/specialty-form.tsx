import { ISpecialtyFormData } from "@/app/admin/specialities/page";
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
import { Textarea } from "@/components/ui/textarea";

export const SpecialtyFormDialog = ({
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
  formData: ISpecialtyFormData;
  setFormData: (data: ISpecialtyFormData) => void;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Название специальности</Label>
          <Input
            id="name"
            placeholder="Введите название специальности"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="code">Код специальности</Label>
          <Input
            id="code"
            placeholder="Введите код специальности (например, 09.02.07)"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            placeholder="Введите описание специальности"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="min-h-[100px]"
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Отмена
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!formData.title.trim() || !formData.code.trim()}
        >
          {title.includes("Создание") ? "Создать" : "Сохранить"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
