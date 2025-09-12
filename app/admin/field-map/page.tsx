import { dbConnect } from "@/lib/db/mongo";
import FieldMap from "@/lib/db/models/field-map";

// shadcn/ui
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import FieldMapCreateButton from "@/components/field-map-create-button";
import FieldMapRowActions from "@/components/field-map-row-actions";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function fmtDate(date?: string | Date | null) {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium" }).format(d);
}

export default async function FieldMapPage() {
  await dbConnect();
  const rows = await FieldMap.find().sort({ createdAt: -1 }).lean();

  const items = (rows as any[]).map((r) => ({
    id: String(r.id ?? r._id),
    fieldMap: r.fieldMap ?? "",
    isActive: !!r.isActive,
    type: r.type ?? "other",
    location: r.location ?? "",
    createdAt: r.createdAt ? new Date(r.createdAt) : null,
  }));

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Field Maps</h1>
          <p className="text-sm text-muted-foreground">Lista de mapas/campos.</p>
        </div>
        <FieldMapCreateButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registos</CardTitle>
          <CardDescription>{items.length} registo(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead className="text-right">Criado em</TableHead>
                  <TableHead className="w-20 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                      Nenhum registo encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.fieldMap}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">{String(r.type)}</Badge>
                      </TableCell>
                      <TableCell>
                        {r.isActive ? (
                          <Badge className="bg-green-600 text-white hover:bg-green-600">Ativo</Badge>
                        ) : (
                          <Badge variant="destructive">Inativo</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{r.location || "—"}</TableCell>
                      <TableCell className="text-right">{fmtDate(r.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <FieldMapRowActions
                          row={{
                            id: r.id,
                            fieldMap: r.fieldMap,
                            isActive: r.isActive,
                            type: r.type,
                            description: (rows.find((x: any) => String(x._id ?? x.id) === r.id)?.description) ?? "",
                            location: r.location,
                            socialLinks: (rows.find((x: any) => String(x._id ?? x.id) === r.id)?.socialLinks) ?? [],
                            createdBy: (rows.find((x: any) => String(x._id ?? x.id) === r.id)?.createdBy) ?? "",
                          }}
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
  );
}
