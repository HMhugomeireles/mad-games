'use client';

import React from 'react';

// --- TIPOS ---
export type SearchScope = 'PLAYER' | 'TEAM';

interface TacticalSearchFilterProps {
    scope: SearchScope;
    onScopeChange: (scope: SearchScope) => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    className?: string;
}

export default function TacticalSearchFilter({
    scope,
    onScopeChange,
    searchTerm,
    onSearchChange,
    className = ''
}: TacticalSearchFilterProps) {

    return (
        <div className={`flex flex-col md:flex-row gap-4 items-end md:items-center ${className}`}>

            {/* 1. SELETOR DE MIRA (SCOPE SWITCH) */}
            <div className="flex bg-black/40 border border-white/10 p-1">

                {/* Botão Operador */}
                <button
                    onClick={() => onScopeChange('PLAYER')}
                    className={`
            px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 relative overflow-hidden
            ${scope === 'PLAYER'
                            ? 'bg-bullet-accent text-bullet-dark'
                            : 'text-bullet-muted hover:text-white hover:bg-white/5'}
          `}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                        Operator
                    </span>
                    {/* Efeito de brilho de fundo se ativo */}
                    {scope === 'PLAYER' && <div className="absolute inset-0 bg-white/20 skew-x-12 -translate-x-full animate-[shimmer_1s_infinite]"></div>}
                </button>

                {/* Separador Tático */}
                <div className="w-[1px] bg-white/10 mx-1"></div>

                {/* Botão Equipa */}
                <button
                    onClick={() => onScopeChange('TEAM')}
                    className={`
            px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300
            ${scope === 'TEAM'
                            ? 'bg-bullet-accent text-bullet-dark'
                            : 'text-bullet-muted hover:text-white hover:bg-white/5'}
          `}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
                        Unit (Team)
                    </span>
                </button>
            </div>

            {/* 2. INPUT DE PESQUISA */}
            <div className="relative flex-1 w-full group">
                {/* Ícone Lupa */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-bullet-muted group-focus-within:text-bullet-accent transition-colors">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>

                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={`SEARCH BY ${scope === 'PLAYER' ? 'OPERATOR CALLSIGN' : 'UNIT NAME'}...`}
                    className="
             w-full bg-bullet-panel/80 border border-white/10 
             text-white text-xs font-mono uppercase tracking-wide
             py-3 pl-10 pr-10 outline-none 
             focus:border-bullet-accent focus:bg-bullet-panel
             transition-all duration-300 placeholder-bullet-muted
           "
                />

                {/* Botão Limpar (Só aparece se houver texto) */}
                {searchTerm && (
                    <button
                        onClick={() => onSearchChange('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-bullet-muted hover:text-white transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                )}

                {/* Decoração: Linha Scanline em baixo */}
                <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-bullet-accent group-focus-within:w-full transition-all duration-500"></div>
            </div>

        </div>
    );
}