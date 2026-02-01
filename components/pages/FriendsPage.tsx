'use client';

import React, { useState } from 'react';

// --- MOCK DATA ---
const friendsData = [
  { id: 1, name: 'Chompi', status: 'online' },
  { id: 2, name: 'SMK', status: 'online' },
  { id: 3, name: 'UnnknOwn', status: 'away' }, // Laranja
  { id: 4, name: 'GhostActual', status: 'offline' },
  { id: 5, name: 'Viper_One', status: 'offline' },
  { id: 6, name: 'SoapMactavish', status: 'offline' },
  { id: 7, name: 'Price_Capt', status: 'offline' },
  { id: 8, name: 'Gaz', status: 'offline' },
];

// Ícone de Caveira (Skull SVG)
const SkullIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C7.58 2 4 5.58 4 10c0 2.62 1.25 4.94 3.18 6.43.27.21.43.54.43.88v1.19c0 .83.67 1.5 1.5 1.5h.5c.83 0 1.5.67 1.5 1.5v.5h5.78v-.5c0-.83.67-1.5 1.5-1.5h.5c.83 0 1.5-.67 1.5-1.5v-1.19c0-.34.16-.67.43-.88C22.75 14.94 24 12.62 24 10c0-4.42-3.58-8-8-8zm0 13c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" opacity="0.8"/>
    <circle cx="9" cy="9" r="1.5" className="text-bullet-dark" fill="currentColor"/>
    <circle cx="15" cy="9" r="1.5" className="text-bullet-dark" fill="currentColor"/>
    <path d="M12 18c-1.5 0-3 .5-3 .5v1.5h6v-1.5s-1.5-.5-3-.5z" opacity="0.6"/>
  </svg>
);

function FriendsWidget() {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtra amigos pelo nome
  const filteredFriends = friendsData.filter(friend => 
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para determinar a cor do status
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'online': return 'bg-[#84cc16] shadow-[0_0_5px_#84cc16]'; // Lime Green
      case 'away': return 'bg-[#ea580c] shadow-[0_0_5px_#ea580c]';   // Orange
      default: return 'bg-bullet-muted/50';                          // Grey
    }
  };

  return (
    <div className="w-[380px] bg-bullet-panel/95 border border-white/5 shadow-2xl backdrop-blur-sm flex flex-col font-mono text-sm">
      
      {/* --- HEADER --- */}
      <div className="p-4 border-b border-white/5">
        <h2 className="text-bullet-muted uppercase tracking-widest text-lg font-normal">
          Friends
        </h2>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="relative border-b border-white/5 bg-bullet-dark/30">
        <input 
          type="text"
          placeholder="Search for friends by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-white p-3 pr-10 outline-none placeholder-bullet-muted/50 text-xs uppercase tracking-wide"
        />
        {/* Ícone de Lupa */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-bullet-muted">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>

      {/* --- LIST --- */}
      <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-bullet-muted/20 scrollbar-track-transparent">
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <div 
              key={friend.id}
              className="group flex items-center justify-between p-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
            >
              {/* Esquerda: Avatar e Nome */}
              <div className="flex items-center gap-3">
                {/* Ícone Caveira */}
                <SkullIcon className={`w-5 h-5 ${friend.status === 'offline' ? 'text-bullet-muted' : 'text-white'}`} />
                
                <span className={`tracking-wide font-bold ${friend.status === 'offline' ? 'text-bullet-muted' : 'text-white'}`}>
                  {friend.name}
                </span>
              </div>

              {/* Direita: Status e Botão */}
              <div className="flex items-center gap-4">
                {/* Bola de Status */}
                <div className={`w-2 h-2 rounded-full ${getStatusColor(friend.status)}`}></div>
                
                {/* Botão Invite (Separado por linha vertical subtil) */}
                <div className="pl-4 border-l border-white/10">
                  <button className="text-[10px] uppercase font-bold text-bullet-muted hover:text-white hover:bg-white/10 px-2 py-1 rounded transition-colors tracking-wider">
                    Invite
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-bullet-muted text-xs uppercase tracking-widest opacity-50">
            No friends found
          </div>
        )}
      </div>

    </div>
  );
}


export default function FriendsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-bullet-dark">
      
      {/* Imagem de Fundo (Simulada) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-bullet-panel)_0%,_#000_100%)] opacity-80 z-0"></div>
      
      {/* Grelha de Fundo */}
      <div 
        className="absolute inset-0 z-0 opacity-10"
        style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
        }}
      ></div>

      {/* O Widget */}
      <div className="relative z-10">
        <FriendsWidget />
      </div>
      
    </div>
  );
}