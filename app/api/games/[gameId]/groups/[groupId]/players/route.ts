import Game, { GameDoc } from "@/lib/db/models/game";
import { dbConnect } from "@/lib/db/mongo";
import { NextRequest, NextResponse } from "next/server";

interface AddPlayersBody {
  playerIds: string[];
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string; groupId: string }> }
) {
  try {
    await dbConnect();

    const { gameId, groupId } = await params;
    const body: AddPlayersBody = await req.json();
    const { playerIds } = body;

    if (!playerIds || playerIds.length === 0) {
      return NextResponse.json(
        { message: "Players not selected." },
        { status: 400 }
      );
    }

    const game: GameDoc | null = await Game.findById(gameId);

    if (!game) {
      return NextResponse.json({ message: "Game not found." }, { status: 404 });
    }

    const targetGroup = game.groupsNodes.find(
      (g: any) => g.groupId === groupId || g.id === groupId
    );

    if (!targetGroup) {
      return NextResponse.json(
        { message: "Group not found in this game." },
        { status: 404 }
      );
    }

    const gameDeviceGroup = game.assignedDevices
      .filter(device => device.group === targetGroup.group);

    const existingPlayerIds = new Set(targetGroup.nodes.map((n: any) => n.playerId));
    const usedDeviceIds = new Set(
      targetGroup.nodes.flatMap((n: any) => n.devices?.map((d: any) => d.deviceId.toString()) || [])
    );

    const availableDevices = gameDeviceGroup.filter((d: any) => !usedDeviceIds.has(d.id.toString()));

    const newNodes = playerIds
      // Filtra logo quem já está no grupo
      .filter(playerId => !existingPlayerIds.has(playerId))
      .map(playerId => {
        // Retira o próximo device da pilha (se houver)
        const device = availableDevices.shift();
        const playerInfo = game.assignedPlayers.find((p: any) => p.playerId.toString() === playerId);

        return {
          playerId,
          playerName: playerInfo?.playerName || "Unknown Player",
          playerType: "normal",
          playerPresence: false,
          devices: device ? [{
            deviceId: (device as any).deviceId.toString(),
            deviceName: (device as any).deviceName,
            deviceStatus: "offline",
            macAddress: device?.macAddress || "",
            isReturned: false
          }] : []
        };
      });

    // 5. Adicionar ao array de nodes do grupo
    if (newNodes.length > 0) {
      targetGroup.nodes.push(...newNodes);

      game.markModified('groupsNodes');

      await game.save();
    }

    return NextResponse.json(
      {
        message: "Jogadores adicionados com sucesso!",
        addedCount: newNodes.length
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Erro ao adicionar jogadores ao grupo:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor.", error: error.message },
      { status: 500 }
    );
  }
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string; groupId: string }> }
) {
  try {
    await dbConnect();

    const { gameId, groupId } = await params;
    
    // Ler o playerId dos Query Params (?playerId=...)
    const { searchParams } = new URL(req.url);
    const playerId = searchParams.get("playerId");

    if (!playerId) {
      return NextResponse.json(
        { message: "Player ID é obrigatório." },
        { status: 400 }
      );
    }

    // 1. Buscar o Jogo
    const game = await Game.findById(gameId);

    if (!game) {
      return NextResponse.json({ message: "Jogo não encontrado." }, { status: 404 });
    }

    // 2. Encontrar o Grupo
    const targetGroup = game.groupsNodes.find(
      (g: any) => g.groupId === groupId || g.id === groupId
    );

    if (!targetGroup) {
      return NextResponse.json(
        { message: "Grupo não encontrado." },
        { status: 404 }
      );
    }

    targetGroup.nodes = targetGroup.nodes.filter(
      (node: any) => node.playerId !== playerId
    );

    // 5. Informar o Mongoose da alteração e Guardar
    game.markModified("groupsNodes");
    await game.save();

    return NextResponse.json(
      { message: "Jogador removido do grupo com sucesso." },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Erro ao remover jogador do grupo:", error);
    return NextResponse.json(
      { message: "Erro interno.", error: error.message },
      { status: 500 }
    );
  }
}
