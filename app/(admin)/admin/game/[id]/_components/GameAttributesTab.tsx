"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Gamepad2, Layers, Plus, Save, User, Smartphone, X, Group, RotateCcw, UserCheck, UserX, UserPlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { GameDoc } from "@/lib/db/models/game";
import { fetchGameById } from "@/lib/http/game";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { MultiSelect } from "@/components/multi-selector";
import { fetchDevices } from "@/lib/http/device";

// --- Props ---
interface GameAttributesTabProps {
  gameId: string;
  initialGame?: GameDoc
}

interface GroupDataNode {
  playerId: string;
  playerName?: string;
  playerType: string;
  deviceId: string;
  deviceName?: string;
  deviceStatus: string;
  macAddress: string;
  scope: string;
}

export function GameAttributesTab({ gameId, initialGame }: GameAttributesTabProps) {
  const queryClient = useQueryClient();

  const [selectedGroupId, setSelectedGroupId] = React.useState<string>("");
  const [selectedPlayerIds, setSelectedPlayerIds] = React.useState<string[]>([]);
  const [isManualDevice, setIsManualDevice] = React.useState<boolean>(false);

  // Mapa para guardar a associação Jogador -> Device { "p1": "d1", "p2": "d2" }
  const [playerDeviceMap, setPlayerDeviceMap] = React.useState<Record<string, string>>({});
  const [openMultiSelect, setOpenMultiSelect] = React.useState(false);

  // 2. Dados do Jogo (Grupos)
  const { data: gameData } = useQuery({
    queryKey: ["game", gameId],
    queryFn: () => fetchGameById(gameId),
    initialData: initialGame
  });

  const groupsNodes = gameData?.groupsNodes || [];

  // --- Handlers ---

  // Mutação para salvar (Simulada)
  const assignMutation = useMutation({
    mutationFn: async () => {
      // Prepara o payload
      const assignments = selectedPlayerIds.map(pId => ({
        playerId: pId,
        // Se manual estiver on, usa o mapa, senão manda null/undefined
        deviceId: isManualDevice ? playerDeviceMap[pId] : undefined
      }));

      console.log("Submitting to API:", {
        groupId: selectedGroupId,
        assignments
      });

      // Aqui farias o fetch/POST para a tua API
      // await fetch(...) 
      return true;
    },
    onSuccess: () => {
      toast.success("Jogadores associados com sucesso!");
      // Limpar form
      setSelectedPlayerIds([]);
      setPlayerDeviceMap({});
      setIsManualDevice(false);
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
    }
  });

  const togglePlayer = (playerId: string) => {
    setSelectedPlayerIds((current) => {
      if (current.includes(playerId)) {
        // Se remover o player, remove também do mapa de devices
        const newMap = { ...playerDeviceMap };
        delete newMap[playerId];
        setPlayerDeviceMap(newMap);
        return current.filter((id) => id !== playerId);
      } else {
        return [...current, playerId];
      }
    });
  };

  const handleDeviceSelect = (playerId: string, deviceId: string) => {
    setPlayerDeviceMap(prev => ({ ...prev, [playerId]: deviceId }));
  };

  // 3. Toggle Device Returned Status (Device Level)
  const toggleDeviceReturn = (playerId: string, deviceId: string) => {
    return;
  };

  // 2. Change APD Type
  const changeApdType = (playerId: string, newType: GroupDataNode) => {
    toast.info(`Tipo alterado para ${newType}`);
  };

  const addDeviceToPlayer = useMutation({
    mutationFn: async ({ playerId, groupId }: { playerId: string; groupId: string }) => {
      const res = await fetch(`/api/games/${gameId}/groups/${groupId}/players?playerId=${playerId}`, {
        method: "POST"
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error remove player of group.");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Jogador removido do grupo!");
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
    },
    onError: (error) => {
      toast.error(error.message || "Error removing player from group.");
    }
  })

  const removePlayerFromGroup = useMutation({
    mutationFn: async ({ playerId, groupId }: { playerId: string; groupId: string }) => {
      const res = await fetch(`/api/games/${gameId}/groups/${groupId}/players?playerId=${playerId}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error remove player of group.");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Jogador removido do grupo!");
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
    },
    onError: (error) => {
      toast.error(error.message || "Error removing player from group.");
    }
  })

  // --- Render ---

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

        <div className="flex flex-col space-y-1">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Group className="w-6 h-6 text-primary" />
            Manage devices assigned to groups in the game.
          </h2>
          <p className="text-muted-foreground">
            Assign players to groups and optionally link devices to each player.
          </p>
        </div>

        {/* Lado Direito: Botão/Modal */}
        {gameData && <AddPlayerModal game={gameData} />}

      </div>

      <Separator />

      {groupsNodes.map((group) => {

        return (
          <Card key={group.id} className="w-full shadow-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{group.groupName}</CardTitle>
                  <CardDescription>Gestão de presenças, funções e devoluções.</CardDescription>
                </div>
                <Badge variant="outline">Total: {group.nodes.length}</Badge>
              </div>
              <div className="flex items-end gap-2">
                <Badge variant="secondary">{group.respawnDevice?.name || "No Respawn device"}</Badge>
                <Badge variant="secondary">{group.baseDevice?.name || "No Base device"}</Badge>
              </div>
            </CardHeader>

            <CardContent className="p-0">

              <Table key={group.id} className="mb-6">
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="w-[200px]">Player Name</TableHead>
                    <TableHead className="w-[180px]">Player Type</TableHead>
                    <TableHead className="min-w-[200px]">Devices Atribuídos</TableHead>
                    <TableHead className="min-w-[200px]">Devolução (Check-out)</TableHead>
                    <TableHead className="w-[40px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.nodes.map((node) => (
                    <TableRow key={node.playerId} className="hover:bg-muted/10">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {node.playerName?.slice(0, 2).toUpperCase() || "??"}
                          </div>
                          {node.playerName}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Select
                          defaultValue={node.playerType}
                        //onValueChange={(val) => changeApdType(node.playerType, val as PlayerType)}
                        >
                          <SelectTrigger className="h-8 w-full bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="medic">Medic</SelectItem>
                            <SelectItem value="eod">EOD</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>

                      {/* Coluna 4: Devices Atribuídos (+ Add) */}
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap gap-1">
                            {node.devices.map(d => (
                              <Badge key={d.deviceId} variant="secondary" className="text-[10px] font-normal">
                                {d.deviceName || "Unnamed Device"}
                              </Badge>
                            ))}
                            {node.devices.length === 0 && (
                              <span className="text-muted-foreground text-xs italic py-1">Sem equipamentos</span>
                            )}
                          </div>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 text-xs text-primary w-fit justify-start px-0 hover:bg-transparent hover:underline">
                                <Plus className="h-3 w-3 mr-1" /> Atribuir Equipamento
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <AlertDialogHeader>
                                <DialogTitle>Adicionar Equipamento</DialogTitle>
                              </AlertDialogHeader>
                              <div className="py-4 space-y-2">
                                <p className="text-sm text-muted-foreground mb-4">
                                  A atribuir a: <span className="font-bold text-foreground">{node.playerName?.slice(0, 2).toUpperCase() || "??"}</span>
                                </p>
                                <div className="grid grid-cols-1 gap-2">
                                  {gameData?.assignedDevices
                                    .filter(device => device.group === group.group)
                                    .map((device) => (
                                      <Button
                                        key={device.deviceId}
                                        variant="outline"
                                        className="justify-start"
                                        onClick={() => {
                                          
                                        }}
                                      >
                                        <Smartphone className="mr-2 h-4 w-4" /> {device.deviceName || "Unnamed Device"}
                                      </Button>
                                    ))
                                  }
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>

                      {/* Coluna 5: Lista de Devolução (Toggle Individual) */}
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {node.devices.length > 0 ? (
                            node.devices.map((device) => (
                              <div
                                key={device.deviceId}
                                onClick={() => toggleDeviceReturn(node.playerId, device.deviceId)}
                                className={cn(
                                  "cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium transition-all select-none shadow-sm",
                                  device.isReturned
                                    ? "bg-green-500 text-white border-green-600 hover:bg-green-600"
                                    : "bg-red-500 text-white border-red-600 hover:bg-red-600"
                                )}
                                title="Clique para alternar estado"
                              >
                                {device.isReturned ? <Check className="h-3 w-3" /> : <RotateCcw className="h-3 w-3" />}
                                {device.deviceName || "Unnamed Device"}
                              </div>
                            ))
                          ) : (
                            <span className="text-muted-foreground/30 text-xs">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Trash2 onClick={() => removePlayerFromGroup.mutate({ playerId: node.playerId, groupId: group.groupId })} className="h-4 w-4 hover:text-red-700 cursor-pointer" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}

    </div>
  );
}


interface AddPlayerModalProps {
  game: GameDoc;
}

export function AddPlayerModal({ game }: AddPlayerModalProps) {
  const queryClient = useQueryClient();

  // --- Estados Locais ---
  const [open, setOpen] = React.useState(false);
  const [selectedGroupId, setSelectedGroupId] = React.useState<string>("");
  const [selectedPlayerIds, setSelectedPlayerIds] = React.useState<string[]>([]);

  const availablePlayers = React.useMemo(() => {
    // 1. Coletar IDs ocupados
    const playersInGroupsIds = new Set<string>();
    game.groupsNodes.forEach((group) => {
      if (group.nodes) {
        group.nodes.forEach((node) => {
          playersInGroupsIds.add(node.playerId);
        });
      }
    });

    // 2. Filtrar
    return game.assignedPlayers.filter(
      (player) => !playersInGroupsIds.has(player.playerId)
    );
  }, [game.assignedPlayers, game.groupsNodes]);

  // --- Mutação ---
  const assignPlayersMutation = useMutation({
    mutationFn: async () => {
      if (!selectedGroupId) throw new Error("Por favor selecione um grupo.");
      if (selectedPlayerIds.length === 0) throw new Error("Selecione pelo menos um jogador.");

      // Exemplo de endpoint: POST /api/games/[id]/groups/[groupId]/add-players
      const res = await fetch(`/api/games/${game._id}/groups/${selectedGroupId}/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerIds: selectedPlayerIds
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Erro ao adicionar jogadores.");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Jogadores adicionados ao grupo!");

      // 1. Atualizar a cache para mostrar os novos dados na UI
      queryClient.invalidateQueries({ queryKey: ["game", game._id] });

      // 2. Resetar o formulário
      setSelectedPlayerIds([]);
      setSelectedGroupId("");

      // 3. Fechar a modal
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = () => {
    assignPlayersMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shrink-0">
          <UserPlus className="w-4 h-4 mr-2" />
          Adicionar Jogadores
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar ao Grupo</DialogTitle>
          <DialogDescription>
            Selecione o grupo e os jogadores que deseja associar.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Seletor de Grupo */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="group" className="text-right">
              Grupo
            </Label>
            <Select
              value={selectedGroupId}
              onValueChange={setSelectedGroupId}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione o grupo" />
              </SelectTrigger>
              <SelectContent>
                {game.groupsNodes.map((group) => (
                  <SelectItem key={group.id} value={group.groupId}>
                    {group.groupName || `Group ${group.groupId}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Seletor de Jogadores */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="players" className="text-right">
              Jogadores
            </Label>
            <div className="col-span-3">
              <MultiSelect
                placeholder="Selecione jogadores..."
                // Mapeia os jogadores disponíveis para o formato { label, value }
                items={availablePlayers.map((p) => ({
                  value: p.playerId,
                  label: p.playerName,
                }))}
                value={selectedPlayerIds}
                onChange={setSelectedPlayerIds}
                className="w-full"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                A mostrar {availablePlayers.length} jogadores disponíveis.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={assignPlayersMutation.isPending || !selectedGroupId || selectedPlayerIds.length === 0}
          >
            {assignPlayersMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Guardar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}