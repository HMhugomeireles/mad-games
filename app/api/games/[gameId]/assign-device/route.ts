export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/lib/db/mongo";
import Game from "@/lib/db/models/game";
import Device from "@/lib/db/models/device";
import { isValidObjectId } from "mongoose";
import { group } from "console";



const BodySchema = z.object({
  deviceId: z.string().min(1)
});

export async function POST(req: Request, { params }: { params: Promise<{ gameId: string }> }) {
  try {
    const { gameId } = await params;

    // 1. Parse do Body e Validação Zod num passo único
    const json = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { deviceId } = parsed.data;

    await dbConnect();
    const game = await Game.findById(gameId);

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const device = await Device.findById(deviceId).lean();

    if (!device || Array.isArray(device)) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    const updateResult = await Game.updateOne(
      {
        _id: gameId,
        "assignedDevices.deviceId": { $ne: deviceId }
      },
      {
        $push: {
          assignedDevices: {
            deviceId: device._id,
            deviceName: device.name,
            group: device.group || null,
            variant: device.variant
          }
        }
      }
    );


    if (updateResult.modifiedCount > 0) {
      return NextResponse.json({ ok: true, message: "Device registered" }, { status: 200 });
    }

    const gameExists = await Game.exists({ _id: gameId });

    if (!gameExists) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    } else {
      return NextResponse.json({ error: "Device already registered" }, { status: 409 });
    }

  } catch (err: any) {
    console.error("Assign Device Error:", err);
    return NextResponse.json({ error: "Erro interno", message: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request, 
  ctx: { params: Promise<{ gameId: string }> }
) {
  try {
    // 1. Aguardar params
    const { gameId } = await ctx.params;

    // 2. Extrair e validar deviceId
    const url = new URL(req.url);
    const deviceId = url.searchParams.get("deviceId");

    if (!deviceId) {
      return NextResponse.json(
        { error: "O parâmetro 'deviceId' é obrigatório." }, 
        { status: 400 }
      );
    }

    const isGameIdValid = await Game.exists({ _id: gameId });
    if (!isGameIdValid) {
      return NextResponse.json(
        { error: "Game not found." }, 
        { status: 404 }
      );
    }

    await dbConnect();

    const result = await Game.updateOne(
      { _id: gameId },
      { $pull: { assignedDevices: { deviceId: deviceId } } }
    );

    // 5. Verificar se o jogo existia
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Jogo não encontrado." }, { status: 404 });
    }

    // Sucesso
    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("Erro ao remover device:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar pedido." }, 
      { status: 500 }
    );
  }
}