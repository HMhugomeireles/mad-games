// ==============================
// FILE: components/game-settings-form.tsx (updated: supports onSaved)
// ==============================
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// shadcn/ui
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COLOR_OPTIONS = ["red","blue","green","yellow","purple","orange","no-color"] as const;

const GroupSchema = z.object({
  id: z.string().optional(),
  groupName: z.string().min(1, "Nome é obrigatório").trim(),
  groupColor: z.enum(COLOR_OPTIONS).or(z.string().min(1, "Cor é obrigatória")),
});

const Schema = z.object({ groups: z.array(GroupSchema).min(1, "Pelo menos um grupo") });
export type GameSettingsFormValues = z.infer<typeof Schema>;

const DEFAULT_GROUPS = [
  { groupName: "Group 1", groupColor: "red" },
  { groupName: "Group 2", groupColor: "no-color" },
];

export default function GameSettingsForm({
  gameId,
  initialGroups,
  onSaved,
}: {
  gameId: string;
  initialGroups?: { id?: string; groupName: string; groupColor: string }[];
  onSaved?: () => void; // 👈 fecha modal ao guardar
}) {
  const router = useRouter();

  const form = useForm<GameSettingsFormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      groups: (initialGroups && initialGroups.length ? initialGroups : DEFAULT_GROUPS).map((g) => ({
        id: g.id,
        groupName: g.groupName,
        groupColor: g.groupColor,
      })),
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "groups" });

  const onSubmit = async (values: GameSettingsFormValues) => {
    try {
      const res = await fetch(`/api/games/${gameId}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ? JSON.stringify(json.error) : res.statusText);
      toast.success("Definições guardadas", { description: `${values.groups.length} grupo(s)` });
      onSaved?.(); // 👈 fecha modal se existir
      router.refresh();
    } catch (e: any) {
      toast.error("Falha ao guardar definições", { description: e?.message || "Erro desconhecido" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 gap-3 sm:grid-cols-6">
              <FormField
                control={form.control}
                name={`groups.${index}.groupName`}
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Nome do grupo</FormLabel>
                    <FormControl>
                      <Input placeholder={`Group ${index + 1}`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`groups.${index}.groupColor`}
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Cor</FormLabel>
                    <Select value={field.value || undefined} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleciona a cor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COLOR_OPTIONS.map((c) => (
                          <SelectItem key={c} value={c} className="capitalize">
                            {c.replace(/-/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="sm:col-span-1 flex items-end">
                <Button type="button" variant="outline" onClick={() => remove(index)}>
                  Remover
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button type="button" variant="secondary" onClick={() => append({ groupName: `Group ${fields.length + 1}`, groupColor: "no-color" })}>
            Adicionar grupo
          </Button>
          <Button type="submit">Guardar definições</Button>
        </div>
      </form>
    </Form>
  );
}
