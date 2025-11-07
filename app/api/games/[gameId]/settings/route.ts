export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { dbConnect } from "@/lib/db/mongo";
import Game from "@//lib/db/models/game";

const COLOR_OPTIONS = ["red","blue","green","yellow","purple","orange","no-color"] as const;
const RESPAWN_TYPES = ["players-number", "time", "other"] as const;


const GroupSchema = z.object({
  id: z.string().optional(),
  groupName: z.string().min(1).trim(),
  groupColor:  z.enum(COLOR_OPTIONS).or(z.string().min(1).trim()),
});

const numberOpt = z
  .union([z.string(), z.number()])
  .optional()
  .transform((v) => (v === undefined || v === null || v === "" ? undefined : Number(v)))
  .refine((v) => v === undefined || (!Number.isNaN(v) && v >= 0), "Valor inválido");

const BodySchema = z.object({
 groups: z.array(GroupSchema).default([
    { groupName: "Group 1", groupColor: "red" },
    { groupName: "Group 2", groupColor: "no-color" },
  ]),
  maxplayers: numberOpt,
  deadWaitTimeSeconds: numberOpt,
  respawnTimeSeconds: numberOpt,
  respawnType: z.enum(RESPAWN_TYPES).optional(),
  respawnMaxPlayers: numberOpt,
});

export async function GET(_req: Request, ctx: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await ctx.params; // Next 15
  await dbConnect();
  const game = await Game.findById(gameId).lean();
  if (!game) return NextResponse.json({ error: "game not found" }, { status: 404 });
  const groups = (game as any).gameSettings?.groups || [];
  return NextResponse.json({ groups });
}

export async function PUT(req: Request, ctx: { params: Promise<{ gameId: string }> }) {
  try {
    await dbConnect();

    const raw = await req.json().catch(() => ({}));
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid body", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { gameId } = await ctx.params; 

    // Monta objeto gameSettings (apenas campos presentes)
    const data = parsed.data;
    const gameSettings: Record<string, any> = {};
    if (data.groups) gameSettings.groups = data.groups;
    if (data.maxplayers !== undefined) gameSettings.maxplayers = data.maxplayers;
    if (data.deadWaitTimeSeconds !== undefined)
      gameSettings.deadWaitTimeSeconds = data.deadWaitTimeSeconds;
    if (data.respawnTimeSeconds !== undefined)
      gameSettings.respawnTimeSeconds = data.respawnTimeSeconds;
    if (data.respawnType !== undefined) gameSettings.respawnType = data.respawnType;
    if (data.respawnMaxPlayers !== undefined)
      gameSettings.respawnMaxPlayers = data.respawnMaxPlayers;

    const updated = await Game.findByIdAndUpdate(
      gameId,
      {
        $set: {
          gameSettings,
          updatedAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    ).lean() as unknown as { gameSettings?: any } | null;

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Game not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated.gameSettings ?? {} });
  } catch (err: any) {
    console.error("PUT /api/games/[id]/settings error:", err);
    return NextResponse.json(
      { success: false, message: err.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}