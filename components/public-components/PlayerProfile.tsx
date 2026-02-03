'use client';

import React, { useState } from 'react';
import { ReputationWidget } from './ReputationWidget';

// --- MOCK DATA ---
const PLAYER_DATA = {
    id: "OP-4021",
    name: "Ricardo Silva",
    nickname: "GHOST_ACTUAL", // APD
    isValidated: true, // APD Validate
    district: "Porto",
    locality: "Valongo",
    rank: 14,
    reputationScore: 845,  // O score do jogador
    serverAverage: 620,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ghost&backgroundColor=b6e3f4",
    weapons: [
        { id: 1, name: "GHK MK18", type: "Primary", level: 55, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/M4A1_ACOG.jpg/1200px-M4A1_ACOG.jpg" }, // Placeholder URL
        { id: 2, name: "Glock 19", type: "Secondary", level: 20, image: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Glock_19_Gen_4.jpg" },
        { id: 1, name: "TM MWS 11", type: "Primary", level: 55, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/M4A1_ACOG.jpg/1200px-M4A1_ACOG.jpg" }, // Placeholder URL
        { id: 2, name: "MK23", type: "Secondary", level: 20, image: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Glock_19_Gen_4.jpg" }
    ],
    equipment: ["Flashbang x2", "Frag Grenade", "Plate Carrier Lvl 3", "UAV Jammer", "Medkit", "Tactical Helmet", "Night Vision Goggles", "Combat Boots", "Gloves", "Radio", "Utility Belt", "Hydration Pack", "Knee Pads"],
    fields: [
        { id: 1, name: "Stunhouse", date: "2023-10-15", rating: 5, comment: "Excelente organização." },
        { id: 2, name: "Arena 24", date: "2023-09-20", rating: 4, comment: "Bom terreno, mas safezone pequena." },
        { id: 3, name: "Avecar", date: "2023-08-05", rating: 5, comment: "Adrenalina pura." },
    ],
    awards: [
        { id: 1, title: "Team player", date: "2023", icon: "🏆" },
        { id: 2, title: "On Target", date: "2022", icon: "🎯" },
        { id: 3, title: "Star player month", date: "2023", icon: "⭐" },
    ],
    games: [
        { id: 1, event: "Sunday Skirmish", result: "WIN", kda: "24/5", role: "Assault" },
        { id: 2, event: "Night Ops", result: "LOSS", kda: "12/10", role: "Recon" },
        { id: 3, event: "Agent Rescue", result: "WIN", kda: "18/2", role: "Assault" },
    ]
};

// --- SUB-COMPONENTES ---

// Estrelas de Avaliação
const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex text-bullet-accent">
        {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-3 h-3 ${i < rating ? 'fill-current' : 'text-bullet-muted fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
        ))}
    </div>
);

// Tabs Navigation
const ProfileTabs = ({ active, setActive }: { active: string, setActive: (t: string) => void }) => {
    const tabs = ['FIELDS LOG', 'AWARDS', 'MATCH HISTORY'];
    return (
        <div className="flex border-b border-white/10 mb-6">
            {tabs.map(tab => (
                <button
                    key={tab}
                    onClick={() => setActive(tab)}
                    className={`
            flex-1 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-all relative
            ${active === tab ? 'text-white bg-white/5' : 'text-bullet-muted hover:text-white hover:bg-white/5'}
          `}
                >
                    {tab}
                    {active === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-bullet-accent shadow-[0_0_10px_var(--color-bullet-accent)]"></div>}
                </button>
            ))}
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---

export default function PlayerProfile() {
    const [activeTab, setActiveTab] = useState('FIELDS LOG');
    const p = PLAYER_DATA;

    return (
        <div className="w-full max-w-5xl mx-auto text-white font-mono min-h-screen p-4 md:p-8">

            {/* 1. HEADER / IDENTITY CARD */}
            <div className="bg-bullet-panel border border-white/10 p-6 mb-8 relative overflow-hidden">
                {/* Decorative Background ID */}
                <div className="absolute top-4 right-4 text-[100px] font-bold text-white/5 pointer-events-none select-none leading-none">
                    {p.id}
                </div>

                <div className="flex flex-col md:flex-row gap-8 relative z-10">

                    {/* Avatar com Borda Tática */}
                    <div className="flex-shrink-0 relative group">
                        <div className="w-32 h-32 md:w-40 md:h-40 border-2 border-bullet-muted/50 p-1 relative">
                            <img src={p.avatar} alt={p.nickname} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                            {/* Cantos */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-bullet-accent"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-bullet-accent"></div>
                        </div>

                        {/* Rank Badge sobreposto */}
                        <div className="absolute -bottom-3 -right-3 bg-bullet-dark border border-bullet-accent px-3 py-1 shadow-lg">
                            <div className="text-[10px] text-bullet-muted uppercase tracking-wider">Rank</div>
                            <div className="text-xl font-bold text-white text-center">#{p.rank}</div>
                        </div>
                    </div>

                    {/* Info Principal */}
                    <div className="flex-1 flex flex-col justify-center">

                        {/* Nome e APD */}
                        <div className="mb-2">
                            <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wide text-white">
                                {p.nickname}
                            </h1>
                            <div className="text-bullet-muted text-sm uppercase tracking-widest flex items-center gap-2">
                                {p.name}
                                {p.isValidated && (
                                    <span className="flex items-center gap-1 bg-green-900/30 text-green-500 border border-green-500/30 px-2 py-0.5 text-[10px] font-bold">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                                        APD VERIFIED
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Localização */}
                        <div className="flex items-center gap-2 text-xs text-bullet-text mt-2">
                            <svg className="w-4 h-4 text-bullet-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <span className="uppercase">{p.locality}, {p.district}</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-bullet-text mt-2">
                            <span className="uppercase">Apd: ANA-1234</span>
                            <span className="uppercase">Expire Date: 12/31/2028</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-bullet-text mt-2">
                            <span className="uppercase">Team:</span>
                            <span className="uppercase">Independente</span>
                        </div>
                    </div>

                </div>
                <div className="mt-10 ">
                    <ReputationWidget score={p.reputationScore} average={p.serverAverage} />
                </div>
            </div>

            {/* 2. LOADOUT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

                {/* Armas (2/3) */}
                <div className="lg:col-span-3">
                    <h3 className="text-white text-sm font-bold uppercase tracking-[0.2em] mb-4 border-l-4 border-bullet-accent pl-3">
                        Active Loadout
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {p.weapons.map((w) => (
                            <div key={w.id} className="bg-bullet-panel/50 border border-white/10 p-3 flex gap-4 hover:border-bullet-accent/50 transition-colors group">
                                {/* Imagem Placeholder */}
                                <div className="w-20 h-16 bg-black/50 border border-white/5 flex items-center justify-center overflow-hidden">
                                    {/* Aqui usarias w.image, pus placeholder para não quebrar */}
                                    <div className="text-[10px] text-bullet-muted group-hover:text-white uppercase">IMG: {w.name}</div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="text-[10px] text-bullet-accent uppercase tracking-widest">{w.type}</span>
                                    <span className="text-sm font-bold text-white uppercase">{w.name}</span>
                                    <span className="text-[10px] text-bullet-muted mt-1">Level {w.level}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Equipamento (1/3) */}
                <div className="lg:col-span-3">
                    <h3 className="text-white text-sm font-bold uppercase tracking-[0.2em] mb-4 border-l-4 border-bullet-muted pl-3">
                        Gear
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {p.equipment.map((item, idx) => (
                            <li key={idx} className="flex items-center justify-between bg-white/5 px-3 py-2 border-l-2 border-transparent hover:border-bullet-accent transition-colors">
                                <span className="text-xs uppercase tracking-wide text-bullet-text">{item}</span>
                                <div className="w-1.5 h-1.5 bg-bullet-accent/50 rounded-full"></div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* 3. TABS SECTION (History & Stats) */}
            <div>
                <ProfileTabs active={activeTab} setActive={setActiveTab} />

                <div className="min-h-[300px] animate-in fade-in duration-300">

                    {/* TAB 1: FIELDS LOG */}
                    {activeTab === 'FIELDS LOG' && (
                        <div className="space-y-2">
                            {p.fields.map(field => (
                                <div key={field.id} className="flex flex-col md:flex-row md:items-center justify-between bg-bullet-panel border border-white/5 p-4 hover:border-bullet-accent/30 transition-colors">
                                    <div>
                                        <h4 className="text-white font-bold uppercase tracking-wide">{field.name}</h4>
                                        <span className="text-[10px] text-bullet-muted uppercase tracking-widest">{field.date}</span>
                                    </div>
                                    <div className="flex flex-col md:items-end mt-2 md:mt-0 gap-1">
                                        <StarRating rating={field.rating} />
                                        <span className="text-xs text-bullet-muted italic">"{field.comment}"</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* TAB 2: AWARDS */}
                    {activeTab === 'AWARDS' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {p.awards.map(award => (
                                <div key={award.id} className="aspect-square bg-gradient-to-br from-bullet-panel to-black border border-white/10 flex flex-col items-center justify-center p-4 text-center group hover:border-yellow-500/50 transition-colors">
                                    <div className="text-4xl mb-3 grayscale group-hover:grayscale-0 transition-all">{award.icon}</div>
                                    <div className="text-sm font-bold text-white uppercase leading-tight mb-1">{award.title}</div>
                                    <div className="text-[10px] text-bullet-muted">{award.date}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* TAB 3: MATCH HISTORY */}
                    {activeTab === 'MATCH HISTORY' && (
                        <div className="border border-white/10 bg-black/20">
                            <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-white/5 text-[10px] text-bullet-muted uppercase tracking-widest font-bold">
                                <div className="col-span-2">Result</div>
                                <div className="col-span-5">Event / Op</div>
                                <div className="col-span-3">Role</div>
                                <div className="col-span-2 text-right">K/D</div>
                            </div>
                            <div className="divide-y divide-white/5">
                                {p.games.map(game => (
                                    <div key={game.id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-white/5">
                                        <div className="col-span-2">
                                            <span className={`px-2 py-1 text-[10px] font-bold uppercase ${game.result === 'WIN' ? 'bg-green-900/30 text-green-500 border border-green-500/30' : 'bg-red-900/30 text-red-500 border border-red-500/30'}`}>
                                                {game.result}
                                            </span>
                                        </div>
                                        <div className="col-span-5 text-sm font-bold text-white uppercase">{game.event}</div>
                                        <div className="col-span-3 text-xs text-bullet-muted uppercase">{game.role}</div>
                                        <div className="col-span-2 text-right font-mono text-bullet-accent">{game.kda}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>

        </div>
    );
}