'use client';

import { useState } from 'react';

// --- COMPONENTES AUXILIARES (UI) ---

// Badge de Status Tático
const StatusBadge = ({ status }: { status: string }) => {
  const styles = status === 'LIVE' 
    ? 'bg-red-500/10 text-red-500 border-red-500 animate-pulse' 
    : 'bg-bullet-muted/10 text-bullet-muted border-bullet-muted';
    
  return (
    <span className={`border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 w-fit ${styles}`}>
      {status === 'LIVE' && <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>}
      {status}
    </span>
  );
};

// --- COMPONENTE DE FILTRO ---
const FilterBar = ({ onSearch, onTypeFilter }: { onSearch: (term: string) => void; onTypeFilter: (type: string) => void }) => (
  <div className="bg-bullet-panel border border-white/5 p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
    
    {/* Search Input */}
    <div className="relative flex-1 w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-bullet-muted">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      </div>
      <input 
        type="text" 
        placeholder="SEARCH INTEL (EVENT, GAME, PLAYER...)" 
        onChange={(e) => onSearch(e.target.value)}
        className="w-full bg-black/30 border border-white/10 text-white text-xs p-3 pl-10 outline-none focus:border-bullet-accent transition-colors placeholder-bullet-muted font-mono uppercase tracking-wide"
      />
    </div>

    {/* Filtros Rápidos */}
    <div className="flex gap-2">
      {['ALL', 'LIVE', 'COMPLETED'].map(status => (
        <button 
          key={status}
          onClick={() => onTypeFilter(status)}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-transparent hover:border-bullet-muted text-[10px] text-bullet-text font-bold uppercase tracking-widest transition-all"
        >
          {status}
        </button>
      ))}
    </div>
  </div>
);

// --- TABELA DE CLASSIFICAÇÃO COM DETALHE DE JOGADOR ---
const LeaderboardTable = ({ rankings }: { rankings: any[] }) => {
  // Estado para expandir equipa e ver jogadores
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);

  const toggleTeam = (rank: number) => {
    setExpandedTeam(expandedTeam === rank ? null : rank);
  };

  return (
    <div className="w-full overflow-hidden border border-white/5 bg-black/20 mt-4">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-white/5 text-[10px] text-bullet-muted uppercase tracking-widest font-bold">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-8">Unit / Team</div>
        <div className="col-span-3 text-right">Action</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-white/5">
        {rankings.map((team: any, idx: number) => (
          <div key={idx} className="group">
            
            {/* Linha da Equipa */}
            <div 
              onClick={() => toggleTeam(team.rank)}
              className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-bullet-accent/5 cursor-pointer transition-colors"
            >
              <div className="col-span-1 flex justify-center">
                <span className={`
                  w-6 h-6 flex items-center justify-center font-bold text-xs
                  ${team.rank === 1 ? 'bg-bullet-accent text-bullet-dark' : 'bg-white/10 text-bullet-muted'}
                `}>
                  {team.rank}
                </span>
              </div>
              <div className="col-span-8 font-bold text-white tracking-wide group-hover:text-bullet-accent transition-colors">
                {team.team}
              </div>
              <div className="col-span-3 text-right">
                <span className="text-[10px] text-bullet-muted group-hover:text-white uppercase tracking-wider">
                  {expandedTeam === team.rank ? 'Close Intel [-]' : 'View Performance [+]'}
                </span>
              </div>
            </div>

            {/* Expansão: Estatísticas dos Jogadores */}
            {expandedTeam === team.rank && (
              <div className="bg-black/40 border-y border-bullet-accent/20 p-4 animate-in slide-in-from-top-2 duration-200">
                <h4 className="text-[10px] text-bullet-accent uppercase tracking-[0.2em] mb-3 border-l-2 border-bullet-accent pl-2">
                  Operator Performance
                </h4>
                
                <div className="grid grid-cols-4 gap-4 text-[10px] text-bullet-muted mb-2 px-2 uppercase tracking-wider">
                  <span>Operator</span>
                  <span>Role</span>
                  <span className="text-center">K/D/A</span>
                  <span className="text-right">Score</span>
                </div>

                <div className="space-y-1">
                  {team.players.map((player: any, pIdx: number) => (
                    <div key={pIdx} className="grid grid-cols-4 gap-4 px-2 py-2 bg-white/5 border-l-2 border-transparent hover:border-bullet-accent transition-colors">
                      <span className="text-white font-bold">{player.name}</span>
                      <span className="text-bullet-muted">{player.role}</span>
                      <span className="text-center font-mono text-white">{player.kda}</span>
                      <span className="text-right font-mono text-bullet-accent font-bold">{player.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- CARTÃO DE EVENTO EXPANSÍVEL ---
const EventItem = ({ event }: { event: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`
      border mb-6 transition-all duration-300
      ${isOpen ? 'border-bullet-accent bg-bullet-panel' : 'border-white/10 bg-bullet-panel/50 hover:border-white/30'}
    `}>
      
      {/* Cabeçalho do Evento (Sempre Visível) */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-4">
          {/* Data Box */}
          <div className="flex flex-col items-center justify-center w-16 h-16 bg-white/5 border border-white/10 text-bullet-muted">
            <span className="text-xs font-bold">{event.date.split('-')[2]}</span>
            <span className="text-[10px] uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-1">
              <StatusBadge status={event.status} />
              <span className="text-[10px] text-bullet-muted uppercase tracking-widest">
                ID: #{event.id.toString().padStart(4, '0')}
              </span>
            </div>
            <h3 className={`text-xl font-bold uppercase tracking-wide transition-colors ${isOpen ? 'text-bullet-accent' : 'text-white'}`}>
              {event.title}
            </h3>
            <div className="flex gap-2 text-xs text-bullet-muted mt-1">
               <span>Games:</span>
               {event.games.map((g: any) => (
                 <span key={g.id} className="text-white bg-white/10 px-1">{g.title}</span>
               ))}
            </div>
          </div>
        </div>

        {/* Action Icon */}
        <div className="text-bullet-accent">
          {isOpen ? (
            <span className="text-xs font-bold uppercase tracking-widest">[ COLLAPSE INTEL ]</span>
          ) : (
            <span className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100">[ VIEW REPORT ]</span>
          )}
        </div>
      </div>

      {/* Detalhes (Jogos e Rankings) */}
      {isOpen && (
        <div className="border-t border-white/10 p-6 bg-black/20">
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {event.games.map((game: any) => (
              <div key={game.id} className="flex flex-col">
                
                {/* Cabeçalho do Jogo */}
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-bold uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1 h-4 bg-bullet-accent"></span>
                    {game.title}
                  </h4>
                  <span className="text-[10px] text-bullet-muted uppercase">{game.mode}</span>
                </div>

                {/* Tabela de Classificação deste Jogo */}
                <LeaderboardTable rankings={game.rankings} />
                
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

// --- PÁGINA PRINCIPAL ---
export default function EventsPage() {
  const [viewMode, setViewMode] = useState('list'); // 'list' ou 'grid'
  const [expandedId, setExpandedId] = useState<number | null>(null); // ID do evento aberto
  const [searchTerm, setSearchTerm] = useState('');

  // Função para abrir/fechar
  const handleToggle = (id: number) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="bg-bullet-dark font-mono text-bullet-text pb-20">
      
      {/* Header */}
      <header className="bg-bullet-panel border-b border-white/10 py-12 px-8 mb-8">
        <div className="max-w-[1600px] mx-auto">
          <h1 className="text-4xl text-white font-normal uppercase tracking-wide mb-2">
            Operations Log
          </h1>
          <p className="text-bullet-muted text-sm tracking-widest">
            Tactical Overview of all competitive events.
          </p>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-8">
        
        {/* Barra de Ferramentas */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-end">
          
          {/* Search (Simplificado para o exemplo) */}
          <div className="w-full md:w-96">
             <input 
               type="text" 
               placeholder="SEARCH OPERATIONS..." 
               className="w-full bg-black/30 border border-white/10 text-white text-xs p-3 outline-none focus:border-bullet-accent"
             />
          </div>

          {/* Toggle de Visualização */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-bullet-muted uppercase tracking-widest">View Mode:</span>
            <ViewToggle mode={viewMode} onChange={setViewMode} />
          </div>
        </div>

        {/* --- GRID / LIST CONTAINER --- */}
        <div className={`
          transition-all duration-500 ease-in-out
          ${viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' // Grelha de 3 colunas
            : 'flex flex-col gap-4' // Lista vertical
          }
        `}>
          
          {/* Dados Simulados (Substituir pelos teus dados reais) */}
          {EVENTS_DB.map((event) => {
            
            const isExpanded = expandedId === event.id;

            // Lógica de Classe: Se estiver em Grid E expandido, ocupa tudo.
            const gridClass = viewMode === 'grid' 
              ? (isExpanded ? 'col-span-1 md:col-span-2 lg:col-span-3' : 'col-span-1') 
              : 'w-full';

            return (
              <div key={event.id} className={`${gridClass} transition-all duration-500 ease-in-out`}>
                
                {/* LÓGICA DE RENDERIZAÇÃO:
                   1. Se estiver expandido (em qualquer modo), mostra a Linha Completa (Detalhes).
                   2. Se for modo Lista, mostra a Linha (Compacta ou não).
                   3. Se for modo Grid E fechado, mostra o Card.
                */}
                
                {viewMode === 'list' || isExpanded ? (
                  <EventRowExpanded 
                    event={event} 
                    isOpen={isExpanded} 
                    onToggle={() => handleToggle(event.id)} 
                  />
                ) : (
                  <EventCardCompact 
                    event={event} 
                    onClick={() => handleToggle(event.id)} 
                  />
                )}

              </div>
            );
          })}

        </div>

      </main>
    </div>
  );
}


const EVENTS_DB = [
  {
    id: 1,
    title: "OPERATION: DARK FALL",
    date: "2023-10-26",
    status: "LIVE",
    games: [
      {
        id: "g1",
        title: "Modern Warfare II",
        mode: "Search & Destroy",
        rankings: [
          { 
            rank: 1, 
            team: "Alpha Squad", 
            players: [
              { name: "Ghost", kda: "24/5/10", score: 4500, role: "Slayer" },
              { name: "Soap", kda: "18/12/5", score: 3200, role: "Support" }
            ]
          },
          { 
            rank: 2, 
            team: "Bravo Six", 
            players: [
              { name: "Price", kda: "20/10/8", score: 4100, role: "IGL" },
              { name: "Gaz", kda: "15/15/4", score: 2900, role: "Entry" }
            ]
          }
        ]
      },
      {
        id: "g2",
        title: "Valorant",
        mode: "Grand Finals",
        rankings: [
          { 
            rank: 1, 
            team: "Team Liquid", 
            players: [
              { name: "Jamppi", kda: "19/12/4", score: 280, role: "Duelist" },
              { name: "Nats", kda: "22/8/2", score: 310, role: "Sentinel" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "TACTICAL TUESDAY",
    date: "2023-10-24",
    status: "COMPLETED",
    games: [
      {
        id: "g3",
        title: "Counter-Strike 2",
        mode: "Wingman Tournament",
        rankings: [
          { 
            rank: 1, 
            team: "Navi Junior", 
            players: [
              { name: "S1mple_Jr", kda: "30/2/5", score: 160, role: "AWP" }
            ]
          }
        ]
      }
    ]
  }
];


// 3. O Cartão/Linha Expandido (Vista Detalhada)
const EventRowExpanded = ({ event, isOpen, onToggle }: { event: any; isOpen: boolean; onToggle: () => void }) => {
  return (
    <div className={`
      w-full border transition-all duration-300 overflow-hidden
      ${isOpen ? 'border-bullet-accent bg-bullet-panel shadow-[0_0_20px_rgba(0,0,0,0.5)]' : 'border-white/10 bg-bullet-panel/50 hover:border-white/30'}
    `}>
      
      {/* Cabeçalho da Linha (Sempre visível em List Mode, ou topo do Card Expandido) */}
      <div 
        onClick={onToggle}
        className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center justify-center w-16 h-16 bg-white/5 border border-white/10 text-bullet-muted">
            <span className="text-xs font-bold">{event.date.split('-')[2]}</span>
            <span className="text-[10px] uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border ${event.status === 'LIVE' ? 'border-red-500 text-red-500' : 'border-bullet-muted text-bullet-muted'}`}>
                 {event.status}
              </span>
              <span className="text-[10px] text-bullet-muted uppercase tracking-widest">
                ID: #{event.id}
              </span>
            </div>
            <h3 className={`text-xl font-bold uppercase tracking-wide transition-colors ${isOpen ? 'text-bullet-accent' : 'text-white'}`}>
              {event.title}
            </h3>
            <div className="flex gap-2 text-xs text-bullet-muted mt-1">
               <span>Games Included:</span>
               {event.games.map((g: any) => (
                 <span key={g.id} className="text-white bg-white/10 px-1">{g.title}</span>
               ))}
            </div>
          </div>
        </div>

        <div className="text-bullet-accent">
          {isOpen ? (
            <span className="text-xs font-bold uppercase tracking-widest">[ CLOSE INTEL ]</span>
          ) : (
            <span className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100">[ VIEW REPORT ]</span>
          )}
        </div>
      </div>

      {/* DETALHES (Só renderiza se isOpen) */}
      {isOpen && (
        <div className="border-t border-white/10 p-6 bg-black/20 animate-in fade-in duration-300">
           {/* Aqui inseres o componente LeaderboardTable do exemplo anterior */}
           <div className="p-4 border border-dashed border-white/20 text-center text-bullet-muted text-xs uppercase tracking-widest">
              Detailed Match Report Loaded... (Inserir Tabelas Aqui)
           </div>
        </div>
      )}
    </div>
  );
};

// 1. Toggle de Visualização (Ícones Lista vs Grid)
const ViewToggle = ({ mode, onChange }: { mode: string; onChange: (mode: string) => void }) => (
  <div className="flex bg-black/40 border border-white/10 p-1 gap-1">
    <button
      onClick={() => onChange('list')}
      className={`p-2 transition-all ${mode === 'list' ? 'bg-bullet-accent text-bullet-dark' : 'text-bullet-muted hover:text-white'}`}
      title="List View"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
    </button>
    <button
      onClick={() => onChange('grid')}
      className={`p-2 transition-all ${mode === 'grid' ? 'bg-bullet-accent text-bullet-dark' : 'text-bullet-muted hover:text-white'}`}
      title="Grid View"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
    </button>
  </div>
);

// 2. O Cartão Compacto (Para a Grid View - Estado Fechado)
const EventCardCompact = ({ event, onClick }: { event: any; onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="group h-full bg-bullet-panel border border-white/10 hover:border-bullet-accent/50 cursor-pointer flex flex-col transition-all duration-300 hover:-translate-y-1"
  >
    {/* Imagem / Topo */}
    <div className="relative h-32 w-full overflow-hidden bg-black/50 border-b border-white/5">
       {/* Placeholder de Imagem */}
       <div className="absolute inset-0 bg-cover bg-center opacity-60 grayscale group-hover:grayscale-0 transition-all" 
            style={{ backgroundImage: `url('https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/mw2/meta/mw2-season-03-reveal-meta.jpg')` }}></div>
       <div className="absolute top-2 right-2">
         {/* Reutilizando o StatusBadge do código anterior */}
         <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${event.status === 'LIVE' ? 'bg-red-500 text-white animate-pulse' : 'bg-black/80 text-bullet-muted'}`}>
            {event.status}
         </span>
       </div>
    </div>

    {/* Conteúdo */}
    <div className="p-4 flex flex-col flex-1">
      <div className="flex items-center gap-2 mb-2">
         <div className="w-8 h-8 flex flex-col items-center justify-center border border-white/10 bg-white/5 text-bullet-muted">
            <span className="text-[10px] font-bold">{event.date.split('-')[2]}</span>
            <span className="text-[8px] uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
         </div>
         <div className="text-[10px] text-bullet-muted uppercase tracking-widest">#{event.id}</div>
      </div>

      <h3 className="text-lg font-bold text-white uppercase tracking-wide leading-tight mb-4 group-hover:text-bullet-accent transition-colors">
        {event.title}
      </h3>

      <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-3">
         <div className="flex -space-x-2">
           {/* Ícones falsos de jogos */}
           {event.games.map((g: any) => (
             <div key={g.id} className="w-6 h-6 rounded-full bg-bullet-panel border border-bullet-muted flex items-center justify-center text-[8px] text-white" title={g.title}>
               {g.title[0]}
             </div>
           ))}
         </div>
         <span className="text-[10px] font-bold text-bullet-accent uppercase tracking-wider group-hover:underline">
            View Intel [+]
         </span>
      </div>
    </div>
  </div>
);