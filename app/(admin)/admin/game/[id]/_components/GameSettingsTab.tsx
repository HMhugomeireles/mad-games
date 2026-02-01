"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm, useFieldArray, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Trash2,
  Plus,
  Save,
  Users,
  Timer,
  Swords,
  Gamepad2
} from "lucide-react";

// shadcn/ui components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { fetchDevices } from "@/lib/http/device";
import { GameDoc } from "@/lib/db/models/game";
import { fetchGameById } from "@/lib/http/game";

const COLOR_OPTIONS = ["red", "blue", "green", "yellow", "purple", "orange", "no-color"] as const;
const RESPAWN_TYPES = ["players-number", "time", "other"] as const;

// Mapeamento para classes Tailwind para mostrar a cor visualmente
const colorMap: Record<string, string> = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-400",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  "no-color": "bg-slate-200 border border-slate-300",
};

const GroupSchema = z.object({
  groupId: z.string(),
  groupName: z.string().min(1, "Nome é obrigatório").trim(),
  groupColor: z.enum(COLOR_OPTIONS).or(z.string().min(1, "Cor é obrigatória")),
  respawnDevice: z.object({
    macAddress: z.string().trim().optional().default(""),
  }).optional().default({ macAddress: "" }),
  baseDevice: z.object({
    macAddress: z.string().trim().optional().default(""),
  }).optional().default({ macAddress: "" }),
});

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

export function GameSettingsTab({
  gameData,
}: {
  gameData: GameDoc;
}) {
  const router = useRouter();

  const { data: devices = [] } = useQuery({
    queryKey: ["devices"],
    queryFn: fetchDevices
  });

  const form = useForm<GameSettingsFormValues>({
    resolver: zodResolver(Schema) as unknown as Resolver<GameSettingsFormValues, any>,
    defaultValues: {
      groups: (gameData?.gameSettings?.groups || []).map((g) => ({
        groupId: g.id,
        groupName: g.groupName,
        groupColor: g.groupColor,
        respawnDevice: (gameData?.groupsNodes || [])
          .filter(node => node.group === g.group)
          .map(node => ({ macAddress: node.respawnDevice?.macAddress || "" }))
          .at(0) || { macAddress: "" },
        baseDevice: (gameData?.groupsNodes || [])
          .filter(node => node.group === g.group)
          .map(node => ({ macAddress: node.baseDevice?.macAddress || "" }))
          .at(0) || { macAddress: "" }
      })),
      maxplayers: gameData?.gameSettings?.maxplayers ?? undefined,
      deadWaitTimeSeconds: gameData?.gameSettings?.deadWaitTimeSeconds ?? undefined,
      respawnTimeSeconds: gameData?.gameSettings?.respawnTimeSeconds ?? undefined,
      respawnType: (gameData?.gameSettings?.respawnType as any) ?? "other",
      respawnMaxPlayers: gameData?.gameSettings?.respawnMaxPlayers ?? undefined,
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "groups" });

  const onSubmit = async (values: GameSettingsFormValues) => {
    console.log("Submitting values:", values);
    try {
      const payload = {
        groups:
          values.groups.map((group) => {
            return {
              groupId: group.groupId,
              groupName: group.groupName,
              groupColor: group.groupColor,
              respawnDevice: devices
                .filter(d => d.groupType === "respawn" && group.respawnDevice.macAddress === d.mac)
                .map(d => ({ id: d._id, name: d.name, macAddress: d.mac }))
                .at(0),
              baseDevice: devices
                .filter(d => d.groupType === "settings" && group.baseDevice.macAddress === d.mac)
                .map(d => ({ id: d._id, name: d.name, macAddress: d.mac }))
                .at(0),
            };
          }),
        maxplayers: values.maxplayers,
        deadWaitTimeSeconds: values.deadWaitTimeSeconds,
        respawnTimeSeconds: values.respawnTimeSeconds,
        respawnType: values.respawnType ?? "other",
        respawnMaxPlayers: values.respawnMaxPlayers,
      };

      const res = await fetch(`/api/games/${gameData?._id}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || res.statusText);

      toast.success("Definições guardadas", {
        description: `${values.groups.length} grupos configurados.`,
      });
      router.refresh();
    } catch (e: any) {
      toast.error("Falha ao guardar", { description: e?.message || "Erro desconhecido" });
    }
  };

const onInvalid = (errors: any) => {
  console.error("Erros de validação:", errors);
  toast.error("Existem campos inválidos no formulário.");
};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8 max-w-4xl mx-auto pb-10">
        {/* Header Section */}
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-primary" />
            Game Settings
          </h2>
          <p className="text-muted-foreground">
            Manage teams, respawn rules, and match limits.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-12">

          {/* ================= SECTION: GROUPS ================= */}
          <div className="md:col-span-7 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  Equipas & Grupos
                </CardTitle>
                <CardDescription>
                  Defina os nomes e as cores das equipas que participarão.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex flex-col gap-3 items-start animate-in fade-in slide-in-from-top-1 duration-300">
                      <div className="mt-2 flex flex-col gap-3 items-start md:flex-row md:items-center w-full">
                        {/* Group Name Input */}
                        <FormField
                          control={form.control}
                          name={`groups.${index}.groupName`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder={`Nome do Grupo ${index + 1}`} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Color Select */}
                        <FormField
                          control={form.control}
                          name={`groups.${index}.groupColor`}
                          render={({ field }) => (
                            <FormItem className="w-[140px]">
                              <Select value={String(field.value)} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Cor" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {COLOR_OPTIONS.map((c) => (
                                    <SelectItem key={c} value={c}>
                                      <div className="flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-full ${colorMap[c]}`} />
                                        <span className="capitalize">{c.replace(/-/g, " ")}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        {/* Remove Button */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive shrink-0"
                          onClick={() => remove(index)}
                          disabled={fields.length <= 1} // Evita remover o último grupo se quiseres
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>

                      </div>


                      <div className="pl-5 flex flex-row gap-3 items-start">
                        <FormField
                          control={form.control}
                          name={`groups.${index}.respawnDevice.macAddress`}
                          render={({ field }) => (
                            <FormItem className="w-full md:flex-1">
                              <Select value={String(field.value || "")} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Respawn Device MAC" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {devices.filter(d => d.groupType === "respawn").map((c) => (
                                    <SelectItem key={c.mac} value={c.mac || ""}>
                                      <div className="flex items-center gap-2">
                                        <span>{c.name} - {c.mac}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`groups.${index}.baseDevice.macAddress`}
                          render={({ field }) => (
                            <FormItem className="w-full md:flex-1">
                              <Select value={String(field.value || "")} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Base Device MAC" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {devices.filter(d => d.groupType === "settings").map((c) => (
                                    <SelectItem key={c.mac} value={c.mac || ""}>
                                      <div className="flex items-center gap-2">
                                        <span>{c.name} - {c.mac}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>

                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-dashed border-2 hover:bg-muted/50 mt-2"
                  onClick={() =>
                    append({ groupId: crypto.randomUUID(), groupName: `Group ${fields.length + 1}`, groupColor: "no-color", respawnDevice: { macAddress: "" }, baseDevice: { macAddress: "" } })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Grupo
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* ================= SECTION: RULES & SETTINGS ================= */}
          <div className="md:col-span-5 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Timer className="w-5 h-5 text-muted-foreground" />
                  Regras da Partida
                </CardTitle>
                <CardDescription>
                  Tempos de espera, respawn e limites.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">

                {/* Max Players */}
                <FormField
                  control={form.control}
                  name="maxplayers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limite de Jogadores</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Users className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-9" type="number" min={0} placeholder="Ilimitado" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)} />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Swords className="w-3.5 h-3.5" />
                    Respawn Settings
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="deadWaitTimeSeconds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Wait Time (s)</FormLabel>
                          <FormControl>
                            <Input type="number" min={0} {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="respawnTimeSeconds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Respawn Time (s)</FormLabel>
                          <FormControl>
                            <Input type="number" min={0} {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="respawnType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Respawn</FormLabel>
                        <Select
                          value={field.value ?? "other"}
                          onValueChange={(v: any) => field.onChange(v)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="players-number">Por Qtd. Jogadores</SelectItem>
                            <SelectItem value="time">Por Tempo</SelectItem>
                            <SelectItem value="other">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  {/* Conditionally show or highlight this based on type if you wanted, keeping it simple for now */}
                  <FormField
                    control={form.control}
                    name="respawnMaxPlayers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qtd. Máx p/ Respawn</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Apenas se o tipo for "Por Qtd. Jogadores".
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t">
          <Button variant="ghost" type="button" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" className="min-w-[150px] cursor-pointer">
            <Save className="w-4 h-4 mr-2" />
            Guardar Alterações
          </Button>
        </div>
      </form>
    </Form>
  );
}