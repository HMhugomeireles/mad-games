"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger, DialogClose
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Pencil } from "lucide-react";

export default function EditDeviceReturnButton({
  gameId,
  deviceId,
  current,
}: {
  gameId: string;
  deviceId: string;
  current: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(!!current);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => setValue(!!current), [current, open]);

  const onSave = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/games/${gameId}/assign-device`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId,
          havePlayerReturnDevice: value,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || res.statusText);
      toast.success("Estado atualizado");
      setOpen(false);
      router.refresh();
    } catch (e: any) {
      toast.error("Falha ao atualizar", { description: e?.message || "Erro desconhecido" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="Editar entrega"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent onClick={(e) => e.stopPropagation()} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Definir estado de entrega</DialogTitle>
          <DialogDescription>Marca se o jogador já devolveu o device.</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between rounded-md border p-3">
          <div>
            <div className="font-medium">Device devolvido?</div>
            <div className="text-sm text-muted-foreground">
              Alterna para marcar como entregue / não entregue.
            </div>
          </div>
          <Switch checked={value} onCheckedChange={setValue} />
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={onSave} disabled={loading}>
            {loading ? "A guardar…" : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
