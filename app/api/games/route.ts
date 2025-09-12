export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { dbConnect } from "@/lib/db/mongo";
import Game from "@/lib/db/models/game";

const GAME_MODES = [
  "domination",
  "kill-confirmed",
  "shield",
  "sensor-movement",
  "disarm",
  "extract",
  "avalanche",
] as const;

const STATUSES = ["planned", "in_progress", "completed", "cancelled"] as const;

const BodySchema = z.object({
  name: z.string().min(1).trim(),
  type: z.enum(GAME_MODES),
  status: z.enum(STATUSES).default("planned"),
  date: z.coerce.date().optional(),
  fieldMapId: z.string().min(1),
  gameSettings: z
    .object({
      groups: z
        .array(
          z.object({
            id: z.string().optional(),
            groupName: z.string().min(1),
            groupColor: z.string().min(1),
          })
        )
        .optional(),
    })
    .optional(),
});

export async function POST(req: Request) {
  await dbConnect();
  const json = await req.json();
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data as any;

  const DEFAULT_GROUPS = [
    { id: uuidv4(), groupName: "Group 1", groupColor: "red" },
    { id: uuidv4(), groupName: "Group 2", groupColor: "no-color" },
  ];

  const groups =
    data?.gameSettings?.groups && Array.isArray(data.gameSettings.groups) && data.gameSettings.groups.length > 0
      ? data.gameSettings.groups.map((g: any) => ({
          id: g.id || uuidv4(),
          groupName: String(g.groupName).trim(),
          groupColor: String(g.groupColor).trim(),
        }))
      : DEFAULT_GROUPS;

  const created = await Game.create({
    ...data,
    gameSettings: {
      ...(data.gameSettings || {}),
      groups,
    },
  });

  return NextResponse.json(created, { status: 201 });
}


