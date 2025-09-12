import { NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/lib/db/mongo";
import FieldMap from "@/lib/db/models/field-map";

const SocialLink = z.object({
  platform: z.string().trim().min(1),
  url: z.string().trim().url(),
});

const PatchSchema = z.object({
  fieldMap: z.string().trim().min(1).optional(),
  isActive: z.boolean().optional(),
  type: z.enum(["cqb", "misto", "mato", "other"]).optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  socialLinks: z.array(SocialLink).optional(),
  createdBy: z.string().optional(),
});

export const runtime = "nodejs";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await dbConnect();
  const json = await req.json();
  const parsed = PatchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const doc = await FieldMap.findByIdAndUpdate(id, parsed.data, { new: true });
  if (!doc) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await dbConnect();
  const doc = await FieldMap.findByIdAndDelete(id);
  if (!doc) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
