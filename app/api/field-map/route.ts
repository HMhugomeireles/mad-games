import { NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/lib/db/mongo";
import FieldMap from "@/lib/db/models/field-map";

const SocialLink = z.object({
  platform: z.string().trim().min(1),
  url: z.string().trim().url(),
});

const BodySchema = z.object({
  fieldMap: z.string().trim().min(1, "Nome é obrigatório"),
  isActive: z.boolean().optional().default(true),
  type: z.enum(["cqb", "misto", "mato", "other"]).default("other"),
  description: z.string().optional().default(""),
  location: z.string().optional().default(""),
  socialLinks: z.array(SocialLink).optional().default([]),
  createdBy: z.string().optional(),
});

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filter = (searchParams.get("type") as string) || null;

  await dbConnect();
  const list = await FieldMap.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  await dbConnect();
  const json = await req.json();
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const created = await FieldMap.create(parsed.data);
  return NextResponse.json(created, { status: 201 });
}
