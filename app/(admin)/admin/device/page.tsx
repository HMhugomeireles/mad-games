// ==============================
// FILE: app/admin/device/page.tsx
// ==============================
import { dbConnect } from "@/lib/db/mongo";
import Device, { DeviceDoc } from "@/lib/db/models/device";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeviceTable } from "./DeviceTable"; // ⬅️ novo

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function DevicesPage() {
  await dbConnect();
  const devices = await Device.find().sort({ createdAt: -1 }).lean() as any[];

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

      <Card className="bg-transparent shadow-none border-none">
        <CardHeader>
          <CardTitle>Registos</CardTitle>
          <CardDescription>{devices.length} device(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <DeviceTable devices={devices} />
        </CardContent>
      </Card>
    </div>
  );
}
