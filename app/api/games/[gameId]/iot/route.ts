import Device from "@/lib/db/models/device";
import Game from "@/lib/db/models/game";
import Player from "@/lib/db/models/player";
import { dbConnect } from "@/lib/db/mongo";
import { NextResponse } from "next/server";


export async function organizeGameData(gameId: string) {
  const data = (await Game.find({ _id: gameId }).lean())[0];
  const { gameSettings, registerPlayers, gameDevices } = data;


  const playerIds = registerPlayers.map((p: { playerId: string; groupId: string }) => p.playerId);

  const deviceIds = gameDevices.map((d: { deviceId: string; assignedPlayerId: string | null; type: string; deviceStatus: string }) => d.deviceId).filter(Boolean);

  const [dbPlayers, dbDevices] = await Promise.all([
    Player.find({ _id: { $in: playerIds } })
      .select("name")
      .lean(),
    Device.find({ _id: { $in: deviceIds } })
      .select("name macAddress type")
      .lean(),
  ]);

  const playerMap = new Map(
    dbPlayers.map((p) => [String(p._id), p])
  );

  // Mapa: DeviceID -> Objeto Device
  const deviceRealMap = new Map(
    dbDevices.map((d) => [String(d._id), d])
  );

  // Mapa auxiliar: PlayerID -> GroupID (vindo do JSON do jogo)
  const playerGroupMap = new Map<string, string>();
  registerPlayers.forEach((reg: { playerId: string; groupId: string }) => {
    playerGroupMap.set(reg.playerId, reg.groupId);
  });

  const result = gameSettings.groups.map((group: { id: string; groupName: string; groupColor: string }) => {
    // A. Filtrar devices que pertencem a jogadores deste grupo
    const groupNodes = gameDevices
      .filter((gameDevice: { deviceId: string; assignedPlayerId: string | null; type: string; deviceStatus: string }) => {
        // Se não tiver jogador, não pertence a "Team A" ou "Team B" neste contexto
        // (A menos que você tenha lógica para devices atribuídos diretamente ao time)
        if (!gameDevice.assignedPlayerId) return false;

        const groupId = playerGroupMap.get(gameDevice.assignedPlayerId);
        return groupId === group.id;
      })
      .map((gameDevice: { deviceId: string; assignedPlayerId: string | null; type: string; deviceStatus: string }) => {
        // Buscar dados reais no Maps que criamos
        const realDevice = deviceRealMap.get(gameDevice.deviceId);
        const realPlayer = playerMap.get(gameDevice.assignedPlayerId!);

        return {
          deviceId: gameDevice.deviceId,
          // Prioridade: Dado do banco > Dado do jogo > Placeholder
          macAddress: realDevice?.macAddress || "",
          deviceName: realDevice?.name || `Device ${gameDevice.type}`,
          deviceType: realDevice?.type || gameDevice.type,
          deviceStatus: gameDevice.deviceStatus,
          playerId: gameDevice.assignedPlayerId || "",
          playerName: realPlayer?.name || "Jogador Desconhecido",
        };
      });

    // B. Retornar estrutura do Time
    return {
      deviceId: "", // Time não tem device físico associado diretamente aqui
      macAddress: "",
      deviceName: `${group.groupName} Base`, // Nó pai
      deviceType: "team_base",
      teamId: group.id,
      teamName: group.groupName,
      deviceNodes: groupNodes,
    };
  });

  return result;
}


export async function GET(req: Request, ctx: { params: Promise<{ gameId: string }> }) {
  try {
    await dbConnect();

    // Verifica se há query param ?filter=today|week (padrão: today)
    const { searchParams } = new URL(req.url);
    const filter = (searchParams.get("type") as "start-filter" || "start-filter");

    const { gameId } = await ctx.params;

    const result = await organizeGameData(gameId);

    return NextResponse.json({ success: true, count: result.length, data: result });
  } catch (err: any) {
    console.error("Erro ao buscar jogos:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Erro interno" },
      { status: 500 }
    );
  }
}