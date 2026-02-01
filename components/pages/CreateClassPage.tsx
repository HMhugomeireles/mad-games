'use client';

import React, { useState } from 'react';

// --- DADOS FICTÍCIOS ---
const weaponsData = [
  { 
    id: 'xf04', 
    name: 'XF-04', 
    desc: 'Espingarda de assalto versátil e totalmente automática. Ideal para combates de médio alcance com recuo controlável.',
    stats: { damage: 12, range: 10, fireRate: 14, accuracy: 11 }, // Max 20
    level: 10,
    maxLevel: 25,
    xp: 75 // % da barra
  },
  { 
    id: 'mp9', 
    name: 'MP 9-251 S', 
    desc: 'SMG compacta com alta cadência de tiro. Letal em confrontos a curta distância.',
    stats: { damage: 8, range: 6, fireRate: 18, accuracy: 9 },
    level: 4,
    maxLevel: 25,
    xp: 30
  },
  { 
    id: 'ti299', 
    name: 'TI 299', 
    desc: 'Rifle de atirador designado. Alto dano por tiro, mas baixa mobilidade.',
    stats: { damage: 18, range: 18, fireRate: 5, accuracy: 16 },
    level: 1,
    maxLevel: 25,
    xp: 0
  },
  { id: 'izs1', name: 'IZS-1', desc: 'Protótipo experimental com munição de energia.', stats: { damage: 14, range: 12, fireRate: 11, accuracy: 14 }, level: 12, maxLevel: 30, xp: 50 },
  { id: 'strio99', name: 'STRIO 99', desc: 'Espingarda de assalto pesada. Dano massivo com recuo acentuado.', stats: { damage: 16, range: 14, fireRate: 9, accuracy: 8 }, level: 20, maxLevel: 25, xp: 90 },
  { id: 'mk99a', name: 'MK-99 A', desc: 'Arma clássica modernizada. Equilíbrio perfeito entre todas as estatísticas.', stats: { damage: 11, range: 11, fireRate: 11, accuracy: 12 }, level: 5, maxLevel: 25, xp: 20 },
];

const categories = ['SUBMACHINE GUNS', 'ASSAULT RIFLES', 'SHOTGUNS', 'LIGHT MACHINE GUNS', 'SNIPER RIFLES'];

// Componente para Barra de Estatística Segmentada
const StatBar = ({ label, value, maxValue = 20 }: { label: string; value: number; maxValue?: number }) => {
  return (
    <div className="flex items-center text-xs tracking-widest mb-1">
      <div className="w-24 text-bullet-muted font-bold uppercase">{label}</div>
      <div className="flex gap-[2px] flex-1">
        {[...Array(maxValue)].map((_, i) => (
          <div 
            key={i} 
            className={`h-3 w-3 ${i < value ? 'bg-bullet-text' : 'bg-bullet-panel border border-white/5'}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default function CreateClassPage() {
  const [selectedWeaponId, setSelectedWeaponId] = useState('xf04');
  const [activeCategory, setActiveCategory] = useState('ASSAULT RIFLES');

  const selectedWeapon = weaponsData.find(w => w.id === selectedWeaponId) || weaponsData[0];

  return (
    <div className="flex flex-col h-screen p-8 max-w-[1600px] mx-auto overflow-hidden">
      
      {/* --- HEADER --- */}
      <div className="mb-2">
        <h1 className="text-4xl text-white font-bold uppercase tracking-wide">
          Create Class
        </h1>
        <div className="text-xs text-bullet-muted uppercase tracking-widest mt-1">
          SELECT <span className="text-white">Primary Weapon</span>
        </div>
      </div>

      {/* --- CATEGORY TABS --- */}
      <nav className="flex space-x-1 border-b border-bullet-muted/20 mb-6 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`
              px-6 py-2 uppercase tracking-wider text-sm font-bold transition-all whitespace-nowrap relative
              ${activeCategory === cat 
                ? 'text-bullet-accent border-b-4 border-bullet-accent' 
                : 'text-bullet-muted hover:text-white hover:bg-white/5'}
            `}
          >
            {cat}
            {/* Badge de notificação (ex: "1" novo item) */}
            {cat === 'LIGHT MACHINE GUNS' && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]"></span>
            )}
          </button>
        ))}
      </nav>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="flex flex-1 gap-12 overflow-hidden">
        
        {/* COLUNA ESQUERDA: LISTA DE ARMAS */}
        <div className="w-1/4 min-w-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-bullet-accent/20">
          <div className="space-y-1">
            {weaponsData.map((weapon) => {
              const isActive = selectedWeaponId === weapon.id;
              return (
                <div 
                  key={weapon.id}
                  onClick={() => setSelectedWeaponId(weapon.id)}
                  className={`
                    group flex items-center h-20 px-4 cursor-pointer transition-all border-b border-white/5
                    ${isActive ? 'weapon-active' : 'hover:bg-white/5 bg-bullet-panel/50'}
                  `}
                >
                  {/* Ícone da Arma (Placeholder SVG) */}
                  <div className={`w-24 h-12 mr-4 bg-contain bg-no-repeat bg-center opacity-80 ${isActive ? 'opacity-100' : 'grayscale opacity-50'}`}
                       style={{ 
                         // Em produção, usarias as imagens reais das armas
                         backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 50' fill='%23e2e8f0'%3E%3Cpath d='M10 20 h60 l10 -5 v15 h-5 l-5 5 h-20 v10 h-10 v-10 h-30 z' opacity='${isActive ? 1 : 0.5}'/%3E%3C/svg%3E")` 
                       }}
                  ></div>
                  
                  <div className="flex-1">
                    <div className={`font-bold text-lg uppercase ${isActive ? 'text-white' : 'text-bullet-muted group-hover:text-white'}`}>
                      {weapon.name}
                    </div>
                  </div>

                  {/* Checkmark se selecionado */}
                  {isActive && (
                    <div className="w-4 h-4 bg-bullet-accent/20 border border-bullet-accent flex items-center justify-center">
                       <div className="w-2 h-2 bg-bullet-accent"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUNA DIREITA: DETALHES */}
        <div className="flex-1 flex flex-col pt-4 relative">
          
          {/* Título e Descrição */}
          <div className="mb-8 max-w-2xl z-10">
            <h2 className="text-4xl text-white font-light mb-2 uppercase">{selectedWeapon.name}</h2>
            <div className="h-[2px] w-24 bg-bullet-accent mb-4"></div>
            <p className="text-bullet-muted text-sm leading-relaxed bg-bullet-dark/80 p-4 border-l-2 border-bullet-muted/30">
              {selectedWeapon.desc}
            </p>
          </div>

          {/* Imagem Grande da Arma (Centrada) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] pointer-events-none opacity-20 lg:opacity-100 lg:static lg:transform-none lg:w-full lg:h-[400px] lg:mb-auto flex items-center justify-center">
             {/* Simulação de silhueta de arma grande */}
             <svg className="w-full h-full text-white/10 drop-shadow-2xl" fill="currentColor" viewBox="0 0 400 200">
                <path d="M50 100 h200 l40 -20 v60 h-20 l-20 40 h-40 v-40 h-100 z" />
                <path d="M250 80 h80 v20 h-80 z" opacity="0.5" /> {/* Mira */}
                <path d="M40 100 h-20 v20 h20 z" opacity="0.5" /> {/* Cano */}
             </svg>
          </div>

          {/* Painel Inferior: Estatísticas e Nível */}
          <div className="mt-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-end pb-12">
            
            {/* Stats Bars */}
            <div className="space-y-2 bg-bullet-dark/50 p-4 rounded backdrop-blur-sm">
              <StatBar label="DAMAGE" value={selectedWeapon.stats.damage} />
              <StatBar label="RANGE" value={selectedWeapon.stats.range} />
              <StatBar label="FIRE RATE" value={selectedWeapon.stats.fireRate} />
              <StatBar label="ACCURACY" value={selectedWeapon.stats.accuracy} />
            </div>

            {/* Level Progress */}
            <div className="text-right">
              <div className="flex justify-end items-end gap-2 mb-2">
                <span className="text-xs text-bullet-muted uppercase tracking-widest">Weapon Level</span>
                <span className="text-2xl text-bullet-accent font-bold">{selectedWeapon.level}</span>
                <span className="text-sm text-bullet-muted mb-1">/ {selectedWeapon.maxLevel}</span>
              </div>
              
              {/* Barra de Progresso Laranja Grossa */}
              <div className="h-4 w-full bg-bullet-panel border border-white/10 relative">
                <div 
                  className="h-full bg-bullet-accent absolute top-0 right-0 transition-all duration-500"
                  style={{ width: `${selectedWeapon.xp}%` }}
                ></div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* --- FOOTER: Keybinds --- */}
      <footer className="mt-4 pt-4 border-t border-white/10 shrink-0 flex items-center gap-8 text-xs text-bullet-muted uppercase tracking-wider">
        <div className="flex items-center gap-2 cursor-pointer hover:text-white">
          <span className="text-white font-bold text-lg">ESC</span>
          <span>Back</span>
        </div>
      </footer>

    </div>
  );
}