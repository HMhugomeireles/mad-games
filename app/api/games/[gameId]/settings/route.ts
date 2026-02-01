export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/lib/db/mongo";
import Game from "@//lib/db/models/game";
import { v4 as uuidv4 } from "uuid";

const COLOR_OPTIONS = ["red", "blue", "green", "yellow", "purple", "orange", "no-color"] as const;
const RESPAWN_TYPES = ["players-number", "time", "other"] as const;




export async function GET(_req: Request, ctx: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await ctx.params; // Next 15
  await dbConnect();
  const game = await Game.findById(gameId).lean();
  if (!game) return NextResponse.json({ error: "game not found" }, { status: 404 });
  const groups = (game as any).gameSettings?.groups || [];
  return NextResponse.json({ groups });
}


const GroupSchema = z.object({
  groupId: z.string().optional(),
  groupName: z.string().min(1).trim(),
  groupColor: z.enum(COLOR_OPTIONS).or(z.string().min(1).trim()),
  respawnDevice: z.object({
    id: z.string().optional(),
    name: z.string().trim().optional(),
    macAddress: z.string().trim().optional(),
  }).optional(),
  baseDevice: z.object({
    id: z.string().optional(),
    name: z.string().trim().optional(),
    macAddress: z.string().trim().optional(),
  }).optional(),
});

const BodySchema = z.object({
  groups: z.array(GroupSchema).optional(),
  maxplayers: z.string().or(z.number()).optional(),
  deadWaitTimeSeconds: z.string().or(z.number()).optional(),
  respawnTimeSeconds: z.string().or(z.number()).optional(),
  respawnType: z.enum(RESPAWN_TYPES).optional(),
  respawnMaxPlayers: z.string().or(z.number()).optional(),
});

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
    if (data.groups) gameSettings.groups = data.groups.map((group) => ({
      groupName: group.groupName,
      groupColor: group.groupColor,
    }));
    if (data.maxplayers !== undefined) gameSettings.maxplayers = data.maxplayers;
    if (data.deadWaitTimeSeconds !== undefined)
      gameSettings.deadWaitTimeSeconds = data.deadWaitTimeSeconds;
    if (data.respawnTimeSeconds !== undefined)
      gameSettings.respawnTimeSeconds = data.respawnTimeSeconds;
    if (data.respawnType !== undefined) gameSettings.respawnType = data.respawnType;
    if (data.respawnMaxPlayers !== undefined)
      gameSettings.respawnMaxPlayers = data.respawnMaxPlayers;

    const groupNodes = data.groups?.map((group: any) => ({
      id: uuidv4(),
      groupId: group.groupId,
      groupName: group.groupName,
      groupColor: group.groupColor,
      respawnDevice: group.respawnDevice,
      baseDevice: group.baseDevice,
    })) || []

    const updated = await Game.findByIdAndUpdate(
      gameId,
      {
        $set: {
          gameSettings,
          groupsNodes: groupNodes,
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