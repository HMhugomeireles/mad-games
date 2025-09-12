// app/admin/player/create/page.tsx
"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

// shadcn/ui components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ------------------------------
// Validation schema (client-side)
// ------------------------------
const Schema = z.object({
  name: z
    .string({ required_error: "Nome é obrigatório" })
    .min(1, "Nome é obrigatório")
    .trim(),
  apd: z
    .string()
    .trim()
    .transform((v) => (v ? v.toUpperCase().replace(/\s+/g, "") : "")),
  apdValidateDate: z.string(), // input type="date" envia string YYYY-MM-DD; o backend faz z.coerce.date
  team: z.string().trim().optional(),
});

type FormValues = z.infer<typeof Schema>;

export default function CreatePlayerPage() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      name: "",
      apd: "",
      apdValidateDate: "",
      team: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: FormValues) => {
    const payload: Record<string, any> = {
      name: values.name,
    };

    if (values.apd) payload.apd = values.apd || undefined;
    if (values.apdValidateDate) payload.apdValidateDate = values.apdValidateDate; // backend z.coerce.date aceita
    if (values.team) payload.team = values.team;

    try {
      const res = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ? JSON.stringify(err.error) : res.statusText);
      }

      // Sucesso
      // Se preferir, troque por um toast de sua UI.
      alert("Jogador criado com sucesso!");
      router.push("/admin/player"); // ajuste o destino conforme sua listagem
    } catch (e: any) {
      alert(`Falha ao criar jogador: ${e.message ?? e}`);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Criar jogador</CardTitle>
          <CardDescription>Preencha os campos abaixo para registar um novo jogador.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.: Alice Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>APD</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.: APD-123" {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">Será normalizado em MAIÚSCULAS sem espaços.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apdValidateDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Validade do APD</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="team"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipa (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.: Blue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "A criar..." : "Criar"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
