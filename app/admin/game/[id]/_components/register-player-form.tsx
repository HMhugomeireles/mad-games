"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function uniqueBy<T, K extends keyof T>(arr: T[], key: K) {
  const seen = new Set<any>();
  return arr.filter((item) => (seen.has(item[key]) ? false : (seen.add(item[key]), true)));
}

export function RegisterPlayerForm({
  gameId,
  playersAll,
  already,
  groups,
}: {
  gameId: string;
  playersAll: { id: string; name: string; team: string }[];
  already: string[];
  groups: { id: string; groupName: string; groupColor: string }[];
}) {
  const router = useRouter();

  const Schema = z.object({
    playerId: z.string().min(1, "Selecione um jogador"),
    groupId: z.string(),
    rfid: z.string().optional(),
  });

  const form = useForm<{ playerId: string; groupId: string; rfid?: string }>({
    resolver: zodResolver(Schema),
    defaultValues: { playerId: "", groupId: "", rfid: "" },
  });

  const available = uniqueBy(playersAll, "id").filter((p) => !already.includes(p.id));

  const onSubmit = async (v: { playerId: string; groupId?: string; rfid?: string }) => {
    try {
      const res = await fetch(`/api/games/${gameId}/register-player`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: v.playerId,
          groupId: v.groupId || null,
          rfid: v.rfid || "",
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ? JSON.stringify(json.error) : res.statusText);

      // ✅ reset total aos defaults (limpa valores e erros)
      form.reset();
      toast.success("Jogador registado"); // opcional
      router.refresh();
    } catch (e: any) {
      const msg = e?.message || "Erro desconhecido";
      toast.error("Falha ao registar jogador", { description: msg });
    } finally {
      form.reset({ playerId: undefined, groupId: undefined, rfid: "" });
    }
  };

  return (
    <Form {...form}>
      {/* ≥900px: 2 colunas; <900px: 1 coluna */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 min-[900px]:grid-cols-2">
        {/* Jogador */}
        <FormField
          control={form.control}
          name="playerId"
          render={({ field }) => (
            <FormItem className="min-[900px]:col-span-1">
              <FormLabel>Jogador</FormLabel>
              <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleciona o jogador" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {available.length === 0 ? (
                    <SelectItem disabled value="no-options">Sem jogadores disponíveis</SelectItem>
                  ) : (
                    available.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}{p.team ? ` · ${p.team}` : ""}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Grupo */}
        <FormField
          control={form.control}
          name="groupId"
          render={({ field }) => (
            <FormItem className="min-[900px]:col-span-1">
              <FormLabel>Grupo</FormLabel>
              <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleciona o grupo" />
                  </SelectTrigger>
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
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botão — linha inteira, alinhado à direita */}
        <div className="flex justify-end min-[900px]:col-span-2 pt-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "A adicionar…" : "Adicionar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}