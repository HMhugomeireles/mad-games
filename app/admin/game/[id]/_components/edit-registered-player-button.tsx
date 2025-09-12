"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger, DialogClose
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";

const Schema = z.object({
  groupId: z.string().optional(),
  rfid: z.string().optional(),
});

type Props = {
  gameId: string;
  playerId: string;
  playerName?: string;
  initialGroupId?: string;
  initialRfid?: string;
  groups: { id: string; groupName: string; groupColor: string }[];
};

export default function EditRegisteredPlayerButton({
  gameId, playerId, playerName, initialGroupId, initialRfid, groups,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: { groupId: initialGroupId, rfid: initialRfid || "" },
  });

  async function onSubmit(values: z.infer<typeof Schema>) {
    try {
      const res = await fetch(`/api/games/${gameId}/register-player`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId,
          groupId: values.groupId || undefined,
          rfid: values.rfid || "",
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || res.statusText);

      toast.success("Registo atualizado", { description: playerName || playerId });
      setOpen(false);
      router.refresh();
    } catch (e: any) {
      toast.error("Falha ao atualizar", { description: e?.message || "Erro desconhecido" });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="Editar registo"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent onClick={(e) => e.stopPropagation()} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar participante</DialogTitle>
          <DialogDescription>
            Atualiza o grupo e o RFID deste jogador neste jogo.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="groupId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grupo</FormLabel>
                  <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Seleciona o grupo" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {groups.length === 0 ? (
                        <SelectItem disabled value="no-groups">Sem grupos definidos</SelectItem>
                      ) : (
                        groups.map((g) => (
                          <SelectItem key={g.id} value={g.id} className="capitalize">
                            {g.groupName}{g.groupColor ? ` · ${g.groupColor}` : ""}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <div className="mt-1">
                    <Button type="button" variant="outline" size="sm" onClick={() => field.onChange(undefined)}>
                      Remover grupo
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rfid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RFID</FormLabel>
                  <FormControl>
                    <Input placeholder="Opcional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}