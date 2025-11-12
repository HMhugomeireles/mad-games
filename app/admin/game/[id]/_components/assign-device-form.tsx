"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MultiSelect } from "@/components/multi-selector";

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

  // ✅ agora usamos *vários* devices
  const Schema = z.object({
    deviceIds: z.array(z.string()).min(1, "Seleciona pelo menos um device"),
    assignedPlayerId: z.string().optional(),
    deviceStatus: z.enum(DEVICE_STATUS),
    deviceLocation: z.string().default(""),
  });
  type Values = z.infer<typeof Schema>;

  const form = useForm<Values>({
    resolver: zodResolver(Schema) as unknown as Resolver<Values, any, any>,
    defaultValues: {
      deviceIds: [],
      assignedPlayerId: undefined,
      deviceStatus: "offline",
      deviceLocation: "",
    },
  });

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/devices", { cache: "no-store" });
        const list = await res.json();
        setDevices((list || []).map((d: any) => ({
          id: d.id || d._id,
          name: d.name || d.id
        })));
      } catch {
        /* no-op */
      }
    })();
  }, []);

  const availableDevices = React.useMemo(
    () => devices.filter((d) => !blockedDeviceIds.includes(String(d.id))),
    [devices, blockedDeviceIds]
  );

  // items para o MultiSelect
  const deviceItems = React.useMemo(
    () => availableDevices.map((d) => ({ value: String(d.id), label: d.name })),
    [availableDevices]
  );

  const onSubmit = async (v: Values) => {
    try {
      const payload = {
        deviceIds: v.deviceIds, // 👈 agora enviamos um array
        assignedPlayerId: v.assignedPlayerId,
        deviceStatus: v.deviceStatus,
        deviceLocation:
          v.deviceStatus === "online" && v.deviceLocation ? v.deviceLocation : undefined,
      };

      const res = await fetch(`/api/games/${gameId}/assign-device`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ? JSON.stringify(json.error) : res.statusText);

      toast.success("Devices atribuídos");
      form.reset({
        deviceIds: [],
        assignedPlayerId: undefined,
        deviceStatus: "offline",
        deviceLocation: "",
      });
      form.setValue("assignedPlayerId", undefined, { shouldDirty: true });
      router.refresh();
    } catch (e: any) {
      const msg = e?.message || "Erro desconhecido";
      toast.error("Falha ao atribuir devices", { description: msg });
    }
  };

  const status = form.watch("deviceStatus");

  return (
    <Form {...form}>
      {/* ≥900px: 2 colunas; <900px: 1 coluna */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 min-[900px]:grid-cols-2">
        {/* Devices (col 1) — agora MultiSelect */}
        <FormField
          control={form.control}
          name="deviceIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Devices</FormLabel>
              <FormControl>
                <MultiSelect
                  items={deviceItems}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  placeholder={
                    deviceItems.length ? "Seleciona um ou mais devices..." : "Sem devices disponíveis"
                  }
                  maxSelected={8} // opcional: limita a quantidade
                />
              </FormControl>
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
              <Select
                // ✅ Usa o valor controlado corretamente
                value={field.value || ""}
                onValueChange={(val) => field.onChange(val || undefined)}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    {/* ✅ placeholder volta ao default se field.value for vazio */}
                    <SelectValue placeholder="Seleciona o jogador" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {participants.length === 0 ? (
                    <SelectItem disabled value="no-players">
                      Sem jogadores
                    </SelectItem>
                  ) : (
                    participants.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
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
            {form.formState.isSubmitting ? "Adding…" : "Assign"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
