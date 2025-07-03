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

export interface ISpecialityFormData {
  title: string;
  number: string;
  code: string;
  description: string;
}

export const SpecialityFormDialog = ({
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
  formData: ISpecialityFormData;
  setFormData: (data: ISpecialityFormData) => void;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Название специальности</Label>
          <Input
            id="title"
            placeholder="Введите название"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="number">Номер специальности</Label>
          <Input
            id="number"
            placeholder="Введите номер"
            value={formData.number}
            onChange={(e) =>
              setFormData({ ...formData, number: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="code">Код специальности</Label>
          <Input
            id="code"
            placeholder="Введите код"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            placeholder="Введите описание (необязательно)"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Отмена
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!formData.title || !formData.number || !formData.code}
        >
          {title.includes("Создание") ? "Создать" : "Сохранить"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
