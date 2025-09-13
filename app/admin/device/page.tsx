// ==============================
// FILE: app/admin/device/page.tsx
// ==============================
import { dbConnect } from "@/lib/db/mongo";
import Device from "@/lib/db/models/device";
import Link from "next/link";

// shadcn/ui
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function formatMac(mac?: string | null) {
  if (!mac) return "—";
  const norm = mac.toLowerCase().replace(/[^a-f0-9]/g, "");
  if (!/^([a-f0-9]{12})$/.test(norm)) return mac;
  return norm.match(/.{1,2}/g)!.join(":");
}

export default async function DevicesPage() {
  await dbConnect();
  const rows = await Device.find().sort({ createdAt: -1 }).lean();

  const devices = rows.map((d: any) => ({
    id: (d.id ?? d._id)?.toString(),
    name: d.name ?? "",
    mac: d.mac ?? null,
    description: d.description ?? "",
    type: d.type ?? "eletronic",
    status: d.status ?? "offline",
  }));

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Devices</h1>
          <p className="text-sm text-muted-foreground">Lista de todos os devices registados.</p>
        </div>
        <div>
          <Button asChild>
            <Link href="/admin/device/create">Novo device</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registos</CardTitle>
          <CardDescription>{devices.length} device(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>MAC</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                      Nenhum device encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  devices.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell>{formatMac(d.mac)}</TableCell>
                      <TableCell>
                        {d.type ? (
                          <Badge variant="secondary" className="capitalize">
                            {String(d.type).replace(/-/g, " ")}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {d.status === "online" ? (
                          <BadgeCheck className="h-4 w-4 text-green-500"/>
                        ) : (
                          <BadgeCheck className="h-4 w-4 text-gray-400" />
                        )}
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
  );
}
