import { dbConnect } from "@/lib/db/mongo";
import Game, { GameDoc } from "@/lib/db/models/game";
import { GameDashboard } from "./_components/GameDashboard";
import { notFound } from "next/navigation";
import Player from "@/lib/db/models/player";
import Device from "@/lib/db/models/device";

export default async function GameDetailsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  await dbConnect();

  // Como params é uma Promise no Next.js 15 (ou versões recentes assíncronas)
  const { id } = await params;

  // 1. Busca os dados
  const gameDoc = await Game.findById(id).lean();
  const playersList = await Player.find().lean();

  if (!gameDoc) {
    notFound(); // Mostra a página 404 automática do Next.js
  }

  const game = JSON.parse(JSON.stringify(gameDoc));
  const players = JSON.parse(JSON.stringify(playersList));

  return (
    <GameDashboard
      game={game}
      playersList={players}
    />
  );
}