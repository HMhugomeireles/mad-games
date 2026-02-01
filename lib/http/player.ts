import { PlayerDoc } from "../db/models/player";


export const fetchPlayers = async (): Promise<PlayerDoc[]> => {
  const res = await fetch("/api/players");
  if (!res.ok) throw new Error("Erro ao buscar jogadores");
  const json = await res.json();
  return json.data || json;
};
