import { NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/lib/db/mongo";
import Device from "@/lib/db/models/device";

const PutSchema = z.object({
  name: z.string().trim().min(1),
  mac: z.string().trim().optional(),
  description: z.string().trim().optional(),
  type: z.enum(["eletronic", "bracelet"]),
  status: z.enum(["online", "offline"]),
}).strict();


export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const body = await req.json();
    const parsed = PutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid body", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { id } = await ctx.params;

    let mac: string | null | undefined = parsed.data.mac;
    if (typeof mac === "string") {
      mac = mac.trim();
      if (mac === "") mac = null;
      else if (/^[0-9a-f]{12}$/i.test(mac)) {
        mac = mac.match(/.{1,2}/g)!.join(":").toLowerCase();
      } else if (/^([0-9a-f]{2}:){5}[0-9a-f]{2}$/i.test(mac)) {
        mac = mac.toLowerCase();
      }
    }

    const update: any = {
      name: parsed.data.name.trim(),
      description: parsed.data.description?.trim() ?? "",
      type: parsed.data.type,
      status: parsed.data.status,
      updatedAt: new Date(),
    };

    if (mac === null) {
      // remover o campo mac quando vier vazio
      update.$unset = { mac: 1 };
    } else if (typeof mac === "string") {
      update.mac = mac;
    }

    const updated = await Device.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
      overwrite: false, // mantém campos não enviados
    }).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Device not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    // Mapeia duplicate key do índice único do mac para 409
    if (err?.code === 11000 && (err?.keyPattern?.mac || err?.keyValue?.mac)) {
      return NextResponse.json(
        { success: false, message: "MAC já existe noutro dispositivo" },
        { status: 409 }
      );
    }

    console.error("PUT /api/devices/[id] error:", err);
    return NextResponse.json(
      { success: false, message: err?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}

type Ctx = { params: { id: string } };

export async function DELETE(req: Request, ctx: Ctx) {
  try {
    await dbConnect();

    const { id } = await ctx.params;

    const deleted = await Device.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Device not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Device deleted", data: deleted },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("DELETE /api/devices/[id] error:", err);

    return NextResponse.json(
      { success: false, message: err?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}