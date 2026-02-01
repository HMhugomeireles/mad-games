'use client';

import React from 'react';

// --- DADOS FICTÍCIOS (MOCK DATA) ---
// Função para gerar dados aleatórios
interface Player {
  id: number;
  name: string;
  level: number;
  kills: number;
  deaths: number;
  assists: number;
  score: number;
  ratio: string;
  ping: number;
  isMe: boolean;
}

const generatePlayer = (id: number, name: string, isMe: boolean = false, ping: number = 25): Player => ({
  id, name, level: 94, kills: 26, deaths: 2, assists: 45, score: 1950, ratio: "9.00", ping, isMe
});

const teamAlpha = [
  generatePlayer(1, "UnnknOwn1", false, 25),
  generatePlayer(2, "UnnknOwn1", true, 25), // Este é o jogador atual (Orange Highlight)
  generatePlayer(3, "UnnknOwn1", false, 25),
  generatePlayer(4, "UnnknOwn1", false, 70),
  generatePlayer(5, "UnnknOwn1", false, 25),
  generatePlayer(6, "UnnknOwn1", false, 25),
];

const teamBravo = [
  generatePlayer(7, "UnnknOwn1", false, 25),
  generatePlayer(8, "UnnknOwn1", false, 25),
  generatePlayer(9, "UnnknOwn1", false, 120),
  generatePlayer(10, "UnnknOwn1", false, 25),
  generatePlayer(11, "UnnknOwn1", false, 25),
  generatePlayer(12, "UnnknOwn1", false, 25),
];

// Componente de Linha (Row) Reutilizável
const ScoreRow = ({ player, teamColorClass }: { player: any; teamColorClass?: string }) => {
  // Determina cor do ping
  const pingClass = player.ping < 50 ? 'ping-good' : player.ping < 100 ? 'ping-med' : 'ping-bad';

  return (
    <div className={`
      relative grid grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-2 items-center px-4 py-1 text-sm border-b border-white/5
      ${player.isMe ? 'z-10' : ''} /* Traz a linha selecionada para a frente */
      hover:bg-white/5 transition-colors
    `}>
      {/* Highlight do Jogador Atual (Borda Laranja) */}
      {player.isMe && (
        <div className="absolute inset-0 border border-bullet-accent pointer-events-none shadow-[inset_0_0_10px_rgba(217,119,6,0.2)]"></div>
      )}

      {/* Nome e Nível */}
      <div className="flex items-center gap-3">
        <span className="text-bullet-muted text-xs font-bold w-6 text-right">{player.level}</span>
        <span className={`${player.isMe ? 'text-white font-bold' : 'text-bullet-text'}`}>{player.name}</span>
      </div>

      {/* Stats (Usamos tabular nums para alinhar) */}
      <div className="text-center tabular">{player.kills}</div>
      <div className="text-center tabular text-red-400/80">{player.deaths}</div>
      <div className="text-center tabular">{player.assists}</div>
      <div className="text-center tabular font-bold text-yellow-500/90">{player.score}</div>
      <div className="text-center tabular text-xs text-bullet-muted">{player.ratio}</div>
      
      {/* Ping Box */}
      <div className="flex justify-end">
        <div className={`w-10 text-center text-xs py-0.5 ${pingClass}`}>
          {player.ping}
        </div>
      </div>
    </div>
  );
};

export default function ScoreboardPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center font-mono">
      
      {/* --- BACKGROUND (Simulação de Jogo) --- */}
      {/* Na prática, isto seria transparente ou teria um backdrop-blur se o jogo estivesse por trás */}
      <div className="absolute inset-0 bg-gray-900 bg-[url('https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/mw2/meta/mw2-season-03-reveal-meta.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-bullet-dark/40 backdrop-blur-md"></div>
      </div>

      {/* --- SCOREBOARD CONTAINER --- */}
      <div className="relative z-20 w-full max-w-5xl bg-bullet-dark/90 shadow-2xl border border-white/10">
        
        {/* Header Global */}
        <div className="flex justify-between items-center px-4 py-3 bg-bullet-panel border-b border-white/10 text-xs uppercase tracking-widest text-bullet-muted">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">12:28</span>
            <span className="text-bullet-accent">DEATHMATCH</span>
            <span>: Mapname Here</span>
          </div>

          {/* Cabeçalhos das Colunas ( alinhados com o Grid das linhas ) */}
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] gap-2 w-[55%] text-center">
            <span>Kills</span>
            <span>Deaths</span>
            <span>Assists</span>
            <span>Score</span>
            <span>Ratio</span>
            <span className="text-right pr-2">Ping</span>
          </div>
        </div>

        {/* --- TEAM ALPHA (BLUE) --- */}
        <div className="bg-team-blue">
          {teamAlpha.map(player => (
            <ScoreRow key={player.id} player={player} />
          ))}
        </div>

        {/* Separador Visual (Barra Preta Fina) */}
        <div className="h-2 bg-black/50 w-full"></div>

        {/* --- TEAM BRAVO (RED) --- */}
        <div className="bg-team-red">
          {teamBravo.map(player => (
            <ScoreRow key={player.id} player={player} />
          ))}
        </div>

        {/* Footer info (Opcional, baseado no look FPS) */}
        <div className="bg-bullet-panel p-2 flex justify-between text-[10px] text-bullet-muted uppercase tracking-widest">
           <span>Server ID: 8392-1209-XF</span>
           <span>60% of Playlist</span>
        </div>
      </div>

      {/* --- HUD ELEMENTS (Círculos nos cantos inferiores da imagem) --- */}
      <div className="absolute bottom-12 left-12 w-24 h-24 rounded-full border-4 border-red-500/20 bg-black/60 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xs text-bullet-muted">HP</div>
          <div className="text-3xl font-bold text-white">100</div>
        </div>
         {/* Arco de vida simulado */}
        <div className="absolute inset-0 border-t-4 border-l-4 border-red-500 rounded-full rotate-45"></div>
      </div>

      <div className="absolute bottom-12 right-12 w-24 h-24 rounded-full border-4 border-yellow-500/20 bg-black/60 flex items-center justify-center">
        <div className="text-center">
           <div className="text-3xl font-bold text-white tabular">30/120</div>
           <div className="text-xs text-bullet-accent mt-1">AMMO</div>
        </div>
        {/* Arco de munição simulado */}
        <div className="absolute inset-0 border-r-4 border-b-4 border-bullet-accent rounded-full rotate-12"></div>
      </div>

    </div>
  );
}