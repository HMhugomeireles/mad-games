export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { dbConnect } from "@/lib/db/mongo";
import Game, { GAME_MODES, GameStatus } from "@/lib/db/models/game";
import Device, { DeviceDoc } from "@/lib/db/models/device";


const PostBodySchema = z.object({
  name: z.string().min(1).trim(),
  type: z.enum(GAME_MODES),
  status: z.enum(GameStatus).default("planned"),
  date: z.coerce.date().optional(),
  fieldMapId: z.string().min(1),
});

export async function POST(req: Request) {
  await dbConnect();
  const json = await req.json();
  const parsed = PostBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  const gameDevices = await Device.find({ groupType: "respawn" }).lean() as unknown as DeviceDoc[];

  if (gameDevices.length < 2) {
    return NextResponse.json(
      { error: "At least two respawn game devices are required to create a game." },
      { status: 400 }
    );
  }

  const groups = gameDevices.map((device, index) => ({
    id: uuidv4(),
    groupName: `Group ${index + 1}`,
    groupColor: index === 0 ? "red" : "no-color",
    group: device.group,
  })); 

  const groupsNodes = groups.map(g => ({
    id: uuidv4(),
    groupId: g.id,
    groupName: g.groupName,
    groupColor: g.groupColor,
    group: g.group,
    nodes: [],
    respawnDevice: gameDevices
      .filter(device => device.group === g.group)
      .map(device => ({
        id: device._id,
        name: device.name,
        status: device.status,
        macAddress: device.mac,
      })).at(0),
  }));

  const created = await Game.create({
    ...data,
    gameSettings: {
      groups,
    },
    groupsNodes
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