export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/lib/db/mongo";
import Device, { DeviceDoc, STATUS_OPTIONS, VARIANTS_OPTIONS } from "@/lib/db/models/device";
import { normalizeMac } from "@/lib/utils";
import { isValidObjectId } from "mongoose";


export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const filter = searchParams.get("type");

    await dbConnect();

    const query = filter ? { groupType: filter } : {};

    const rows = await Device.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Erro ao buscar devices:", error);
    return NextResponse.json(
      { message: "Erro ao buscar dispositivos." },
      { status: 500 }
    )
  }
}

const PostSchema = z.object({
  name: z.string().min(1).trim(),
  mac: z
    .string()
    .optional()
    .transform((v) => (v ? v.toLowerCase().replace(/[^a-f0-9]/g, "") : v))
    .refine((v) => !v || /^[a-f0-9]{12}$/.test(v), { message: "MAC inválido" }),
  description: z.string().trim().optional(),
  variant: z.enum(VARIANTS_OPTIONS).default("electronic"),
});

export async function POST(req: Request) {
  try {
    await dbConnect();

    const json = await req.json().catch(() => null);

    if (!json) {
      return NextResponse.json(
        { success: false, error: "Body invalid" },
        { status: 400 }
      );
    }

    const parsed = PostSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Data validation error",
          details: parsed.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const created = await Device.create(parsed.data);

    return NextResponse.json(
      { success: true, data: created },
      { status: 201 }
    );

  } catch (err: any) {
    if (err.code === 11000) {
      // Tenta extrair o nome do campo duplicado (ex: "macAddress")
      const field = Object.keys(err.keyPattern)[0] || "campo";

      return NextResponse.json(
        {
          success: false,
          error: `This mac '${field}' already exists in the system.`,
          field: field
        },
        { status: 409 } // Conflict
      );
    }

    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val: any) => val.message);
      return NextResponse.json(
        { success: false, error: "Validation error", details: messages },
        { status: 400 }
      );
    }


    console.error("POST /api/devices error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

const PatchSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
  mac: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  variant: z.string().optional(),
  status: z.enum(STATUS_OPTIONS).optional(),
});

export async function PATCH(req: Request) {
  try {
    await dbConnect();

    const json = await req.json().catch(() => null);
    if (!json) {
      return NextResponse.json({ error: "Body inválido ou vazio" }, { status: 400 });
    }

    const parsed = PatchSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { id, mac, name, description, variant, status } = parsed.data;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Formato de ID inválido" }, { status: 400 });
    }

    const updateFields: Record<string, any> = {};

    if (name !== undefined) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (variant !== undefined) updateFields.variant = variant;
    if (status !== undefined) updateFields.status = status;

    if (mac) {
      const macNorm = normalizeMac(mac);
      if (macNorm.length !== 12) {
        return NextResponse.json({ error: "MAC inválido (deve ter 12 hex)" }, { status: 400 });
      }
      updateFields.mac = macNorm;
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ message: "Nenhum dado novo enviado para atualizar." }, { status: 400 });
    }

    // 4. Executar Update por ID
    const updatedDevice = await Device.findByIdAndUpdate(
      id,                  // Busca pelo _id
      { $set: updateFields },
      { new: true, runValidators: true } // Retorna o novo doc e valida enum/tipos
    ).lean();

    if (!updatedDevice) {
      return NextResponse.json(
        { error: "Device não encontrado com esse ID" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, device: updatedDevice },
      { status: 200 }
    );

  } catch (e: any) {
    console.error("PATCH /api/devices error:", e);

    // Erro de duplicidade (ex: tentar mudar o MAC para um que já existe noutro ID)
    if (e.code === 11000) {
      return NextResponse.json(
        { error: "Conflito: O valor do campo 'mac' (ou outro único) já está em uso por outro dispositivo." },
        { status: 409 }
      );
    }

    // Erro de Cast (ID mal formado) caso não tenhamos usado isValidObjectId em cima
    if (e.name === 'CastError') {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Erro interno do servidor", details: e.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

