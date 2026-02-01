'use client';
import React, { useState } from 'react';

// --- DADOS FICTÍCIOS ---
const tokenPackages = [
  { id: 1, amount: 500, label: "TOKENS" },
  { id: 2, amount: 1500, label: "TOKENS" },
  { id: 3, amount: 2000, label: "TOKENS" },
  { id: 4, amount: 3000, label: "TOKENS" },
  { id: 5, amount: 4000, label: "TOKENS" },
  { id: 6, amount: 5000, label: "TOKENS" },
];

export default function StorePage() {
  const [selectedId, setSelectedId] = useState(1);
  const [activeTab, setActiveTab] = useState('TOKENS');

  return (
    <div className="flex flex-col h-screen p-8 max-w-[1600px] mx-auto overflow-hidden bg-bullet-dark text-white font-mono selection:bg-bullet-accent selection:text-white">
      
      {/* --- HEADER --- */}
      <header className="flex justify-between items-end mb-4 shrink-0">
        <div>
          <h1 className="text-4xl text-white font-light uppercase tracking-wide">
            Store
          </h1>
        </div>
        
        {/* Balance Indicator (Top Right) */}
        <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded border border-white/5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-700 flex items-center justify-center text-[10px] font-bold text-yellow-900 border border-yellow-200">
            TK
          </div>
          <span className="text-xl font-bold text-yellow-400">200</span>
        </div>
      </header>

      {/* --- TABS --- */}
      <nav className="flex space-x-1 border-b-2 border-bullet-muted/20 mb-8">
        {['WEAPONS', 'TOKENS', 'SPECIALS'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-8 py-3 uppercase tracking-wider text-sm font-bold transition-all relative
              ${activeTab === tab 
                ? 'text-bullet-accent bg-gradient-to-t from-bullet-accent/20 to-transparent' 
                : 'text-bullet-muted hover:text-white hover:bg-white/5'}
            `}
          >
            {tab}
            {/* Indicador de Tab Ativa (Triângulo ou Linha Laranja) */}
            {activeTab === tab && (
              <div className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-bullet-accent shadow-[0_0_10px_var(--color-bullet-accent)]"></div>
            )}
             {activeTab === tab && (
               <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-bullet-accent"></div>
            )}
          </button>
        ))}
      </nav>

      {/* --- MAIN GRID --- */}
      <main className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
          {tokenPackages.map((pkg) => {
            const isSelected = selectedId === pkg.id;
            
            return (
              <div 
                key={pkg.id}
                onClick={() => setSelectedId(pkg.id)}
                className={`
                  relative h-64 p-8 cursor-pointer transition-all duration-300 group overflow-hidden
                  flex flex-col justify-between
                  bg-bullet-panel border
                  ${isSelected 
                    ? 'border-bullet-accent bg-gradient-to-br from-bullet-panel-lighter to-bullet-panel shadow-[0_0_20px_rgba(217,119,6,0.15)]' 
                    : 'border-transparent hover:border-white/10 hover:bg-bullet-panel-hover'}
                `}
              >
                {/* Efeito Glow de Fundo se selecionado */}
                {isSelected && (
                  <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-bullet-accent/10 rounded-full blur-3xl pointer-events-none"></div>
                )}

                {/* Texto: Quantidade */}
                <div className="relative z-10">
                  <div className={`text-5xl font-light tracking-tight ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                    {/* Formatação de número com espaço (Ex: 1 500) */}
                    {pkg.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                  </div>
                  <div className="text-bullet-muted font-bold text-sm tracking-[0.2em] uppercase mt-1 group-hover:text-bullet-accent transition-colors">
                    {pkg.label}
                  </div>
                </div>

                {/* Imagem das Moedas (Posicionada à direita/baixo) */}
                <div className="absolute bottom-2 right-2 transform scale-110 group-hover:scale-125 transition-transform duration-500 origin-bottom-right">
                  <GoldCoinStack amount={pkg.amount} />
                </div>

                {/* Indicador de Seleção (Canto inferior esquerdo, se necessário, ou apenas a borda) */}
                {isSelected && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-bullet-accent to-transparent"></div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* --- FOOTER: Keybinds --- */}
      <footer className="mt-4 pt-4 border-t border-white/10 shrink-0 flex items-center gap-8 text-xs text-bullet-muted uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-lg">ESC</span>
          <span>Back</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-lg">ENTER</span>
          <span>Refresh</span>
        </div>
      </footer>

    </div>
  );
}


const GoldCoinStack = ({ size = "md", amount }: { size?: "sm" | "md" | "lg"; amount: number }) => {
  // Ajusta a "altura" da pilha baseada na quantidade (visual apenas)
  const stackHeight = amount > 3000 ? 5 : amount > 1000 ? 3 : 1;
  
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* Definição dos Gradientes Dourados (reutilizáveis) */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" /> {/* Amarelo claro */}
            <stop offset="50%" stopColor="#d97706" /> {/* Laranja escuro */}
            <stop offset="100%" stopColor="#854d0e" /> {/* Castanho dourado */}
          </linearGradient>
          <linearGradient id="goldRim" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#854d0e" />
            <stop offset="50%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>
        </defs>
      </svg>

      {/* Renderiza as moedas empilhadas */}
      {[...Array(stackHeight + 2)].map((_, i) => {
        // Offset para criar o efeito de pilha 3D
        const offset = i * -6; 
        const isTop = i === stackHeight + 1;
        
        return (
          <div 
            key={i} 
            className="absolute drop-shadow-xl"
            style={{ 
              bottom: `${30 + offset}px`, 
              left: `${30 + (i * 2)}px`, // Ligeiro desvio lateral
              zIndex: i 
            }}
          >
            <svg width="60" height="60" viewBox="0 0 100 100">
              {/* Borda da Moeda */}
              <circle cx="50" cy="50" r="48" fill="url(#goldRim)" stroke="#713f12" strokeWidth="1" />
              {/* Face da Moeda */}
              <circle cx="50" cy="50" r="40" fill="url(#goldGradient)" />
              {/* Anel Interno */}
              <circle cx="50" cy="50" r="35" fill="none" stroke="#fef08a" strokeWidth="1" opacity="0.5" />
              
              {/* Texto TK */}
              <text x="50" y="62" 
                    fontSize="35" 
                    fontWeight="900" 
                    fontFamily="sans-serif" 
                    fill="#713f12" 
                    textAnchor="middle"
                    style={{ textShadow: '1px 1px 0px rgba(255,255,255,0.4)' }}
              >
                TK
              </text>
            </svg>
          </div>
        );
      })}
      
      {/* Moeda caída ao lado (para pilhas grandes) */}
      {amount > 2500 && (
         <div className="absolute bottom-4 left-4 z-0 rotate-[-80deg] drop-shadow-lg">
            <svg width="60" height="60" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="url(#goldRim)" />
              <circle cx="50" cy="50" r="40" fill="url(#goldGradient)" />
              <text x="50" y="62" fontSize="35" fontWeight="900" fill="#713f12" textAnchor="middle">TK</text>
            </svg>
         </div>
      )}
    </div>
  );
};