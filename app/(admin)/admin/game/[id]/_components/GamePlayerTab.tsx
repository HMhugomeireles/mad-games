"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // ✅ Imports TanStack
import { Search, Plus, Trash2, Users, Loader2, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn, getApdDateColor } from "@/lib/utils";
import { GameDoc } from "@/lib/db/models/game";
import { fetchGameById } from "@/lib/http/game";
import { fetchPlayers } from "@/lib/http/player";

// --- Types ---
interface PlayerDoc {
  _id?: string;
  id?: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  apdValidateDate?: Date | string;
}

interface GamePlayerTabProps {
  gameId: string;
  initialGameData?: GameDoc; 
  initialPlayersList?: PlayerDoc[]; 
}

export function GamePlayerTab({
  gameId,
  initialGameData,
  initialPlayersList
}: GamePlayerTabProps) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = React.useState("");

  const { data: availablePlayers = [] } = useQuery({
    queryKey: ["players"],
    queryFn: fetchPlayers,
    initialData: initialPlayersList || [],
  });

  const { data: gameData } = useQuery({
    queryKey: ["game", gameId],
    queryFn: () => fetchGameById(gameId),
    initialData: initialGameData,
  });

  const togglePresence = useMutation({
    mutationFn: async (playerId: string) => {
      await fetch(`/api/games/${gameId}/register-player`, {
        method: "PUT",
        body: JSON.stringify({ playerId }),
      }).catch(() => { throw new Error("Failed to toggle presence") });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
      toast.success("Player status updated!");
    }
  });

  // Extrair a lista de registados do objeto do jogo
  const registeredPlayers = gameData?.assignedPlayers || [];

  // 3. Mutação para Adicionar Jogador
  const addPlayerMutation = useMutation({
    mutationFn: async (playerId: string) => {
      const res = await fetch(`/api/games/${gameId}/register-player`, {
        method: "POST",
        body: JSON.stringify({ playerId }),
      });
      if (!res.ok) throw new Error("Failed to add player");
      return res.json();
    },
    onSuccess: (_, playerId) => {
      // Encontra o nome apenas para o Toast
      const player = availablePlayers.find(p => getPlayerId(p) === playerId);
      toast.success(`${player?.name || "Player"} added!`);

      // ✨ Mágica do TanStack: Invalida a query do jogo para recarregar os dados
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
    },
    onError: () => toast.error("Error adding player."),
  });

  // 4. Mutação para Remover Jogador
  const removePlayerMutation = useMutation({
    mutationFn: async (playerId: string) => {
      const res = await fetch(`/api/games/${gameId}/register-player?playerId=${playerId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Falha ao remover");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Jogador removido.");
      // ✨ Recarrega os dados do servidor automaticamente
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
    },
    onError: (error) => toast.error("Erro ao remover jogador.") && console.error("Remove Player Error:", error.message)
  });

  // --- Helpers ---
  const getPlayerId = (player: PlayerDoc): string => String(player._id || player.id || "");

  const isAlreadyRegistered = (originalId: string) => {
    if (!originalId) return false;
    return registeredPlayers.some((p) => String(p.playerId) === String(originalId));
  };

  // Filtro de pesquisa (Client-side filtering)
  const filteredAvailable = React.useMemo(() => {
    if (!searchQuery) return availablePlayers;
    return availablePlayers.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, availablePlayers]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Player Game Register</h2>
        <p className="text-muted-foreground">Gerir inscrições e presenças para este jogo.</p>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ================= ESQUERDA: Disponíveis ================= */}
        <Card className="h-[500px] flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="h-5 w-5" /> Procurar Jogadores
            </CardTitle>
            <CardDescription>Pesquisa na base de dados global.</CardDescription>
            <div className="pt-2">
              <Input
                placeholder="Nome..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full px-6 pb-4">
              <div className="space-y-3">
                {filteredAvailable.map((player) => {
                  const pId = getPlayerId(player);
                  const isAdded = isAlreadyRegistered(pId);

                  // Verifica se está a carregar especificamente este ID
                  const isAddingThis = addPlayerMutation.isPending && addPlayerMutation.variables === pId;

                  return (
                    <div key={pId} className={cn(
                      "flex items-center justify-between p-3 rounded-lg border transition-colors",
                      isAdded ? "bg-muted/50 opacity-60" : "bg-card hover:bg-muted/50"
                    )}>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={player.avatarUrl} />
                          <AvatarFallback>{(player.name || "??").slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{player.name}</span>
                          <span className={cn("text-xs", getApdDateColor(player.apdValidateDate ?? new Date(), gameData?.date ?? new Date()))}>
                            <strong>APD:</strong> {player.apdValidateDate ? new Date(player.apdValidateDate).toLocaleDateString() : "N/A"}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={isAdded ? "ghost" : "default"}
                        disabled={isAdded || isAddingThis}
                        onClick={() => addPlayerMutation.mutate(pId)}
                      >
                        {isAddingThis ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isAdded ? (
                          <span className="text-xs text-green-600 font-medium">Inscrito</span>
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* ================= DIREITA: Inscritos ================= */}
        <Card className="h-[500px] flex flex-col border-primary/20 shadow-md">
          <CardHeader className="bg-muted/30 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" /> Inscritos
                </CardTitle>
                <CardDescription>
                  Jogadores confirmados. {gameData ? "" : "(A carregar...)"}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-background">Total: {registeredPlayers.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full px-6 py-4">
              <div className="space-y-3">
                {registeredPlayers.map((player) => {
                  const isRemovingThis = removePlayerMutation.isPending && removePlayerMutation.variables === player.playerId;

                  return (
                    <div
                      key={player.playerId}
                      // 1. Mudamos de "group" para "group/row" para isolar o hover desta linha
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border-2 border-background">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {(player.playerName || "??").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{player.playerName}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className={cn(
                            "w-28 transition-all duration-300 font-semibold border-2 cursor-pointer",
                            player.isPresent
                              ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200 hover:border-green-300"
                              : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:border-red-300"
                          )}
                          onClick={() => togglePresence.mutate(player.playerId)}
                        >
                          {player.isPresent ? (
                            <> <UserCheck className="mr-2 h-4 w-4" /> In </>
                          ) : (
                            <> <UserX className="mr-2 h-4 w-4" /> Out </>
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          disabled={isRemovingThis}
                          className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-destructive/10 opacity-100 cursor-pointer"
                          onClick={() => removePlayerMutation.mutate(player.playerId)}
                        >
                          {isRemovingThis ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}