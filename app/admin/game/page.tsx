// app/admin/game/page.tsx
import Link from "next/link";
import { dbConnect } from "@/lib/db/mongo";
import Game from "@/lib/db/models/game";
import RowLink from "@/components/row-link";

// shadcn/ui
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const revalidate = 0; // sempre fresco
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type GameRow = {
  id: string;
  name: string;
  type?: string;
  status?: "planned" | "in_progress" | "completed" | "cancelled" | string;
  date?: Date | null;
  players: number;
  createdAt?: Date | null;
};

function fmtDate(date?: string | Date | null) {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium" }).format(d);
}

function fmtTime(date?: string | Date | null) {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-PT", { timeStyle: "short" }).format(d);
}

function StatusBadge({ status }: { status?: GameRow["status"] }) {
  if (!status) return <Badge variant="secondary">—</Badge>;
  const s = String(status);
  if (s === "in_progress") return <Badge className="bg-green-600 text-white hover:bg-green-600">A decorrer</Badge>;
  if (s === "completed") return <Badge className="bg-blue-600 text-white hover:bg-blue-600">Concluído</Badge>;
  if (s === "cancelled") return <Badge variant="destructive">Cancelado</Badge>;
  return <Badge variant="secondary">Planeado</Badge>;
}

export default async function GamesPage() {
  await dbConnect();
  const rows = await Game.find().sort({ createdAt: -1 }).lean();

  const games: GameRow[] = rows.map((g: any) => ({
    id: (g.id ?? g._id)?.toString(),
    name: g.name ?? "",
    type: g.type ?? "",
    status: g.status ?? "planned",
    date: g.date ? new Date(g.date) : null,
    players: Array.isArray(g.registerPlayers) ? g.registerPlayers.length : 0,
    createdAt: g.createdAt ? new Date(g.createdAt) : null,
  }));

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Jogos</h1>
          <p className="text-sm text-muted-foreground">Lista de todos os jogos.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild>
            <Link href="/admin/game/create">Novo jogo</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registos</CardTitle>
          <CardDescription>{games.length} jogo(s) encontrado(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Modo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-center">Players</TableHead>
                  <TableHead className="text-right">Criado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {games.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="py-10 text-center text-muted-foreground">
                      Nenhum jogo encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  games.map((g) => (
                    <RowLink key={g.id} href={`/admin/game/${g.id}`}>
                      <TableCell className="font-medium">{g.name}</TableCell>
                      <TableCell className="capitalize">{g.type?.replace(/-/g, " ") || "—"}</TableCell>
                      <TableCell><StatusBadge status={g.status} /></TableCell>
                      <TableCell>{fmtDate(g.date)}</TableCell>
                      <TableCell className="text-center">{g.players}</TableCell>
                      <TableCell className="text-right">{fmtDate(g.createdAt)}</TableCell>
                    </RowLink>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
