export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/lib/db/mongo";
import Device, { DeviceDoc } from "@/lib/db/models/device";
import { normalizeMac } from "@/lib/utils";

const TYPE_OPTIONS = ["eletronic", "bracelet"] as const;

const BodySchema = z.object({
  name: z.string().min(1).trim(),
  mac: z
    .string()
    .optional()
    .transform((v) => (v ? v.toLowerCase().replace(/[^a-f0-9]/g, "") : v))
    .refine((v) => !v || /^[a-f0-9]{12}$/.test(v), { message: "MAC inválido" }),
  description: z.string().trim().optional(),
  type: z.enum(TYPE_OPTIONS),
});

export async function GET() {
  await dbConnect();
  const rows = await Device.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  await dbConnect();
  const json = await req.json();
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const created = await Device.create(parsed.data);
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    if (err?.code === 11000) {
      return NextResponse.json({ error: "Duplicado (índice único)", keyValue: err.keyValue }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
};

const Body = z.object({
  mac: z.string(),
  status: z.enum(["online", "offline"]),
});

let macNorm: string | undefined;

export async function PATCH(req: Request) {
  try {
    await dbConnect();

    const json = await req.json().catch(() => ({}));
    const parsed = Body.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400, headers: CORS });
    }

    const { mac, status } = parsed.data;
    const raw = mac ?? status;
    if (!raw) {
      return NextResponse.json({ error: "Campo 'mac' é obrigatório" }, { status: 400, headers: CORS });
    }

    const macNorm = normalizeMac(raw);
    if (!/^[a-f0-9]{12}$/.test(macNorm)) {
      return NextResponse.json({ error: "MAC inválido: use 12 hex (com ou sem separadores)" }, { status: 400, headers: CORS });
    }

    const doc = await Device.findOneAndUpdate(
      { mac: macNorm },
      { $set: { status: status } },
      { new: true }
    ).lean();

    if (!doc) {
      return Response.json(
        { error: "Device não encontrado para este MAC." },
        { status: 404, headers: CORS }
      );
    }

    return Response.json(
      { deviceId: String((doc as any)._id ?? (doc as any).id) },
      { status: 200, headers: CORS }
    );
  } catch (e: any) {
    // conflito raro de índice único: tenta ler novamente
    console.error("PATCH /api/devices erro:", e);
    if (e?.code === 11000) {
      const existing = await Device.findOne({ mac: macNorm }).lean();
      if (existing) {
        const id = String((existing as any).id ?? (existing as any)._id);
        return NextResponse.json({ id }, { status: 200, headers: CORS });
      }
    }
    return NextResponse.json({ error: e?.message || "Erro interno" }, { status: 500, headers: CORS });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

