"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm, useFieldArray, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// shadcn/ui
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COLOR_OPTIONS = ["red","blue","green","yellow","purple","orange","no-color"] as const;
const RESPAWN_TYPES = ["players-number", "time", "other"] as const;

const GroupSchema = z.object({
  groupName: z.string().min(1, "Nome é obrigatório").trim(),
  groupColor: z.enum(COLOR_OPTIONS).or(z.string().min(1, "Cor é obrigatória")),
});

// números opcionais, mas quando enviados devem ser >= 0
const numberOpt = z
  .union([z.string(), z.number()])
  .optional()
  .transform((v) => (v === undefined || v === null || v === "" ? undefined : Number(v)))
  .refine((v) => v === undefined || (!Number.isNaN(v) && v >= 0), "Valor inválido");

const Schema = z.object({
  groups: z.array(GroupSchema).min(1, "Pelo menos um grupo"),
  maxplayers: numberOpt,
  deadWaitTimeSeconds: numberOpt,
  respawnTimeSeconds: numberOpt,
  respawnType: z.enum(RESPAWN_TYPES).optional(),
  respawnMaxPlayers: numberOpt,
});

export type GameSettingsFormValues = z.infer<typeof Schema>;

const DEFAULT_GROUPS = [
  { groupName: "Group 1", groupColor: "red" },
  { groupName: "Group 2", groupColor: "no-color" },
];

export default function GameSettingsForm({
  gameId,
  initialSettings,
  onSaved,
}: {
  gameId: string;
  initialSettings?: {
    groups?: { id?: string; groupName: string; groupColor: string }[];
    maxplayers?: number | null;
    deadWaitTimeSeconds?: number | null;
    respawnTimeSeconds?: number | null;
    respawnType?: "players-number" | "time" | "other" | null;
    respawnMaxPlayers?: number | null;
  };
  onSaved?: () => void;
}) {
  const router = useRouter();

  const form = useForm<GameSettingsFormValues>({
    resolver: zodResolver(Schema) as unknown as Resolver<GameSettingsFormValues, any>,
    defaultValues: {
      groups:
        (initialSettings?.groups && initialSettings.groups.length
          ? initialSettings.groups
          : DEFAULT_GROUPS
        ).map((g) => ({ groupName: g.groupName, groupColor: g.groupColor })),
      maxplayers: initialSettings?.maxplayers ?? undefined,
      deadWaitTimeSeconds: initialSettings?.deadWaitTimeSeconds ?? undefined,
      respawnTimeSeconds: initialSettings?.respawnTimeSeconds ?? undefined,
      respawnType: (initialSettings?.respawnType as any) ?? "other",
      respawnMaxPlayers: initialSettings?.respawnMaxPlayers ?? undefined,
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "groups" });

  const onSubmit = async (values: GameSettingsFormValues) => {
    try {
      // Monta payload exatamente como o schema do Game espera (gameSettings)
      const payload = {
        groups: values.groups,
        maxplayers: values.maxplayers,
        deadWaitTimeSeconds: values.deadWaitTimeSeconds,
        respawnTimeSeconds: values.respawnTimeSeconds,
        respawnType: values.respawnType ?? "other",
        respawnMaxPlayers: values.respawnMaxPlayers,
      };

      const res = await fetch(`/api/games/${gameId}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || res.statusText);

      toast.success("Definições guardadas", {
        description: `${values.groups.length} grupo(s)`,
      });
      onSaved?.();
      router.refresh();
    } catch (e: any) {
      toast.error("Falha ao guardar definições", { description: e?.message || "Erro desconhecido" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Groups */}
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
                    <Select value={String(field.value)} onValueChange={field.onChange}>
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
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              append({ groupName: `Group ${fields.length + 1}`, groupColor: "no-color" })
            }
          >
            Adicionar grupo
          </Button>
        </div>

        {/* Numeric & enum settings */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="maxplayers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Máx. jogadores</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    placeholder="ex.: 20"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deadWaitTimeSeconds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tempo de espera (morto) [s]</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    placeholder="ex.: 10"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="respawnTimeSeconds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tempo de respawn [s]</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    placeholder="ex.: 5"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="respawnType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de respawn</FormLabel>
                <Select
                  value={field.value ?? "other"}
                  onValueChange={(v: typeof RESPAWN_TYPES[number]) => field.onChange(v)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleciona..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="players-number">players-number</SelectItem>
                    <SelectItem value="time">time</SelectItem>
                    <SelectItem value="other">other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="respawnMaxPlayers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Respawn máx. jogadores</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    placeholder="ex.: 3"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit">Guardar definições</Button>
        </div>
      </form>
    </Form>
  );
}
