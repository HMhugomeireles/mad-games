// app/admin/game/[id]/results/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db/mongo";
import Game from "@/lib/db/models/game";
import Player from "@/lib/db/models/player";

// shadcn/ui
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TypographyH1 } from "@/components/ui/typography";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SCORE = { kill: 3, check: 2, death: -1 } as const;

function fmtDateTime(d?: Date | null) {
  if (!d) return "—";
  if (Number.isNaN(d.getTime())) return "—";
  const date = new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium" }).format(d);
  const time = new Intl.DateTimeFormat("pt-PT", { timeStyle: "medium" }).format(d);
  return `${date} ${time}`;
}

type RankLine = {
  playerId: string;
  name: string;
  kills: number;
  checks: number;
  deaths: number;
  total: number;
};

export default async function GameResultsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  await dbConnect();
  const doc = await Game.findById(id).lean();
  if (!doc) return notFound();

  // Normalizar resultados
  const rawResults: any[] = Array.isArray((doc as any).gameResults) ? (doc as any).gameResults : [];
  const results = rawResults.map((r) => {
    const kind = String(r.type ?? r.event ?? r.kind ?? "").toLowerCase();
    const ts =
      r.timestamp ?? r.time ?? r.at ?? r.createdAt ?? null;
    const when =
      ts instanceof Date
        ? ts
        : typeof ts === "number"
        ? new Date(ts)
        : typeof ts === "string"
        ? new Date(ts)
        : null;
    return {
      id: String(r.id ?? r._id ?? Math.random().toString(36).slice(2)),
      playerId: String(r.playerId ?? r.userId ?? r.attackerId ?? ""),
      targetId: r.targetId ? String(r.targetId) : undefined,
      deviceId: r.deviceId ? String(r.deviceId) : r.gameDeviceId ? String(r.gameDeviceId) : undefined,
      kind, // "kill" | "check" | "death" | ...
      when,
    };
  });

  // Jogadores envolvidos (registados + presentes em resultados)
  const registered = Array.isArray((doc as any).registerPlayers) ? (doc as any).registerPlayers : [];
  const playerIds = new Set<string>();
  registered.forEach((p: any) => playerIds.add(String(p.playerId)));
  results.forEach((r) => r.playerId && playerIds.add(r.playerId));

  const playersLookup = playerIds.size
    ? await Player.find({ _id: { $in: Array.from(playerIds) } })
        .select({ _id: 1, name: 1 })
        .lean()
    : [];

  const nameById = new Map<string, string>();
  playersLookup.forEach((p: any) => nameById.set(String(p._id), p.name ?? "(sem nome)"));
  // fallback para quem está registado mas não veio no lookup
  registered.forEach((p: any) => {
    if (!nameById.has(String(p.playerId))) nameById.set(String(p.playerId), String(p.playerId));
  });

  // Ranking
  const base: Record<string, RankLine> = {};
  // incluir todos os registados com 0
  registered.forEach((p: any) => {
    const pid = String(p.playerId);
    base[pid] ||= {
      playerId: pid,
      name: nameById.get(pid) || pid,
      kills: 0,
      checks: 0,
      deaths: 0,
      total: 0,
    };
  });

  for (const r of results) {
    if (!r.playerId) continue;
    base[r.playerId] ||= {
      playerId: r.playerId,
      name: nameById.get(r.playerId) || r.playerId,
      kills: 0,
      checks: 0,
      deaths: 0,
      total: 0,
    };
    if (r.kind === "kill") {
      base[r.playerId].kills += 1;
      base[r.playerId].total += SCORE.kill;
    } else if (r.kind === "check") {
      base[r.playerId].checks += 1;
      base[r.playerId].total += SCORE.check;
    } else if (r.kind === "death") {
      base[r.playerId].deaths += 1;
      base[r.playerId].total += SCORE.death;
    }
  }

  const ranking = Object.values(base).sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    if (b.kills !== a.kills) return b.kills - a.kills;
    if (a.deaths !== b.deaths) return a.deaths - b.deaths; // menos mortes melhor
    return a.name.localeCompare(b.name);
  });

  const gameName = String((doc as any).name ?? "");
  const gameType = String((doc as any).type ?? "");

  // Ordenar eventos (mais recentes primeiro)
  const resultsSorted = results
    .slice()
    .sort((a, b) => {
      const ta = a.when ? a.when.getTime() : 0;
      const tb = b.when ? b.when.getTime() : 0;
      return tb - ta;
    });

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <TypographyH1>Resultados — {gameName}</TypographyH1>
          <p className="text-sm text-muted-foreground">
            Modo: <span className="capitalize">{gameType?.replace(/-/g, " ") || "—"}</span> ·
            &nbsp;Pontuação: kill=3, check=2, morte=−1
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline"><Link href={`/admin/game/${String((doc as any).id ?? (doc as any)._id)}`}>Voltar ao jogo</Link></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ESQUERDA: Eventos */}
        <Card>
          <CardHeader>
            <CardTitle>Eventos ({resultsSorted.length})</CardTitle>
            <CardDescription>Lista cronológica dos eventos deste jogo.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quando</TableHead>
                    <TableHead>Jogador</TableHead>
                    <TableHead>Evento</TableHead>
                    <TableHead>Alvo/Device</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resultsSorted.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                        Sem eventos.
                      </TableCell>
                    </TableRow>
                  ) : (
                    resultsSorted.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{fmtDateTime(r.when)}</TableCell>
                        <TableCell className="font-medium">
                          {nameById.get(r.playerId) || r.playerId}
                        </TableCell>
                        <TableCell className="capitalize">{r.kind || "—"}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {r.targetId
                            ? `vs ${nameById.get(r.targetId) || r.targetId}`
                            : r.deviceId
                            ? String(r.deviceId)
                            : "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* DIREITA: Ranking */}
        <Card>
          <CardHeader>
            <CardTitle>Ranking ({ranking.length})</CardTitle>
            <CardDescription>Top de jogadores por pontuação.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Jogador</TableHead>
                    <TableHead className="text-center">Kills</TableHead>
                    <TableHead className="text-center">Checks</TableHead>
                    <TableHead className="text-center">Mortes</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ranking.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                        Sem registos para ranking.
                      </TableCell>
                    </TableRow>
                  ) : (
                    ranking.map((r, i) => (
                      <TableRow key={r.playerId}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell className="font-medium">{r.name}</TableCell>
                        <TableCell className="text-center">{r.kills}</TableCell>
                        <TableCell className="text-center">{r.checks}</TableCell>
                        <TableCell className="text-center">{r.deaths}</TableCell>
                        <TableCell className="text-right font-semibold">{r.total}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      <div className="text-sm text-muted-foreground">
        Regras: Kill = +3 · Check = +2 · Morte = −1
      </div>
    </div>
  );
}
