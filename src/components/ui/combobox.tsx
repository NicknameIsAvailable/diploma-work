"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FC } from "react";
import { Badge } from "@/components/ui/badge";

export interface IItem {
  value: string;
  label: string;
}

export interface IComboboxProps {
  items?: IItem[];
  open?: boolean;
  values?: string[];
  label?: string;
  placeholder?: string;
  onSelect?: (values: string[]) => void;
  handleOpen?: (open: boolean) => void;
  isLoading?: boolean;
  multiple?: boolean;
  className?: string;
}

export const Combobox: FC<IComboboxProps> = ({
  items,
  open,
  values = [],
  placeholder = "Выбор...",
  label,
  onSelect,
  handleOpen,
  isLoading,
  multiple = false,
  className,
}) => {
  const handleSelect = (currentValue: string) => {
    if (multiple) {
      const newValues = values.includes(currentValue)
        ? values.filter((value) => value !== currentValue)
        : [...values, currentValue];
      onSelect?.(newValues);
    } else {
      onSelect?.([currentValue]);
    }
  };

  const removeValue = (valueToRemove: string) => {
    const newValues = values.filter((value) => value !== valueToRemove);
    onSelect?.(newValues);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <span>{label}</span>}
      {isLoading ? (
        <Button
          disabled={isLoading}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          {placeholder}
          <Loader className="ml-2 h-4 w-4 shrink-0 opacity-50 animate-spin" />
        </Button>
      ) : (
        <Popover open={open} onOpenChange={handleOpen}>
          <PopoverTrigger asChild>
            <Button
              disabled={isLoading}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {values.length > 0 ? `Выбрано: ${values.length}` : placeholder}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder={placeholder} />
              <CommandList>
                <CommandEmpty>Ничего не найдено</CommandEmpty>
                <CommandGroup>
                  {items?.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={() => handleSelect(item.value)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          values.includes(item.value)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
      {multiple && values.length > 0 && (
        <div className="flex flex-col flex-wrap gap-1 mt-2">
          {values.map((value) => (
            <Badge key={value} variant="secondary">
              {items?.find((item) => item.value === value)?.label}
              <button
                className="ml-1 hover:text-red-500"
                onClick={() => removeValue(value)}
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
