'use client';

import React, { useState } from 'react';

// --- ÍCONES SVG SIMPLES ---
const Icons = {
  Grip: <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v11h3v9h7v-9h3V2H7zm5 18v-7h-2v7h2zm6-9h-2V4h2v7zm-8 0H8V4h2v7z"/></svg>,
  Sight: <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>,
  Grenade: <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-4.42 0-8 3.58-8 8v4h2v-4c0-3.31 2.69-6 6-6s6 2.69 6 6v4h2v-4c0-4.42-3.58-8-8-8zm0 10c-2.21 0-4 1.79-4 4v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-4c0-2.21-1.79-4-4-4z"/></svg>,
  Flash: <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v11h3v9h7v-9h3V2H7z" opacity="0.5"/></svg>, // Placeholder
  Gear: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.54.603 1.519.146 2.232a1.534 1.534 0 00-2.286.948c-1.56.38-1.56 2.6 0 2.98a1.532 1.532 0 012.286.948c.836 1.372 2.406 2.942 2.106 2.106a1.532 1.532 0 012.286.948c.38 1.56 2.6 1.56 2.98 0a1.533 1.533 0 012.286-.948c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 012.286-.948c1.56-.38 1.56-2.6 0-2.98a1.533 1.533 0 01-2.286-.948c-.836-1.372-2.406-2.942-2.106-2.106a1.532 1.532 0 01-2.286-.948zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>
};

// URL de dados SVG para a silhueta da arma (Assault Rifle)
const AR_SILHOUETTE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 50' fill='white'%3E%3Cpath d='M10 20 h60 l10 -5 v15 h-5 l-5 5 h-20 v10 h-10 v-10 h-30 z'/%3E%3C/svg%3E";
const PISTOL_SILHOUETTE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 30' fill='white'%3E%3Cpath d='M5 10 h30 v5 h-5 v10 h-10 v-10 h-15 z'/%3E%3C/svg%3E";

export default function CreateClassOverview() {
  const [activeClass, setActiveClass] = useState(1);

  return (
    <div className="flex flex-col h-screen p-8 max-w-[1600px] mx-auto overflow-hidden bg-bullet-dark font-mono text-white select-none">
      
      {/* --- HEADER --- */}
      <header className="mb-8 border-b border-white/10 pb-4 shrink-0">
        <h1 className="text-4xl text-white font-normal uppercase tracking-wide">
          Create Class
        </h1>
      </header>

      {/* --- MAIN LAYOUT --- */}
      <main className="flex flex-1 gap-16 relative">
        
        {/* 1. SIDEBAR (Class Selection) */}
        <aside className="w-64 shrink-0 flex flex-col gap-2">
          {/* Class Set Selector */}
          <div className="flex items-center justify-between bg-gradient-to-r from-bullet-accent/20 to-transparent p-2 mb-4 border-l-2 border-bullet-accent">
            <button className="text-bullet-muted hover:text-white">&lt;</button>
            <span className="text-bullet-accent font-bold text-sm tracking-widest uppercase">Class Set 1</span>
            <button className="text-bullet-muted hover:text-white">&gt;</button>
          </div>
          
          {/* Lista de Classes */}
          {[1, 2, 3, 4, 5].map((num) => {
            const isActive = activeClass === num;
            return (
              <button
                key={num}
                onClick={() => setActiveClass(num)}
                className={`
                  group flex items-center justify-between p-3 text-left transition-all relative
                  ${isActive 
                    ? 'bg-gradient-to-r from-white/10 to-transparent text-bullet-accent' 
                    : 'text-bullet-muted hover:bg-white/5 hover:text-white'}
                `}
              >
                {/* Indicador de Borda Ativa */}
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-bullet-accent shadow-[0_0_10px_var(--color-bullet-accent)]"></div>}
                
                <span className="font-bold tracking-wide pl-2">Custom {num}</span>
                
                {/* Ícone de Engrenagem (Settings) */}
                <span className={`opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100 text-bullet-accent' : 'text-bullet-muted'}`}>
                  {Icons.Gear}
                </span>
              </button>
            );
          })}
        </aside>

        {/* 2. LOADOUT GRID (Center) */}
        <section className="flex-1 flex flex-col gap-8 pt-2 max-w-2xl z-10">
          
          {/* Row 1: PRIMARY */}
          <div className="flex gap-4">
            {/* Arma Principal */}
            <WeaponSlot 
              label="PRIMARY" 
              weaponName="XF-04" 
              weaponLevel={10} 
              imagePath={AR_SILHOUETTE} 
            />
            
            {/* Attachments */}
            <div className="flex gap-4">
              <SmallSlot label="ATTACHMENTS" icon={Icons.Grip} />
              <SmallSlot label="&nbsp;" icon={Icons.Sight} /> {/* Espaço vazio no label para alinhar */}
              <SmallSlot label="&nbsp;" isEmpty={true} />
            </div>
          </div>

          {/* Row 2: SECONDARY */}
          <div className="flex gap-4">
            {/* Arma Secundária */}
            <WeaponSlot 
              label="SECONDARY" 
              weaponName="RK-5" 
              // weaponLevel={1}     
              imagePath={PISTOL_SILHOUETTE} 
              isSecondary
            />
            
            {/* Attachments */}
            <div className="flex gap-4">
              <SmallSlot label="ATTACHMENTS" isEmpty={true} />
              <SmallSlot label="&nbsp;" isEmpty={true} />
              <SmallSlot label="&nbsp;" isEmpty={true} />
            </div>
          </div>

          {/* Row 3: LETHAL / TACTICAL / PERKS */}
          <div className="flex gap-12 mt-2">
            
            {/* Granadas */}
            <div className="flex gap-4">
              <SmallSlot label="LETHAL" icon={Icons.Grenade} />
              <SmallSlot label="TACTICAL" icon={Icons.Flash} />
            </div>

            {/* Perks */}
            <div className="flex gap-4">
              <SmallSlot label="PERKS" isEmpty={true} />
              <SmallSlot label="&nbsp;" isEmpty={true} />
              <SmallSlot label="&nbsp;" isEmpty={true} />
            </div>

          </div>

        </section>

        {/* 3. CHARACTER PREVIEW (Right) */}
        {/* Silhouette de fundo, posicionada de forma absoluta ou na grid */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none opacity-20 lg:opacity-100 flex items-center justify-center">
           {/* Placeholder SVG de um soldado */}
           <svg className="h-[80%] text-bullet-panel-lighter" viewBox="0 0 100 200" fill="currentColor">
              <path d="M50 20 c-10 0 -15 10 -15 20 s5 20 15 20 s15 -10 15 -20 s-5 -20 -15 -20 z M30 50 l-10 40 l10 80 h40 l10 -80 l-10 -40 z" />
              {/* Detalhe da arma na mão */}
              <rect x="20" y="80" width="60" height="10" rx="2" fill="#1a2026" />
           </svg>
           {/* Gradiente para fundir os pés com o chão */}
           <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-bullet-dark to-transparent"></div>
        </div>

      </main>

      {/* --- FOOTER --- */}
      <footer className="mt-4 pt-4 border-t border-white/10 shrink-0 flex items-center gap-8 text-xs text-bullet-muted uppercase tracking-wider">
        <div className="flex items-center gap-2 cursor-pointer hover:text-white">
          <span className="text-white font-bold text-lg">ESC</span>
          <span>Back</span>
        </div>
      </footer>

    </div>
  );
}

const SmallSlot = ({ label, icon, isEmpty = false }: { label: string; icon?: React.ReactNode; isEmpty?: boolean }) => {
  return (
    <div className="flex flex-col gap-1">
      {/* Label opcional acima do slot (ex: LETHAL) */}
      {label && <span className="text-[10px] text-bullet-muted uppercase tracking-wider font-bold">{label}</span>}
      
      {/* O Slot Quadrado */}
      <div className={`
        w-20 h-20 border border-white/5 flex items-center justify-center transition-colors cursor-pointer
        ${isEmpty ? 'bg-transparent hover:bg-white/5' : 'bg-bullet-panel hover:bg-bullet-panel-hover'}
      `}>
        {icon ? (
          <div className="opacity-80 hover:opacity-100 transition-opacity">
            {icon}
          </div>
        ) : (
          // Slot Vazio
          <div className="w-full h-full bg-black/20"></div>
        )}
      </div>
    </div>
  );
};

// --- SLOT GRANDE (Armas Principais) ---
const WeaponSlot = ({ label, weaponName, weaponLevel, imagePath, isSecondary = false }: { label: string; weaponName?: string; weaponLevel?: number; imagePath?: string; isSecondary?: boolean }) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] text-bullet-muted uppercase tracking-wider font-bold">{label}</span>
      
      <div className="group relative w-48 h-32 bg-bullet-panel border border-white/5 hover:border-bullet-muted/50 hover:bg-bullet-panel-hover cursor-pointer transition-all overflow-hidden">
        
        {/* Imagem da Arma */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
           {/* Placeholder SVG se não houver imagem */}
           <div 
             className="w-full h-full bg-contain bg-no-repeat bg-center opacity-80 group-hover:scale-105 transition-transform duration-300"
             style={{ backgroundImage: `url('${imagePath}')`, filter: 'invert(1) opacity(0.7)' }} // Invert para ficar branco no fundo escuro
           ></div>
        </div>

        {/* Overlay de Texto (Apenas se tiver arma) */}
        {weaponName && (
          <div className="absolute bottom-2 left-3">
             {weaponLevel && (
               <div className="text-[10px] text-bullet-accent font-bold tracking-wider mb-0.5">
                 LEVEL {weaponLevel}
               </div>
             )}
             <div className="text-white font-bold text-sm tracking-wide uppercase">
               {weaponName}
             </div>
          </div>
        )}

        {/* Efeito de Gradiente no Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </div>
    </div>
  );
};