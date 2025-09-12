"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Participant = { id: string; name: string };

const DEVICE_STATUS = ["online", "offline", "in_use"] as const;

export function AssignDeviceForm({
  gameId,
  participants,
  blockedDeviceIds = [],
}: {
  gameId: string;
  participants: Participant[];
  blockedDeviceIds?: string[];
}) {
  const router = useRouter();
  const [devices, setDevices] = React.useState<{ id: string; name: string }[]>([]);

  const Schema = z.object({
    deviceId: z.string().min(1, "Seleciona um device"),
    assignedPlayerId: z.string().min(1, "Seleciona um jogador"),
    deviceStatus: z.enum(DEVICE_STATUS).default("offline"),
    deviceLocation: z.string().optional().default(""),
  });
  type Values = z.infer<typeof Schema>;

  const form = useForm<Values>({
    resolver: zodResolver(Schema),
    defaultValues: {
      deviceId: "",
      assignedPlayerId: "",
      deviceStatus: "offline",
      deviceLocation: "",
    },
  });

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/devices", { cache: "no-store" });
        const list = await res.json();
        setDevices((list || []).map((d: any) => ({ id: d.id || d._id, name: d.name || d.id })));
      } catch {
        /* no-op */
      }
    })();
  }, []);

  const availableDevices = React.useMemo(
    () => devices.filter((d) => !blockedDeviceIds.includes(String(d.id))),
    [devices, blockedDeviceIds]
  );

  const onSubmit = async (v: Values) => {
    try {
      // se não estiver online, não envia localização
      const payload = {
        deviceId: v.deviceId,
        assignedPlayerId: v.assignedPlayerId,
        deviceStatus: v.deviceStatus,
        deviceLocation: v.deviceStatus === "online" && v.deviceLocation ? v.deviceLocation : undefined,
      };

      const res = await fetch(`/api/games/${gameId}/assign-device`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ? JSON.stringify(json.error) : res.statusText);

      toast.success("Device atribuído");
      form.reset({
        deviceId: "",
        assignedPlayerId: "",
        deviceStatus: "offline",
        deviceLocation: "",
      });
      router.refresh();
    } catch (e: any) {
      const msg = e?.message || "Erro desconhecido";
      toast.error("Falha ao atribuir device", { description: msg });
    }
  };

  const status = form.watch("deviceStatus");

  return (
    <Form {...form}>
      {/* ≥900px: 2 colunas; <900px: 1 coluna */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 min-[900px]:grid-cols-2">
        {/* Device (col 1) */}
        <FormField
          control={form.control}
          name="deviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Device</FormLabel>
              <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleciona o device" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableDevices.length === 0 ? (
                    <SelectItem disabled value="no-devices">Sem devices disponíveis</SelectItem>
                  ) : (
                    availableDevices.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Jogador (col 2) */}
        <FormField
          control={form.control}
          name="assignedPlayerId"
          render={({ field }) => (
            <FormItem className="min-[900px]:col-span-1">
              <FormLabel>Jogador</FormLabel>
              <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Seleciona o jogador" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {participants.length === 0 ? (
                    <SelectItem disabled value="no-players">Sem jogadores</SelectItem>
                  ) : (
                    participants.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
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
            {form.formState.isSubmitting ? "A atribuir…" : "Atribuir"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
