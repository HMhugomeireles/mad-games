export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/lib/db/mongo";
import Player from "@/lib/db/models/player";

// Ajuste se quiser campos obrigatórios/optionais diferentes
const PlayerSchema = z.object({
  name: z.string().min(1, "name é obrigatório").trim(),
  apd: z
    .string()
    .trim()
    .transform((v) => v.toUpperCase().replace(/\s+/g, "")),
  apdValidateDate: z.coerce.date().optional(),
  team: z.string().trim().optional(),
});

export async function POST(req: Request) {
  await dbConnect();

  const body = await req.json();
  const arr = Array.isArray(body) ? body : [body];

  // valida todos antes de gravar
  const parsed = arr.map((item) => PlayerSchema.safeParse(item));
  const firstError = parsed.find((p) => !p.success);
  if (firstError && !firstError.success) {
    return NextResponse.json({ error: firstError.error.flatten() }, { status: 400 });
  }

  const docs = parsed.map((p) => (p as any).data);

  try {
    // insertMany aplica default/uuid em massa e é mais eficiente
    const created = await Player.insertMany(docs, { ordered: true });
    const json = created.map((d: any) => (d.toJSON ? d.toJSON() : d));

    return NextResponse.json(Array.isArray(body) ? json : json[0], { status: 201 });
  } catch (err: any) {
    // Duplicidade de índice único (ex.: apd)
    if (err?.code === 11000) {
      return NextResponse.json(
        { error: "Duplicado (índice único)", keyValue: err.keyValue },
        { status: 409 }
      );
    }
    console.error(err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    // 1. Conectar à BD
    await dbConnect();

    // 2. Ler apenas os filtros (sem page/limit)
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    const team = searchParams.get('team');

    // 3. Construir o filtro
    const filter: any = {};

    if (query) {
      // Pesquisa por nome (case insensitive)
      filter.name = { $regex: query, $options: 'i' };
    }

    if (team) {
      filter.team = team;
    }

    // 4. Buscar TODOS os registos correspondentes
    const players = await Player.find(filter)
      .sort({ name: 1 }) // Ordenar alfabeticamente (A-Z)
      .lean(); // .lean() é importante aqui: torna a query muito mais rápida ao retornar JSON puro

    // 5. Retornar a lista direta (Array)
    return NextResponse.json(players, { status: 200 });

  } catch (error) {
    console.error('Erro ao buscar players:', error);
    return NextResponse.json(
      { error: 'Erro ao carregar a lista de jogadores' },
      { status: 500 }
    );
  }
}