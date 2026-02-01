"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

// shadcn/ui
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const TYPE_OPTIONS = ["eletronic", "bracelet"] as const;

const Schema = z.object({
  name: z.string().min(1, "Nome é obrigatório").trim(),
  mac: z
    .string()
    .trim()
    .transform((v) => (v ? v.toLowerCase().replace(/[^a-f0-9]/g, "") : ""))
    .refine((v) => v === "" || /^[a-f0-9]{12}$/.test(v), {
      message: "MAC deve ter 12 hex (podes escrever com : ou -)",
    }),
  description: z.string().trim(),
  type: z.enum(TYPE_OPTIONS),
});

type FormValues = z.infer<typeof Schema>;

export default function DeviceCreatePage() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { name: "", mac: "", description: "", type: "eletronic" },
    mode: "onBlur",
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch("/api/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          mac: values.mac || undefined,
          description: values.description || undefined,
          type: values.type, // 👈 novo
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ? JSON.stringify(json.error) : res.statusText);

      toast.success("Device registado", { description: `${values.name} (${values.type})` });
      router.push("/admin/device");
    } catch (e: any) {
      const msg = e?.message || "Erro desconhecido";
      toast.error("Falha ao registar device", { description: msg });
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Registar device</CardTitle>
          <CardDescription>Preenche os campos abaixo para adicionar um novo device.</CardDescription>
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
                      <Input placeholder="Ex.: Leitor RFID #1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipo */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo *</FormLabel>
                    <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleciona o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TYPE_OPTIONS.map((t) => (
                          <SelectItem key={t} value={t} className="capitalize">
                            {t.replace(/-/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* MAC */}
              <FormField
                control={form.control}
                name="mac"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MAC (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="AA:BB:CC:DD:EE:FF" {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">Aceita : ou -; será normalizado ao guardar.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Descrição */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (opcional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Notas, localização, nº de série…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-3">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "A guardar…" : "Guardar"}
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
