"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2 } from "lucide-react";

const TYPES = ["cqb", "misto", "mato"] as const;

const SocialLink = z.object({
  platform: z.string().min(1).trim(),
  url: z.string().url().trim(),
});

const Schema = z.object({
  id: z.string().optional(),
  fieldMap: z.string().min(1).trim(),
  isActive: z.boolean(),
  type: z.enum(TYPES),
  description: z.string().optional(),
  location: z.string().optional(),
  socialLinks: z.array(SocialLink),
});

type Values = z.infer<typeof Schema>;

export default function FieldMapRowActions({
  row,
}: {
  row: {
    id: string;
    fieldMap: string;
    isActive: boolean;
    type: string;
    description?: string;
    location?: string;
    socialLinks?: { platform: string; url: string }[];
  };
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(Schema),
    defaultValues: {
      id: row.id || "",
      fieldMap: row.fieldMap || "",
      isActive: row.isActive || true,
      type: TYPES.includes(row.type as typeof TYPES[number]) ? (row.type as typeof TYPES[number]) : "cqb",
      description: row.description || "",
      location: row.location || "",
      socialLinks: Array.isArray(row.socialLinks) ? row.socialLinks : [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "socialLinks" });

  async function save(values: Values) {
    try {
      const res = await fetch(`/api/field-map/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ? JSON.stringify(json.error) : res.statusText);
      toast.success("Field map atualizado", { description: values.fieldMap });
      setOpen(false);
      router.refresh();
    } catch (e: any) {
      toast.error("Falha ao atualizar", { description: e?.message || "Erro desconhecido" });
    }
  }

  async function removeRow() {
    try {
      const res = await fetch(`/api/field-map/${row.id}`, { method: "DELETE" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || res.statusText);
      toast.success("Field map removido");
      router.refresh();
    } catch (e: any) {
      toast.error("Falha ao remover", { description: e?.message || "Erro desconhecido" });
    }
  }

  return (
    <div className="flex justify-end gap-1">
      {/* Editar */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            title="Editar"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Editar field map</DialogTitle>
            <DialogDescription>Atualiza os dados do campo.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(save)} className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="fieldMap"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Nome *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Seleciona o tipo" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TYPES.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between border rounded-md p-3">
                    <FormLabel className="m-0">Ativo</FormLabel>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Localização</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Descrição</FormLabel>
                    <FormControl><Textarea rows={3} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Links sociais */}
              <div className="sm:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel>Links sociais</FormLabel>
                  <Button type="button" variant="outline" size="sm" onClick={() => append({ platform: "", url: "" })}>
                    Adicionar link
                  </Button>
                </div>
                {fields.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sem links.</p>
                ) : (
                  <div className="space-y-2">
                    {fields.map((f, i) => (
                      <div key={f.id} className="grid gap-2 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`socialLinks.${i}.platform`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl><Input placeholder="Plataforma" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex gap-2">
                          <FormField
                            control={form.control}
                            name={`socialLinks.${i}.url`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="button" variant="ghost" onClick={() => remove(i)}>Remover</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                <DialogClose asChild><Button variant="outline" type="button">Cancelar</Button></DialogClose>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "A guardar…" : "Guardar"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Apagar */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            title="Apagar"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Apagar field map?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação é irreversível.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={removeRow}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
