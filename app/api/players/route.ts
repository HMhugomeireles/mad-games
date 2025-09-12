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