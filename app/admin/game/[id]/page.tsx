import Link from "next/link";
import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db/mongo";
import Game, { GameDoc } from "@/lib/db/models/game";
import Player from "@/lib/db/models/player";
import Device from "@/lib/db/models/device";

// shadcn/ui
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AssignDeviceForm, RegisterPlayerForm } from "./_components";
import DeleteGameButton from "@/components/delete-game-button";
import GameSettingsModalButton from "./_components/game-settings-modal-button";
import { fmtDate, fmtTime } from "@/lib/utils";
import { TypographyH1 } from "@/components/ui/typography";
import RemovePlayerButton from "@/components/remove-player-button";
import EditRegisteredPlayerButton from "./_components/edit-registered-player-button";
import { BarChart3, CheckCircle2, XCircle } from "lucide-react";
import EditDeviceReturnButton from "./_components/edit-device-return-button";


export const revalidate = 0;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type G = {
  id: string;
  name: string;
  type?: string;
  status?: string;
  date?: Date | null;
  startTime?: Date | null;
  endTime?: Date | null;
  registerPlayers: { id: string; playerId: string; rfid?: string, group?: { id: string; groupName: string; groupColor: string } }[];
  gameDevices: { id: string; deviceId: string; assignedPlayerId?: string | null; havePlayerReturnDevice: boolean }[];
  gameSettings: {
    groups?: { id: string; groupName: string; groupColor: string }[];
  }
  createdAt?: Date | null;
};



export default async function GameDetailsPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  await dbConnect();
  const doc = await Game.findById(id).lean().exec() as GameDoc | null;
  if (!doc) return notFound();

  const game: G = {
    id: doc._id.toString(),
    name: doc.name ?? "",
    type: doc.type ?? "",
    status: doc.status ?? "planned",
    date: doc.date ? new Date(doc.date) : null,
    registerPlayers: doc.registerPlayers ?? [],
    gameDevices: (doc.gameDevices ?? []).map((d: any) => ({
      id: d.id,
      deviceId: String(d.deviceId),
      assignedPlayerId: d.assignedPlayerId ? String(d.assignedPlayerId) : null,
      havePlayerReturnDevice: !!d.havePlayerReturnDevice,
    })),
    gameSettings: {
      groups: doc.gameSettings?.groups
        ? (doc.gameSettings.groups as any[]).map((g) => ({
          id: String(g.id),
          groupName: g.groupName || "",
          groupColor: g.groupColor || "",
        }))
        : [],
    },
    createdAt: doc.createdAt ? new Date(doc.createdAt) : null,
  };

  // lookup de nomes de players e devices
  const playerIds = Array.from(new Set(game.registerPlayers.map((p) => p.playerId).concat(game.gameDevices.map((d) => d.assignedPlayerId || "").filter(Boolean) as string[])));
  const deviceIds = Array.from(new Set(game.gameDevices.map((d) => d.deviceId)));

  const [playersAll, playersLookup, devicesLookup] = await Promise.all([
    Player.find().select({ _id: 1, name: 1, team: 1 }).sort({ name: 1 }).lean(),
    playerIds.length ? Player.find({ _id: { $in: playerIds } }).select({ _id: 1, name: 1, team: 1 }).lean() : [],
    deviceIds.length ? Device.find({ _id: { $in: deviceIds } }).select({ _id: 1, name: 1 }).lean() : [],
  ]);

  const playerNameById = new Map<string, string>();
  (playersLookup as any[]).forEach((p) => playerNameById.set(String(p._id), p.name ?? "(sem nome)"));
  const deviceNameById = new Map<string, string>();
  (devicesLookup as any[]).forEach((d) => deviceNameById.set(String(d._id), d.name ?? "(sem nome)"));

  const groups =
    Array.isArray(doc.gameSettings?.groups)
      ? (doc.gameSettings.groups as any[]).map((g) => ({
        id: String(g.id),
        groupName: g.groupName || "",
        groupColor: g.groupColor || "",
      }))
      : [];

  const isFuture = game.date ? game.date.getTime() < Date.now() : false;

  const settingsGroups = Array.isArray(doc.gameSettings?.groups)
    ? (doc.gameSettings.groups as any[]).map((g) => ({ id: String(g.id), groupName: g.groupName || "", groupColor: g.groupColor || "" }))
    : [];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <TypographyH1>{game.name}</TypographyH1>
          <p className="text-sm text-muted-foreground">Modo: <span className="capitalize">{game.type?.replace(/-/g, " ") || "—"}</span> · Estado: {game.status}</p>
          <p className="text-sm text-muted-foreground">Data: {fmtDate(game.date)} · Início: {fmtTime(game.startTime)} · Fim: {fmtTime(game.endTime)}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline"><Link href="/admin/game">Voltar</Link></Button>
          <Button asChild variant="secondary">
            <Link href={`/admin/game/${game.id}/results`}>
              <BarChart3 className="mr-2 h-4 w-4" /> Resultados
            </Link>
          </Button>
          <GameSettingsModalButton gameId={game.id} initialSettings={game.gameSettings ?? {}} />
          <DeleteGameButton gameId={game.id} disabled={isFuture} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* --- Registar jogador no jogo --- */}
        <Card>
          <CardHeader>
            <CardTitle>Registar jogador</CardTitle>
            <CardDescription>Adiciona um jogador existente a este jogo.</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterPlayerForm
              gameId={game.id}
              playersAll={(playersAll as any[]).map((p) => ({ id: String(p._id), name: p.name as string, team: p.team || "" }))}
              already={(game.registerPlayers || []).map((p) => p.playerId)}
              groups={groups}
            />
          </CardContent>
        </Card>

        {/* --- Atribuir device a jogador --- */}
        <Card>
          <CardHeader>
            <CardTitle>Atribuir device</CardTitle>
            <CardDescription>Liga um device a um jogador deste jogo.</CardDescription>
          </CardHeader>
          <CardContent>
            <AssignDeviceForm
              gameId={game.id}
              participants={(game.registerPlayers || []).map((p) => ({
                id: p.playerId,
                name: playerNameById.get(p.playerId) || p.playerId,
              }))}
              blockedDeviceIds={(game.gameDevices || []).map((d) => d.deviceId)}
            />
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      {/* --- Tabelas --- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Jogadores registados ({game.registerPlayers.length})</CardTitle>
            <CardDescription>Lista dos participantes neste jogo.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead className="w-10 text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {game.registerPlayers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="py-8 text-center text-muted-foreground">Nenhum jogador.</TableCell>
                    </TableRow>
                  ) : (
                    (playersLookup as any[]).length === 0 ? (
                      game.registerPlayers.map((p) => (
                        <TableRow key={p.id}><TableCell>{p.playerId}</TableCell><TableCell>—</TableCell></TableRow>
                      ))
                    ) : (
                      game.registerPlayers.map((p) => {
                        const pl = (playersLookup as any[]).find((x) => String(x._id) === p.playerId);
                        return (
                          <TableRow key={p.id}>
                            <TableCell className="font-medium">{pl?.name || p.playerId}</TableCell>

                            <TableCell>
                              {(() => {
                                return p.group ? (
                                  <span className="capitalize">
                                    {p.group.groupName}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                );
                              })()}
                            </TableCell>

                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <EditRegisteredPlayerButton
                                  gameId={game.id}
                                  playerId={p.playerId}
                                  playerName={pl?.name}
                                  initialGroupId={p.group?.id ?? (p as any).groupId}
                                  initialRfid={p.rfid}
                                  groups={groups} // vindo de doc.gameSettings.groups
                                />
                                <RemovePlayerButton
                                  gameId={game.id}
                                  playerId={p.playerId}
                                  playerName={pl?.name}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Devices ({game.gameDevices.length})</CardTitle>
            <CardDescription>Devices ligados a este jogo e respetivos donos.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>Jogador</TableHead>
                    <TableHead>Returned?</TableHead>
                    <TableHead className="w-10 text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {game.gameDevices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">Nenhum device.</TableCell>
                    </TableRow>
                  ) : (
                    game.gameDevices.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell className="font-medium">
                          {deviceNameById.get(d.deviceId) || d.deviceId}
                        </TableCell>

                        <TableCell>
                          {d.assignedPlayerId
                            ? (playerNameById.get(d.assignedPlayerId) || d.assignedPlayerId)
                            : <span className="text-muted-foreground">—</span>}
                        </TableCell>

                        {/* Entregue? (ícone) */}
                        <TableCell className="text-center">
                          {d.havePlayerReturnDevice
                            ? <CheckCircle2 className="inline-block h-4 w-4 text-green-600" />
                            : <XCircle className="inline-block h-4 w-4 text-red-600" />}
                        </TableCell>

                        {/* Editar (modal) */}
                        <TableCell className="text-right">
                          <EditDeviceReturnButton
                            gameId={game.id}
                            deviceId={d.deviceId}
                            current={!!d.havePlayerReturnDevice}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
