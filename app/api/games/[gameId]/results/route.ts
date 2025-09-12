export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { dbConnect } from "@/lib/db/mongo";
import Game from "@/lib/db/models/game";

// --- CORS helpers ---
const ALLOW_ORIGIN = "*"; // ajusta se quiseres restringir
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": ALLOW_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
};
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

// --- (Opcional) Auth por API Key ---
// Define RESULTS_API_KEY no .env para exigir a chave.
// Se não existir, a rota aceita sem chave.
function checkApiKey(req: Request) {
  const expected = process.env.RESULTS_API_KEY;
  if (!expected) return true;
  const h = req.headers.get("x-api-key")
    ?? req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return h === expected;
}

// --- Validação do payload ---
const Body = z.object({
  type: z.enum(["kill", "check", "death"]),
  playerId: z.string().min(1),
  deviceId: z.string().optional(),
  timestamp: z.coerce.date().optional(),
});

export async function POST(req: Request, ctx: { params: Promise<{ gameId: string }> }) {
  if (!checkApiKey(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: CORS_HEADERS });
  }

  const { gameId } = await ctx.params;

  await dbConnect();

  // valida body
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400, headers: CORS_HEADERS });
  }
  const body = parsed.data;

  // carrega jogo
  const game = await Game.findById(gameId);
  if (!game) {
    return NextResponse.json({ error: "game not found" }, { status: 404, headers: CORS_HEADERS });
  }

  // tem de estar a decorrer
  const now = new Date();
  const startedOk = !game.startTime || now >= new Date(game.startTime);
  const notEnded = !game.endTime || now <= new Date(game.endTime);
  if (String(game.status) !== "in_progress" || !startedOk || !notEnded) {
    return NextResponse.json(
      { error: "game is not in progress" },
      { status: 409, headers: CORS_HEADERS }
    );
  }

  // o jogador tem de estar registado no jogo
  const isRegistered = (game.registerPlayers || []).some((p: any) => String(p.playerId) === body.playerId);
  if (!isRegistered) {
    return NextResponse.json(
      { error: "player not registered in this game" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  // se enviaram deviceId, opcionalmente valida se pertence ao jogo
  let gameDeviceId: string | undefined = undefined;
  if (body.deviceId) {
    const gd = (game.gameDevices || []).find((d: any) => String(d.deviceId) === String(body.deviceId));
    if (!gd) {
      return NextResponse.json(
        { error: "device not assigned to this game" },
        { status: 400, headers: CORS_HEADERS }
      );
    }
    gameDeviceId = String(gd.id ?? gd.deviceId);
  }

  // monta o evento (compatível com a tua página de ranking/resultados)
  const event = {
    id: uuidv4(),
    type: body.type,                 // "kill" | "check" | "death"
    playerId: body.playerId,
    gameDeviceId,                    // opcional
    deviceId: body.deviceId,         // opcional (mantém também o deviceId "bruto")
    timestamp: body.timestamp ?? now,
  };

  game.gameResults = Array.isArray(game.gameResults) ? game.gameResults : [];
  game.gameResults.push(event as any);

  await game.save();

  return NextResponse.json({ ok: true, id: event.id }, { status: 201, headers: CORS_HEADERS });
}
