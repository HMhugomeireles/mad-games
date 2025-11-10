export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/mongo";
import Game, { GameDoc } from "@/lib/db/models/game";


export async function DELETE(_req: Request, ctx: { params: Promise<{ gameId: string }> }) {
    const { gameId } = await ctx.params; // Next 15: params é Promise
    await dbConnect();


    const game = await Game.findByIdAndDelete(gameId);
    if (!game) return NextResponse.json({ error: "game not found" }, { status: 404 });


    return NextResponse.json({ ok: true });
}

export async function UPDATE(_req: Request, ctx: { params: Promise<{ gameId: string }> }) {
    const { gameId } = await ctx.params; // Next 15: params é Promise
    await dbConnect();
    
    const game = await Game.findByIdAndUpdate(gameId, { updatedAt: new Date().toISOString() });
    
    if (!game) return NextResponse.json({ error: "game not found" }, { status: 404 });

    game.set("updatedAt", new Date().toISOString(), { strict: false });
    await game.save();

    return NextResponse.json({ ok: true }); 
}


type Ctx = { params: { id: string } };

export async function GET(req: Request, ctx: Ctx) {
  try {
    await dbConnect();

    const { id } = await ctx.params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, message: "Game ID inválido" },
        { status: 400 }
      );
    }

    
    const game = await Game.findById(id).lean();

    if (!game) {
      return NextResponse.json(
        { success: false, message: "Game não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: game.at(0) || null,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("GET /api/games/[id] error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Erro interno" },
      { status: 500 }
    );
  }
}