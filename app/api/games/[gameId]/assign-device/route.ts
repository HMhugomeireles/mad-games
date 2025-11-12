export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/lib/db/mongo";
import Game from "@/lib/db/models/game";

const Body = z.object({
  deviceIds: z.array(z.string()).min(1, "Seleciona pelo menos um device"),
  assignedPlayerId: z.string().optional(),
  deviceStatus: z.enum(["online", "offline", "in_use"]).default("offline"),
  deviceLocation: z.string().optional().default(""),
});


export async function POST(req: Request,   { params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;

  // Parse seguro do body
  let parsed: ReturnType<typeof Body.safeParse>;
  try {
    parsed = await Body.safeParse(await req.json());
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Body inválido", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { deviceIds, assignedPlayerId, deviceStatus, deviceLocation } = parsed.data;

  await dbConnect();

  const game = await Game.findById(gameId);
  if (!game) return NextResponse.json({ error: "game not found" }, { status: 404 });

  // Se foi enviado assignedPlayerId, valida registro no jogo
  if (assignedPlayerId) {
    const registered = game.registerPlayers?.some(
      (p: any) => String(p.playerId) === String(assignedPlayerId)
    );
    if (!registered) {
      return NextResponse.json(
        { error: "player not registered in this game" },
        { status: 400 }
      );
    }
  }

  // Garante arrays existentes
  if (!Array.isArray(game.gameDevices)) game.gameDevices = [];

  // Upsert para cada deviceId
  const location =
    deviceStatus === "online" && deviceLocation ? deviceLocation : undefined;

  let created = 0;
  let updated = 0;

  for (const deviceId of deviceIds) {
    const idx = game.gameDevices.findIndex(
      (d: any) => String(d.deviceId) === String(deviceId)
    );

    if (idx >= 0) {
      // update
      game.gameDevices[idx].assignedPlayerId = assignedPlayerId;
      game.gameDevices[idx].deviceStatus = deviceStatus;
      game.gameDevices[idx].deviceLocation = location;
      updated++;
    } else {
      // create
      game.gameDevices.push({
        deviceId,
        assignedPlayerId,
        deviceStatus,
        deviceLocation: location,
        havePlayerReturnDevice: false,
      });
      created++;
    }
  }

  await game.save();

  return NextResponse.json({
    ok: true,
    gameId,
    created,
    updated,
    count: deviceIds.length,
  });
}
