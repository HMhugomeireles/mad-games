import { GameDoc } from "@/lib/db/models/game";

export const fetchGameById = async (gameId: string): Promise<GameDoc> => {
  const res = await fetch(`/api/games/${gameId}`);
  if (!res.ok) throw new Error("Erro ao buscar jogo");
  const json = await res.json();
  return json.data || json;
};