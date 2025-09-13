export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/lib/db/mongo";
import Game from "@/lib/db/models/game";

const BodySchema = z.object({ 
  playerId: z.string().min(1),
  groupId: z.string().optional(),
  rfid: z.string().optional()
});

export async function POST(
  req: Request,
   { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;
  await dbConnect();
  const json = await req.json();
  console.log("[register-player] raw body:", JSON.stringify(json, null, 2));

  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    console.error("[register-player] validation error:", parsed.error.flatten());
    return NextResponse.json({ error: parsed.error.flatten(), received: json }, { status: 400 });
  }
  const body = parsed.data;

  console.log("Registering player", body.playerId, "to game", gameId, "with groupId", body.groupId, "and rfid", body.rfid);

  const game = await Game.findById(gameId);
  if (!game) return NextResponse.json({ error: "game not found" }, { status: 404 });

  const exists = game.registerPlayers.some((p: any) => String(p.playerId) === body.playerId);
  if (exists) return NextResponse.json({ error: "player already registered" }, { status: 409 });

  const group = body.groupId
  ? (game.gameSettings?.groups || []).find((g: any) => String(g.id) === String(body.groupId))
  : undefined;

  game.registerPlayers.push({ 
    playerId: body.playerId, 
    rfid: body.rfid, 
    groupId: body.groupId,
    ...(group ? { group } : {})
  });
  await game.save();
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, ctx: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await ctx.params;
  await dbConnect();

  const url = new URL(req.url);
  const playerId = url.searchParams.get("playerId");
  if (!playerId) {
    return NextResponse.json({ error: "playerId is required" }, { status: 400 });
  }

  const game = await Game.findById(gameId);
  if (!game) return NextResponse.json({ error: "game not found" }, { status: 404 });

  // Remove o registo do jogador
  game.registerPlayers = game.registerPlayers.filter(
    (p: any) => String(p.playerId) !== playerId
  );

  // (Opcional) Desatribuir devices que estavam ligados a este jogador
  game.gameDevices.forEach((d: any) => {
    if (String(d.assignedPlayerId) === playerId) d.assignedPlayerId = undefined;
  });

  await game.save();
  return NextResponse.json({ ok: true });
}


const PatchSchema = z.object({
  playerId: z.string().min(1),
  groupId: z.string().optional(),   // undefined => limpar grupo
  rfid: z.string().optional(),      // "" => limpar RFID
});

export async function PATCH(req: Request, ctx: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await ctx.params;
  await dbConnect();

  const body = PatchSchema.parse(await req.json());
  const game = await Game.findById(gameId);
  if (!game) return NextResponse.json({ error: "game not found" }, { status: 404 });

  const idx = game.registerPlayers.findIndex((p: any) => String(p.playerId) === body.playerId);
  if (idx < 0) return NextResponse.json({ error: "player not registered" }, { status: 404 });

  // RFID
  if ("rfid" in body) {
    game.registerPlayers[idx].rfid = body.rfid ? String(body.rfid) : undefined;
  }

  // Grupo (snapshot + opcional groupId, se existir no schema)
  if ("groupId" in body) {
    if (!body.groupId) {
      game.registerPlayers[idx].group = undefined;
      // @ts-ignore (se tiveres groupId no schema, isto grava; caso não, é ignorado em strict mode)
      game.registerPlayers[idx].groupId = undefined;
    } else {
      const g = (game.gameSettings?.groups as any[])?.find((gg: any) => String(gg.id) === String(body.groupId));
      if (!g) return NextResponse.json({ error: "group not found" }, { status: 400 });
      game.registerPlayers[idx].group = g;
      // @ts-ignore
      game.registerPlayers[idx].groupId = body.groupId;
    }
  }

  await game.save();
  return NextResponse.json({ ok: true });
}