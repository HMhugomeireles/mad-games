"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchFieldMaps } from "@/lib/http/field-map";

// Se já tiveres isto em '@/domain/gameModes', substitui pelo import
const GAME_MODES = [
  "domination",
  "kill-confirmed",
  "shield",
  "sensor-movement",
  "disarm",
  "extract",
  "avalanche",
] as const;

const Schema = z.object({
  name: z.string().min(1, "Nome é obrigatório").trim(),
  type: z.enum(GAME_MODES, { error: "Modo é obrigatório" }),
  fieldMapId: z.string().min(1, "Field map é obrigatório"),
  date: z.string().optional(),
});

type FormValues = z.infer<typeof Schema>;

export default function GameCreatePage() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      name: "",
      type: undefined,
      fieldMapId: undefined,
      date: "",
    },
    mode: "onBlur",
  });

  const { data: fieldMapData, isLoading: loadingFms } = useQuery({
    queryKey: ["fieldMaps"],
    queryFn: fetchFieldMaps
  });

  const onSubmit = async (values: FormValues) => {
    const payload: Record<string, any> = {
      name: values.name,
      type: values.type,
      fieldMapId: values.fieldMapId,
    };
    if (values.date) payload.date = values.date;

    try {
      const res = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ? JSON.stringify(json.error) : res.statusText);

      toast.success("Create game event successfully!", { description: values.name });
      router.push("/admin/game");
    } catch (e: any) {
      const msg = e?.message || "Unknown error";
      toast.error("Error creating game event", { description: msg });
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create game event</CardTitle>
          <CardDescription>Define the name, field map, mode, and date of the game event.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Nome */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.: Domingo à tarde" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Field map + Modo */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Field map (obrigatório) */}
                <FormField
                  control={form.control}
                  name="fieldMapId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field map *</FormLabel>
                      <Select value={field.value ?? undefined} onValueChange={field.onChange} disabled={loadingFms}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={loadingFms ? "A carregar..." : "Seleciona o field map"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fieldMapData?.length === 0 ? (
                            <SelectItem disabled value="no-fm">Sem field maps</SelectItem>
                          ) : (
                            fieldMapData?.map((fm) => (
                              <SelectItem key={fm._id} value={fm._id}>
                                {fm.fieldMap}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Modo */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modo *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleciona o modo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GAME_MODES.map((m) => (
                            <SelectItem key={m} value={m} className="capitalize">
                              {m.replace(/-/g, " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Data */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-1">
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center gap-3">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "A criar…" : "Criar jogo"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
