export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { dbConnect } from "@/lib/db/mongo";
import Game from "@/lib/db/models/game";
import game from "@/lib/db/models/game";
import { id } from "zod/v4/locales";

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


function getDateRange(filter: "today" | "week") {
  const now = new Date();

  if (filter === "today") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  if (filter === "week") {
    const first = new Date(now);
    const day = now.getDay(); // 0 = domingo
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // segunda-feira como início
    first.setDate(diff);
    first.setHours(0, 0, 0, 0);

    const last = new Date(first);
    last.setDate(first.getDate() + 6);
    last.setHours(23, 59, 59, 999);

    return { start: first, end: last };
  }

  throw new Error("Filtro inválido");
}

export async function GET(req: Request) {
  try {
    await dbConnect();

    // Verifica se há query param ?filter=today|week (padrão: today)
    const { searchParams } = new URL(req.url);
    const filter = (searchParams.get("filter") as "today" | "week") || "today";
    const { start, end } = getDateRange(filter);

    const games = (await Game.find({
      status: "planned",
      date: { $gte: start, $lte: end },
    })
      .sort({ date: 1 })
      .lean())
      .map(game => ({
        id: game._id,
        name: game.name,
        status: game.status,
        type: game.type,
        date: game.date ? game.date.toISOString() : null,
      }));

    return NextResponse.json({ success: true, count: games.length, data: games });
  } catch (err: any) {
    console.error("Erro ao buscar jogos:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Erro interno" },
      { status: 500 }
    );
  }
}