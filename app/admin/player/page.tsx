// app/admin/player/page.tsx
import Link from "next/link";
import { dbConnect } from "@/lib/db/mongo";
import Player from "@/lib/db/models/player";

// shadcn/ui
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


export const revalidate = 0; // sempre fresco
export const dynamic = "force-dynamic"; // garante SSR dinâmico
export const runtime = "nodejs";


function fmt(date?: string | Date | null) {
    if (!date) return "—";
    const d = typeof date === "string" ? new Date(date) : date;
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium" }).format(d);
}


type ApdStatus = "valid" | "expiring" | "expired" | undefined;
function getApdStatus(apd?: string | null, apdValidateDate?: string | Date | null): ApdStatus {
    if (!apd) return undefined; // sem APD, não mostra badge
    if (!apdValidateDate) return undefined; // sem data, não conseguimos avaliar
    const now = new Date();
    const end = typeof apdValidateDate === "string" ? new Date(apdValidateDate) : apdValidateDate;
    if (Number.isNaN(end.getTime())) return undefined;


    // diferença em dias (float)
    const diffMs = end.getTime() - now.getTime();
    const days = diffMs / (1000 * 60 * 60 * 24);


    if (diffMs < 0) return "expired"; // já passou
    if (days <= 7) return "expiring"; // última semana
    return "valid"; // válido (> 7 dias)
}


export default async function PlayersPage() {
    await dbConnect();
    // Busca jogadores (ajuste o sort conforme necessidade)
    const rows = await Player.find().sort({ createdAt: -1 }).lean();


    // Normaliza id e datas para serialização
    const players = rows.map((p: any) => ({
        id: (p.id ?? p._id)?.toString(),
        name: p.name ?? "",
        apd: p.apd ?? null,
        apdValidateDate: p.apdValidateDate ? new Date(p.apdValidateDate) : null,
        team: p.team ?? "",
        createdAt: p.createdAt ? new Date(p.createdAt) : null,
    }));


    return (
        <div className="container mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Jogadores</h1>
                    <p className="text-sm text-muted-foreground">Lista de todos os jogadores registados.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button asChild>
                        <Link href="/admin/player/create">Novo jogador</Link>
                    </Button>
                </div>
            </div>


            <Card>
                <CardHeader>
                    <CardTitle>Registos</CardTitle>
                    <CardDescription>{players.length} jogador(es) encontrado(s)</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Equipa</TableHead>
                                    <TableHead>APD</TableHead>
                                    <TableHead>Validade APD</TableHead>
                                    <TableHead className="text-right">Criado em</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {players.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                                            Nenhum jogador encontrado.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    players.map((p) => {
                                        const status = getApdStatus(p.apd, p.apdValidateDate);
                                        return (
                                            <TableRow key={p.id}>
                                                <TableCell className="font-medium">{p.name}</TableCell>
                                                <TableCell>{p.team || "—"}</TableCell>
                                                <TableCell>
                                                    {p.apd ? (
                                                        <div className="flex items-center gap-2">
                                                            <span>{p.apd}</span>
                                                            {status === undefined ? null : status === "valid" ? (
                                                                <Badge className="bg-green-600 text-white hover:bg-green-600">Válido</Badge>
                                                            ) : status === "expiring" ? (
                                                                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">A expirar</Badge>
                                                            ) : (
                                                                <Badge variant="destructive">Expirado</Badge>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">—</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>{fmt(p.apdValidateDate)}</TableCell>
                                                <TableCell className="text-right">{fmt(p.createdAt)}</TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}