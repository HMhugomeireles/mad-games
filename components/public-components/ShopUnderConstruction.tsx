'use client';

import React from 'react';
import Link from 'next/link';

// --- COMPONENTES AUXILIARES ---

// Botão Tático (Reutilizado dos exemplos anteriores para consistência)
const TacticalButton = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <Link href={href}>
        <button
            className="
        relative group overflow-hidden
        bg-white/5 hover:bg-bullet-accent/10
        border border-bullet-accent/50 hover:border-bullet-accent
        text-bullet-accent hover:text-white
        text-sm font-bold uppercase tracking-[0.2em]
        py-4 px-10 transition-all duration-300
      "
            style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
        >
            <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
                Return to Base
            </span>
            {/* Scanline effect on hover */}
            <div className="absolute inset-0 bg-bullet-accent/20 translate-y-[100%] group-hover:translate-y-[-100%] transition-transform duration-700 z-0"></div>
        </button>
    </Link>
);

// Barra de Risco (Hazard Stripe Pattern)
const HazardBar = ({ className }: { className?: string }) => (
    <div
        className={`h-4 w-full ${className}`}
        style={{
            backgroundImage: 'repeating-linear-gradient(-45deg, #d97706, #d97706 10px, #0f1216 10px, #0f1216 20px)'
        }}
    ></div>
);

// Ícone Central Animado
const LockdownIcon = () => (
    <div className="relative w-32 h-32 flex items-center justify-center mb-8">
        {/* Círculos externos a rodar */}
        <div className="absolute inset-0 border-2 border-dashed border-bullet-accent/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
        <div className="absolute inset-4 border border-white/10 rounded-full animate-[spin_5s_linear_reverse_infinite]"></div>

        {/* Ícone Central (Cadeado/Engrenagem) */}
        <svg className="w-16 h-16 text-bullet-accent relative z-10 drop-shadow-[0_0_15px_rgba(217,119,6,0.5)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4 4zm-4-2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            <path d="M12 7c-2.76 0-5 2.24-5 5 0 .65.13 1.26.36 1.82L9.29 12l-1.93-1.82C7.13 10.74 7 11.35 7 12c0 2.76 2.24 5 5 5s5-2.24 5-5c0-.65-.13-1.26-.36-1.82l-1.93 1.82 1.93 1.82c.23-.56.36-1.17.36-1.82 0-2.76-2.24-5-5-5z" opacity="0.5" />
        </svg>

        {/* "X" de Bloqueio a piscar */}
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
            <svg className="w-24 h-24 text-bullet-accent/20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
        </div>
    </div>
);

// --- PÁGINA PRINCIPAL ---

export function ShopUnderConstruction() {
    return (
        <div className="min-h-screen bg-bullet-dark font-mono text-white relative overflow-hidden flex items-center justify-center p-4">

            {/* --- BACKGROUND FX --- */}
            {/* Grelha Tática */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            {/* Scanlines CRT */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] z-20"></div>
            {/* Vinheta */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0f1216_80%)] z-10"></div>

            {/* --- MAIN CONTENT CARD --- */}
            <div className="relative z-30 w-full max-w-2xl bg-bullet-panel/80 border border-white/10 backdrop-blur-md overflow-hidden shadow-2xl">

                {/* Barra de Risco Superior */}
                <HazardBar />

                <div className="p-8 md:p-12 flex flex-col items-center text-center relative">

                    {/* Decoração de canto */}
                    <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-bullet-accent opacity-50"></div>
                    <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 border-bullet-accent opacity-50"></div>

                    <LockdownIcon />

                    {/* Status Badge */}
                    <div className="mb-6 inline-flex items-center gap-2 bg-bullet-accent/10 border border-bullet-accent/30 px-4 py-1">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bullet-accent opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-bullet-accent"></span>
                        </span>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-bullet-accent">
                            Protocol: Maintenance
                        </span>
                    </div>

                    {/* Títulos */}
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-bullet-muted">
                        Supply Line <br className="md:hidden" /> Disrupted
                    </h1>

                    <div className="h-[2px] w-24 bg-bullet-accent mb-6"></div>

                    {/* Texto Descritivo */}
                    <p className="text-bullet-muted text-sm md:text-base leading-relaxed max-w-lg mb-10 font-mono">
                        The armory is currently undergoing tactical upgrades and asset replenishment.
                        Access to the supply drop is temporarily suspended.
                        <br /><br />
                        <span className="text-white">ETA for deployment: UNKNOWN. Stand by for further intel.</span>
                    </p>

                    {/* Botão de Ação */}
                    <TacticalButton href="/">Return to Base</TacticalButton>

                </div>

                {/* Barra de Risco Inferior */}
                <HazardBar />

                {/* Rodapé Técnico */}
                <div className="bg-black/40 py-2 px-4 text-[10px] text-bullet-muted/50 uppercase tracking-[0.3em] text-center border-t border-white/5 font-mono">
                    System ID: SHP-L4CKD0WN // ERR_CODE_503 // AUTH_PENDING
                </div>

            </div>

        </div>
    );
}