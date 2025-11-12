"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function MultiSelect({
  items,
  value,
  onChange,
  placeholder = "Seleciona...",
  emptyMessage = "Sem resultados",
  className,
  maxSelected,
}: {
  items: { value: string; label: string }[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  maxSelected?: number;
}) {
  const [open, setOpen] = React.useState(false);

  const selectedSet = React.useMemo(() => new Set(value), [value]);
  const selectedItems = React.useMemo(
    () => items.filter((i) => selectedSet.has(i.value)),
    [items, selectedSet]
  );

  function toggle(v: string) {
    const exists = selectedSet.has(v);
    if (exists) {
      onChange(value.filter((x) => x !== v));
    } else {
      if (maxSelected && value.length >= maxSelected) return; // silent cap
      onChange([...value, v]);
    }
  }

  function remove(v: string) {
    if (selectedSet.has(v)) onChange(value.filter((x) => x !== v));
  }

  function clearAll() {
    onChange([]);
  }

  const triggerLabel =
    selectedItems.length === 0
      ? placeholder
      : `${selectedItems.length} selecionado${selectedItems.length > 1 ? "s" : ""}`;

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
         >
            <div className="flex flex-wrap gap-1 items-center truncate">
              {selectedItems.length > 0 ? (
                <div className="flex gap-1 max-w-[75%] overflow-hidden">
                  {selectedItems.slice(0, 3).map((item) => (
                    <Badge key={item.value} variant="secondary" className="flex gap-1">
                      {item.label}
                      <X
                        className="h-3 w-3 cursor-pointer opacity-60 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(item.value);
                        }}
                      />
                    </Badge>
                  ))}
                  {selectedItems.length > 3 && (
                    <Badge variant="outline">+{selectedItems.length - 3}</Badge>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 max-h-[60vh] overflow-hidden" align="start">
          <Command shouldFilter defaultValue="">
            <div className="p-2">
              <CommandInput placeholder="Procurar..." />
            </div>
            <CommandEmpty className="p-2 text-sm text-muted-foreground">
              {emptyMessage}
            </CommandEmpty>
            <CommandList className="max-h-64 overflow-y-auto">
              <CommandGroup>
                {items.map((item) => {
                  const isSelected = selectedSet.has(item.value);
                  const disabled = Boolean(maxSelected && !isSelected && value.length >= maxSelected);
                  return (
                    <CommandItem
                      key={item.value}
                      value={item.label}
                      onSelect={() => toggle(item.value)}
                      className={cn(
                        "flex items-center gap-2",
                        disabled && "pointer-events-none opacity-50"
                      )}
                    >
                      <span className={cn("mr-2 h-4 w-4 border rounded-sm flex items-center justify-center", isSelected && "bg-primary text-primary-foreground border-primary")}>
                        {isSelected && <Check className="h-3 w-3" />}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
            <Separator />
            <div className="flex items-center justify-between p-2 gap-2">
              <div className="flex flex-wrap gap-1">
                {selectedItems.slice(0, 4).map((item) => (
                  <Badge key={item.value} variant="secondary" className="flex gap-1">
                    {item.label}
                    <X
                      className="h-3 w-3 cursor-pointer opacity-60 hover:opacity-100"
                      onClick={() => remove(item.value)}
                    />
                  </Badge>
                ))}
                {selectedItems.length > 4 && (
                  <Badge variant="outline">+{selectedItems.length - 4}</Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={clearAll} disabled={value.length === 0}>
                  Limpar
                </Button>
                <Button size="sm" onClick={() => setOpen(false)}>
                  OK
                </Button>
              </div>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
