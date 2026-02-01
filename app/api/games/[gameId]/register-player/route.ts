export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/lib/db/mongo";
import Game, { GameDoc } from "@/lib/db/models/game";
import Player from "@/lib/db/models/player";
import { isValidObjectId } from "mongoose";

const BodySchema = z.object({ 
  playerId: z.string().min(1)
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await params;
    await dbConnect();

    // 1. Parsing seguro do Body
    const json = await req.json().catch(() => null);
    if (!json) {
      return NextResponse.json({ error: "Invalid JSON or empty body" }, { status: 400 });
    }

    // 2. Validação Zod
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { playerId } = parsed.data;

    const player = await Player.findById(playerId).select("name").lean() as { _id: unknown; name: string } | null;
    
    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    const updateResult = await Game.updateOne(
      { 
        _id: gameId, 
        "assignedPlayers.playerId": { $ne: playerId }
      },
      {
        $push: {
          assignedPlayers: {
            playerId: String(player._id),
            playerName: player.name,
            isPresent: false
          }
        }
      }
    );


    if (updateResult.modifiedCount > 0) {
      return NextResponse.json({ ok: true, message: "Player registered" }, { status: 200 });
    }

    const gameExists = await Game.exists({ _id: gameId });

    if (!gameExists) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    } else {
      return NextResponse.json({ error: "Player already registered" }, { status: 409 });
    }

  } catch (error: any) {
    console.error("[register-player] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request, 
  ctx: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await ctx.params;

    const url = new URL(req.url);
    const playerId = url.searchParams.get("playerId");

    if (!playerId) {
      return NextResponse.json(
        { error: "Need pass playerId." }, 
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
      { $pull: { assignedPlayers: { playerId: playerId } } }
    );

    // 5. Verificar o resultado da operação
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Something goes wrong." }, { status: 404 });
    }

    return NextResponse.json({ 
      ok: true, 
      message: "Player removed successfully." 
    }, { status: 200 });

  } catch (error) {
    console.error("Error removing player:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." }, 
      { status: 500 }
    );
  }
}


export async function PUT(
  req: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await params;
    await dbConnect();

    // 1. Parsing seguro do Body
    const json = await req.json().catch(() => null);
    if (!json) {
      return NextResponse.json({ error: "Invalid JSON or empty body" }, { status: 400 });
    }

    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { playerId } = parsed.data;

    const player = await Player.findById(playerId).lean();
    const gameExists = await Game.exists({ _id: gameId });

    if (!gameExists) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }
    
    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    const game = await Game.findOne(
      { _id: gameId, "assignedPlayers.playerId": playerId }
    ).lean() as GameDoc | null;

    if (!game) {
      return NextResponse.json({ error: "Player not assigned to this game" }, { status: 404 });
    }

    const assignedPlayer = game.assignedPlayers.find(ap => ap.playerId === playerId);
    const togglePlayerPresent = !assignedPlayer?.isPresent;

    const updateResult = await Game.updateOne(
      { 
        _id: gameId, 
        "assignedPlayers.playerId": playerId
      },
      {
        $set: {
          "assignedPlayers.$.isPresent": togglePlayerPresent
        }
      }
    );


    if (updateResult.modifiedCount > 0) {
      return NextResponse.json({ ok: true, message: "Player registered" }, { status: 200 });
    }

    return NextResponse.json({ error: "No changes made." }, { status: 200 });

  } catch (error: any) {
    console.error("[updated-player] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}