export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { dbConnect } from "@/lib/db/mongo";
import Game from "@/lib/db/models/game";

const BodySchema = z.object({
    deviceId: z.string().min(1),
});


const CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
};

export async function POST(req: Request) {
    await dbConnect();
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400, headers: CORS });
    }

    const { deviceId } = parsed.data as z.infer<typeof BodySchema>;

    if (!deviceId) {
        return Response.json({ error: "Falta deviceId" }, { status: 400, headers: CORS });
    }

    // Query: jogos em planned com gameDevices contendo deviceId
    const games = await Game.find({
        status: "planned",
        "gameDevices.deviceId": deviceId,
    })
        .lean()
        .exec();

    // devolve só os campos que te interessam
    const result = games.map((g: any) => {
        const gd = g.gameDevices.find((d: any) => d.deviceId === deviceId);
        return {
            gameId: String(g._id),
            assignedPlayerId: gd?.assignedPlayerId ?? null,
        };
    });

    return Response.json(
        result,
        { status: 200, headers: CORS }
    );
}