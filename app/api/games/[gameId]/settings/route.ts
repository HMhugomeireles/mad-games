export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { dbConnect } from "@/lib/db/mongo";
import Game from "@//lib/db/models/game";

const GroupSchema = z.object({
  id: z.string().optional(),
  groupName: z.string().min(1).trim(),
  groupColor: z.string().min(1).trim(),
});

const BodySchema = z.object({
  groups: z.array(GroupSchema).default([
    { groupName: "Group 1", groupColor: "red" },
    { groupName: "Group 2", groupColor: "no-color" },
  ]),
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
  const { gameId } = await ctx.params; // Next 15
  await dbConnect();

  const body = BodySchema.parse(await req.json());
  const game = await Game.findById(gameId);
  if (!game) return NextResponse.json({ error: "game not found" }, { status: 404 });

  const groups = (body.groups?.length ? body.groups : [
    { groupName: "Group 1", groupColor: "red" },
    { groupName: "Group 2", groupColor: "no-color" },
  ]).map((g) => ({
    id: g.id || uuidv4(),
    groupName: g.groupName.trim(),
    groupColor: g.groupColor.trim(),
  }));

  game.set("gameSettings.groups", groups, { strict: false });
  await game.save();

  return NextResponse.json({ ok: true, groups });
}