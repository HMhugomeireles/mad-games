export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/lib/db/mongo";
import Game from "@/lib/db/models/game";
import Device from "@/lib/db/models/device";

const Body = z.object({
  deviceId: z.string().min(1),
  assignedPlayerId: z.string().optional().default(undefined),
  deviceStatus: z.enum(["online", "offline", "in_use"]).default("offline"),
  deviceLocation: z.string().optional(),
});

export async function POST(req: Request, ctx: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await ctx.params;
  await dbConnect();

  const body = Body.parse(await req.json());
  const game = await Game.findById(gameId);
  if (!game) return NextResponse.json({ error: "game not found" }, { status: 404 });

  // garantir que o jogador está registado
  const registered = game.registerPlayers.some((p: any) => String(p.playerId) === body.assignedPlayerId);
  if (!registered) return NextResponse.json({ error: "player not registered in this game" }, { status: 400 });

  const idx = game.gameDevices.findIndex((d: any) => String(d.deviceId) === body.deviceId);
  if (idx >= 0) {
    game.gameDevices[idx].assignedPlayerId = body.assignedPlayerId;
    game.gameDevices[idx].deviceStatus = body.deviceStatus;
    game.gameDevices[idx].deviceLocation = body.deviceStatus === "online" ? body.deviceLocation : undefined;
  } else {
    game.gameDevices.push({
      deviceId: body.deviceId,
      assignedPlayerId: body.assignedPlayerId,
      deviceStatus: body.deviceStatus,
      deviceLocation: body.deviceStatus === "online" ? body.deviceLocation : undefined,
      havePlayerReturnDevice: false,
    });
  }

  await game.save();
  return NextResponse.json({ ok: true });
}
