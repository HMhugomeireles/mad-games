"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { cn, normalizeMac } from "@/lib/utils";
import { DeviceDoc } from "@/lib/db/models/device";

const DeviceFormSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
  mac: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ?? "").trim())
    .refine(
      (v) => v === "" || /^([0-9a-f]{2}:){5}[0-9a-f]{2}$/i.test(v) || /^[0-9a-f]{12}$/i.test(v),
      "MAC inválido. Use 00:11:22:33:44:55 ou 001122334455"
    ),
  description: z.string().trim().optional(),
  variant: z.enum(["electronic", "bracelet"]).default("electronic"),
  status: z.enum(["online", "offline"]).default("offline"),
  groupType: z.enum(["individual", "team", "game", "settings", "respawn"]).default("individual"),
  group: z.enum(["A00", "B00", "C00", "D00", "E00"]).optional(),
});
type DeviceFormValues = z.infer<typeof DeviceFormSchema>;

export function DeviceTable({ devices }: { devices: DeviceDoc[] }) {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [current, setCurrent] = React.useState<DeviceDoc | null>(null);

  const form = useForm<DeviceFormValues>({
    resolver: zodResolver(DeviceFormSchema) as Resolver<DeviceFormValues>,
    defaultValues: {
      name: "",
      mac: "",
      description: "",
      variant: "electronic",
      status: "offline",
      groupType: "individual",
      group: undefined,
    },
    mode: "onBlur",
  });

  React.useEffect(() => {
    if (!current) return;
    form.reset({
      name: current.name ?? "",
      mac: current.mac ?? "",
      description: current.description ?? "",
      variant: current.variant,
      status: current.status,
      groupType: current.groupType,
      group: current.group ?? undefined,
    });
  }, [current, form]);

  function onRowClick(d: DeviceDoc) {
    setCurrent({ ...d });
    setError(null);
    setOpen(true);
  }

  async function onSubmit(values: DeviceFormValues) {
    if (!current) return;
    setSaving(true);
    setError(null);

    let mac = (values.mac ?? "").trim();
    if (mac === "") {
      mac = ""; // a API deverá converter "" para unset/null
    }
    if (/^[0-9a-f]{12}$/i.test(mac)) mac = mac.match(/.{1,2}/g)!.join(":");

    const body = {
      name: values.name.trim(),
      mac,
      description: values.description?.trim() ?? "",
      variant: values.variant,
      status: values.status,
      groupType: values.groupType,
      group: values.group,
    };

    try {
      const res = await fetch(`/api/devices/${current._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const j = await safeJson(res);
      if (!res.ok) throw new Error(j?.message || `Erro ao atualizar (HTTP ${res.status})`);

      toast.success("Definições guardadas", { description: `Device atualizado: ${values.name}` });
      setOpen(false);
      router.refresh();
    } catch (e: any) {
      toast.error("Falha ao guardar definições", { description: e?.message || "Erro desconhecido" });
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!current) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/devices/${current._id}`, { method: "DELETE" });
      const j = await safeJson(res);
      if (!res.ok) throw new Error(j?.message || `Erro ao apagar (HTTP ${res.status})`);

      toast.success("Device apagado", { description: current.name });
      setOpen(false);
      router.refresh();
    } catch (e: any) {
      toast.error("Falha ao apagar device", { description: e?.message || "Erro desconhecido" });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      {/* grid 2 colunas em telas >= md */}
      <div className="grid grid-cols-1 gap-6">
        {/* CARD ELETRONIC */}
        <Card className="w-full">
          <CardHeader>
            <CardDescription>{devices.length} device(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <DeviceCardTable devices={devices} onClickRow={onRowClick} />
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar device</DialogTitle>
          </DialogHeader>

          {current && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Bracelet 01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="mac"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MAC (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="24:6F:28:AA:BB:CC" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="variant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="electronic">electronic</SelectItem>
                            <SelectItem value="bracelet">bracelet</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Notas do dispositivo..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="groupType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Type</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="individual">individual</SelectItem>
                          <SelectItem value="team">team</SelectItem>
                          <SelectItem value="game">game</SelectItem>
                          <SelectItem value="settings">settings</SelectItem>
                          <SelectItem value="respawn">respawn</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="group"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A00">A00</SelectItem>
                          <SelectItem value="B00">B00</SelectItem>
                          <SelectItem value="C00">C00</SelectItem>
                          <SelectItem value="D00">D00</SelectItem>
                          <SelectItem value="E00">E00</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && <p className="text-sm text-red-600">{error}</p>}

                <DialogFooter className="mt-2">

                  {/* AlertDialog de confirmação de remoção */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="secondary" size="icon" aria-label="Apagar device">
                        <Trash2 className="h-5 w-5 text-red-600" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Apagar este device?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação é permanente e não pode ser desfeita. O dispositivo{" "}
                          <strong>{current?.name}</strong> será removido.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700"
                          onClick={onDelete}
                          disabled={deleting}
                        >
                          {deleting ? "A apagar..." : "Apagar"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? "A salvar..." : "Guardar"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function DeviceCardTable({
  devices,
  onClickRow,
}: {
  devices: DeviceDoc[];
  onClickRow: (d: DeviceDoc) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>MAC</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                Nenhum device encontrado.
              </TableCell>
            </TableRow>
          ) : (
            devices.map((d) => (
              <TableRow
                key={d._id}
                onClick={() => onClickRow(d)}
                className={cn("cursor-pointer hover:bg-muted/40")}
              >
                <TableCell className="font-medium">{d.name}</TableCell>
                <TableCell>{normalizeMac(d.mac ?? "")}</TableCell>
                <TableCell className="text-right">
                  {d.status === "online" ? (
                    <Badge className="bg-green-500/15 text-green-700 hover:bg-green-500/20">online</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-muted-foreground">
                      offline
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
