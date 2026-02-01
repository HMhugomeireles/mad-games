'use client';

import React, { useState } from 'react';

// --- DADOS FICTÍCIOS (MOCK DATA) ---
const mockServers = [
  { id: 1, name: "Tactical Ops - Alpha", map: "Urban District", mode: "Team Deathmatch", players: "16/18", ping: 24, locked: true },
  { id: 2, name: "Sniper Only | No Scope", map: "Forest Valley", mode: "Free for All", players: "8/12", ping: 32, locked: true },
  { id: 3, name: "[EU] Hardcore S&D", map: "Factory", mode: "Search & Destroy", players: "10/12", ping: 18, locked: true }, // Selecionado por defeito
  { id: 4, name: "Noobs Welcome | 24/7", map: "Desert Storm", mode: "Team Deathmatch", players: "18/18", ping: 45, locked: false },
  { id: 5, name: "Clan War Official", map: "Power Plant", mode: "Domination", players: "12/12", ping: 12, locked: true },
  { id: 6, name: "Pistols Only", map: "Subway", mode: "Team Deathmatch", players: "4/10", ping: 56, locked: true },
  { id: 7, name: "Zombie Survival", map: "Hospital", mode: "Infection", players: "22/32", ping: 60, locked: true },
  { id: 8, name: "Capture The Flag Pro", map: "Docks", mode: "CTF", players: "8/10", ping: 28, locked: false },
  { id: 9, name: "Training Grounds", map: "Shooting Range", mode: "Practice", players: "1/4", ping: 0, locked: false },
];

export default function BrowseGamePage() {
  const [selectedId, setSelectedId] = useState(3); // Começa com o 3º selecionado (como na imagem)
  const [activeTab, setActiveTab] = useState('MULTIPLAYER');

  // Encontra o objeto do servidor selecionado para mostrar no painel direito
  const selectedServer = mockServers.find(s => s.id === selectedId) || mockServers[0];

  return (
    <div className="flex flex-col h-screen p-8 max-w-[1600px] mx-auto overflow-hidden">
      
      {/* --- CABEÇALHO --- */}
      <header className="mb-6 shrink-0">
        <h1 className="text-4xl text-white font-bold uppercase tracking-wide mb-6">
          Browse Game
        </h1>
        
        {/* Tabs de Navegação */}
        <nav className="flex space-x-1 border-b border-bullet-muted/20">
          {['ALL', 'MULTIPLAYER', 'LAN', 'RECENT', 'FAVORITES'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-6 py-2 uppercase tracking-wider text-sm font-bold transition-all relative
                ${activeTab === tab 
                  ? 'text-bullet-dark bg-bullet-accent' // Estilo da tab ativa (fundo laranja)
                  : 'text-bullet-muted hover:text-white hover:bg-white/5'}
              `}
            >
              {tab}
              {/* O pequeno triângulo/seta em baixo da tab ativa (opcional, visual extra) */}
              {activeTab === tab && (
                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-bullet-accent"></div>
              )}
            </button>
          ))}
        </nav>
      </header>

      {/* --- CONTEÚDO PRINCIPAL (Split View) --- */}
      <main className="flex flex-1 gap-8 overflow-hidden">
        
        {/* ESQUERDA: Tabela de Servidores */}
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-bullet-accent/20 scrollbar-track-transparent">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-bullet-dark z-10 text-bullet-muted text-xs uppercase tracking-widest font-normal">
              <tr>
                <th className="py-2 pl-4 w-8">{/* Lock Icon Header */}</th>
                <th className="py-2">Server Name</th>
                <th className="py-2">Map</th>
                <th className="py-2 text-orange-500">Mode</th>
                <th className="py-2 text-right">Players</th>
                <th className="py-2 text-right pr-4">Ping</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {mockServers.map((server) => {
                const isSelected = selectedId === server.id;
                return (
                  <tr 
                    key={server.id}
                    onClick={() => setSelectedId(server.id)}
                    className={`
                      cursor-pointer transition-colors border-b border-white/5 h-10
                      ${isSelected 
                        ? 'bg-active-row text-white font-bold' 
                        : 'text-bullet-muted hover:bg-bullet-panel-hover hover:text-bullet-text'}
                    `}
                  >
                    <td className="pl-4">
                      {server.locked && (
                        <svg className="w-3 h-3 opacity-50" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                      )}
                    </td>
                    <td className="py-2">{server.name}</td>
                    <td className="py-2 opacity-80">{server.map}</td>
                    <td className={`py-2 ${isSelected ? 'text-bullet-accent' : 'text-orange-900/80 group-hover:text-orange-500'}`}>{server.mode}</td>
                    <td className="py-2 text-right opacity-70">{server.players}</td>
                    <td className="py-2 text-right pr-4 opacity-70">{server.ping}</td>
                  </tr>
                );
              })}
              
              {/* Linhas vazias para preencher espaço visualmente se necessário */}
              {[...Array(5)].map((_, i) => (
                <tr key={`empty-${i}`} className="h-10 border-b border-white/5 opacity-20"><td colSpan={6}></td></tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DIREITA: Detalhes do Servidor */}
        <aside className="w-[450px] flex flex-col pt-2">
          
          <h2 className="text-2xl text-white font-light mb-1">{selectedServer.name}</h2>
          <p className="text-bullet-accent text-sm uppercase tracking-widest mb-4">{selectedServer.mode}</p>

          {/* Imagem do Mapa (Blurry Background Style) */}
          <div className="relative h-48 w-full bg-bullet-panel mb-4 overflow-hidden border border-white/10 group">
             {/* Simulação de imagem - substitui por <img src="..." /> */}
             <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
             <div className="w-full h-full bg-[url('https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/mw2/meta/mw2-season-03-reveal-meta.jpg')] bg-cover bg-center opacity-60 group-hover:scale-105 transition-transform duration-500"></div>
             
             <div className="absolute bottom-4 left-4 z-20 text-white font-bold text-lg drop-shadow-md">
               {selectedServer.map}
             </div>
          </div>

          {/* Meta Info */}
          <div className="flex justify-between text-xs text-bullet-muted mb-6 font-bold">
            <span>IP: 192.168.0.1:27015</span>
            <span>Ping: {selectedServer.ping}</span>
          </div>

          {/* Descrição */}
          <div className="mb-6">
            <h3 className="text-white uppercase text-xs font-bold mb-2">Description</h3>
            <p className="text-bullet-muted text-sm leading-relaxed">
              Mauris sed nunc nec augue eleifend fringilla a non mi. Donec elementum, ipsum vel tempus tempus, urna mauris efficitur arcu.
            </p>
          </div>

          {/* Mods */}
          <div className="mb-auto">
            <h3 className="text-white uppercase text-xs font-bold mb-2">Mods</h3>
            <p className="text-bullet-muted text-xs">
              Unknown, DeathFromAbove, InstaRevive, TactMap
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-2 mt-4">
            <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-4 uppercase font-bold tracking-widest text-sm btn-military transition-colors">
              Join Server
            </button>
            <button className="bg-white/5 hover:bg-white/10 text-white px-4 btn-military flex items-center justify-center transition-colors border border-white/10">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
               <span className="ml-2 text-xs">Add to Favorites</span>
            </button>
          </div>

        </aside>
      </main>
      

    </div>
  );
}