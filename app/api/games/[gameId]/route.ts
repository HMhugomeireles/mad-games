export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/mongo";
import Game from "@/lib/db/models/game";


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