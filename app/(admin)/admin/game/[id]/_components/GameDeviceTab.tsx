"use client";

import * as React from "react";
import {
  Search,
  Plus,
  Trash2,
  Smartphone,
  Watch,
  Cpu,
  Battery,
  BatteryMedium,
  BatteryLow,
  Loader2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DeviceDoc, VARIANTS_OPTIONS_TYPE } from "@/lib/db/models/device";
import { GameDoc } from "@/lib/db/models/game";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDevicesIndividualType } from "@/lib/http/device";
import { fetchGameById } from "@/lib/http/game";

interface GameDeviceTabProps {
  gameId: string;
  initialGameData?: GameDoc;
}

export function GameDeviceTab({ gameId, initialGameData }: GameDeviceTabProps) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = React.useState("");

  const { data: availableDevices = [] } = useQuery({
    queryKey: ["devices", "individual-type"],
    queryFn: fetchDevicesIndividualType,
  });

  const { data: gameData } = useQuery({
    queryKey: ["game", gameId],
    queryFn: () => fetchGameById(gameId),
    initialData: initialGameData,
  });

  const assignedDevices = gameData?.assignedDevices || [];

  const filteredAvailable = React.useMemo(() => {
    if (!searchQuery) return availableDevices;
    const lowerQ = searchQuery.toLowerCase();
    return availableDevices.filter(d =>
      d.name.toLowerCase().includes(lowerQ)
    );
  }, [searchQuery, availableDevices]);

  const addDeviceMutation = useMutation({
    mutationFn: async (deviceId: string) => {
      const res = await fetch(`/api/games/${gameId}/assign-device`, {
        method: "POST",
        body: JSON.stringify({ deviceId }),
      });
      if (!res.ok) throw new Error("Error on registering device");
      return res.json();
    },
    onSuccess: (_, deviceId) => {
      const device = availableDevices.find(d => getDeviceId(d) === deviceId);
      toast.success(`${device?.name || "Device"} added!`);

      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
    },
    onError: () => toast.error("Error on adding device"),
  });

  // 4. Mutação para Remover Jogador
  const removeDeviceMutation = useMutation({
    mutationFn: async (deviceId: string) => {
      const res = await fetch(`/api/games/${gameId}/assign-device?deviceId=${deviceId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erros on removing device");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Device removed.");
      // ✨ Recarrega os dados do servidor automaticamente
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
    },
    onError: () => toast.error("Erro ao remover jogador."),
  });

  const getDeviceId = (device: DeviceDoc): string => String(device._id || "");

  const isAlreadyRegistered = (originalId: string) => {
    if (!originalId) return false;
    return assignedDevices.some((d) => String(d.deviceId) === String(originalId));
  };

  // Helper para ícone consoante o tipo
  const getDeviceIcon = (type: VARIANTS_OPTIONS_TYPE) => {
    return type === "bracelet" ? <Watch className="h-5 w-5" /> : <Cpu className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Header do Componente */}
      <div className="flex flex-col space-y-1">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Smartphone className="w-6 h-6 text-primary" />
          Device Game Inventory
        </h2>
        <p className="text-muted-foreground">
          Selecione os equipamentos (coletes, pulseiras, bases) que serão usados nesta partida.
        </p>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ================= COLUNA ESQUERDA: Inventário Global ================= */}
        <Card className="h-[550px] flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="h-5 w-5" />
              Procurar Inventário
            </CardTitle>
            <CardDescription>
              Pesquise por Nome ou MAC Address.
            </CardDescription>
            <div className="pt-2">
              <Input
                placeholder="Ex: Colete ou aa:bb:cc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-background"
              />
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full px-6 pb-4">
              <div className="space-y-3">
                {filteredAvailable.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    Nenhum device encontrado.
                  </div>
                ) : (
                  filteredAvailable.map((device) => {
                    const isAssigned = isAlreadyRegistered(device._id);
                    return (
                      <div
                        key={device._id}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border transition-colors",
                          isAssigned ? "bg-muted/50 opacity-60" : "bg-card hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {/* Ícone com fundo */}
                          <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                            {getDeviceIcon(device.variant)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{device.name}</span>
                            <span className="text-[10px] font-mono text-muted-foreground uppercase">
                              {device.mac}
                            </span>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          className="cursor-pointer"
                          variant={isAssigned ? "ghost" : "default"}
                          disabled={isAssigned}
                          onClick={() => addDeviceMutation.mutate(device._id)}
                        >
                          {isAssigned ? (
                            <span className="text-xs text-green-600 font-medium">No Jogo</span>
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* ================= COLUNA DIREITA: Devices no Jogo ================= */}
        <Card className="h-[550px] flex flex-col border-primary/20 shadow-sm">
          <CardHeader className="bg-muted/30 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  Devices Atribuídos
                </CardTitle>
                <CardDescription>
                  Equipamento ativo para o Game ID: <span className="font-mono text-xs">{gameId.slice(0, 8)}...</span>
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-background">
                Total: {assignedDevices.length}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full px-6 py-4">
              <div className="space-y-3">
                {assignedDevices.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground border-2 border-dashed rounded-lg m-4">
                    <Smartphone className="h-8 w-8 mb-2 opacity-50" />
                    <p>Nenhum device selecionado.</p>
                  </div>
                ) : (
                  assignedDevices.map((device) => {
                    const isRemovingThis = removeDeviceMutation.isPending && removeDeviceMutation.variables === device.deviceId;
                    return (
                      <div
                        key={device.deviceId}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card"
                      >
                        <div className="flex items-center gap-3">
                          {/* Ícone menor na direita para lista compacta */}
                          <div className="text-primary/80">
                            {getDeviceIcon("electronic")}
                          </div>

                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{device.deviceName}</span>
                              <Badge variant="secondary" className="text-[10px] h-4 px-1 py-0 font-normal capitalize">
                                {"electronic" === 'electronic' ? 'Eletrónico' : 'Pulseira'}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[10px] font-mono text-muted-foreground uppercase">
                                {device.deviceName || "Unknown Device"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Button
                          size="icon"
                          variant="ghost"
                          disabled={isRemovingThis}
                          className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-destructive/10 opacity-100 cursor-pointer"
                          onClick={() => removeDeviceMutation.mutate(device.deviceId)}
                        >
                          {isRemovingThis ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}