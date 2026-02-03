'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// --- MOCK DATA (Dados Fictícios de um Evento Concluído) ---
const EVENT_DATA = {
    id: "OP-Red-Storm",
    title: "Operation: Red Storm",
    date: "2023-11-12",
    time: "09:00 - 17:00",
    location: "Factory Zone, Porto",
    status: "COMPLETED", // 'UPCOMING' | 'LIVE' | 'COMPLETED'
    image: "data:image/jpeg;base64,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",
    satisfaction: 4.8, // 0 to 5
    totalReviews: 124,

    // Tab 1: Briefing
    briefing: `
    Intel suggests insurgent forces have seized the abandoned factory sector. 
    Your mission is to infiltrate, secure three key objectives (Alpha, Bravo, Charlie), and extract the HVT.
    Expect heavy resistance and close-quarters combat (CQB).
    
    Rules of Engagement:
    - Semi-only inside buildings.
    - Pyro grenades allowed in open areas only.
    - Medic rule: 1 bandage revive per life.
  `,

    // Tab 2: Roster (Factions & Squads)
    factions: [
        {
            name: "Delta force",
            color: "text-blue-400",
            squads: [
                { name: "Alpha Squad", members: ["Ghost", "Soap", "Price", "Gaz"] },
                { name: "Bravo Squad", members: ["Roach", "Meatball", "Sandman", "Grinch"] }
            ]
        },
        {
            name: "Pirate Company",
            color: "text-red-500",
            squads: [
                { name: "Viper Squad", members: ["Graves", "Lerch", "Velikan", "Mace"] },
                { name: "Cobra Squad", members: ["Rozlin", "Stitch", "Naga", "Jackal"] }
            ]
        }
    ],

    // Tab 3: Field Info
    field: {
        name: "Factory Zone Alpha",
        type: "Urban / CQB",
        size: "50,000 m²",
        weather: "Overcast, 18°C",
        mapImage: "https://i.pinimg.com/originals/3d/02/76/3d0276d1406839bc46a161877d903930.jpg" // Placeholder tático
    },

    // Tab 4: Rankings (Debrief)
    results: {
        winner: "Task Force 141",
        score: "1450 - 1200",
        missions: [
            { name: "Secure Alpha", winner: "TF 141", points: 500 },
            { name: "Defend Bravo", winner: "Shadow Co.", points: 300 },
            { name: "Extract HVT", winner: "TF 141", points: 650 },
            { name: "Intel Retrieval", winner: "Shadow Co.", points: 200 }
        ],
        topPlayers: [
            { rank: 1, name: "Ghost", faction: "TF 141", score: 4200, kda: "24/5" },
            { rank: 2, name: "Graves", faction: "Shadow Co.", score: 3950, kda: "20/8" },
            { rank: 3, name: "Soap", faction: "TF 141", score: 3800, kda: "18/6" },
            { rank: 4, name: "Velikan", faction: "Shadow Co.", score: 3100, kda: "15/10" },
            { rank: 5, name: "Price", faction: "TF 141", score: 2900, kda: "14/4" },
        ]
    }
};

// --- SUB-COMPONENTES ---

// Avaliação de Estrelas
const SatisfactionRating = ({ rating, count }: { rating: number, count: number }) => (
    <div className="flex flex-col items-end">
        <div className="flex items-center gap-1 text-bullet-accent">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className={`w-5 h-5 ${star <= Math.round(rating) ? 'fill-current' : 'text-white/20 fill-current'}`} viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            ))}
            <span className="ml-2 text-xl font-bold text-white">{rating}</span>
        </div>
        <span className="text-[10px] text-bullet-muted uppercase tracking-widest">
            Based on {count} Operator Reports
        </span>
    </div>
);

// --- PÁGINA PRINCIPAL ---

export default function EventDetailsPage() {
    const [activeTab, setActiveTab] = useState('OPORD'); // OPORD, ROSTER, INTEL, DEBRIEF
    const [rankFilter, setRankFilter] = useState('PLAYERS'); // PLAYERS, MISSIONS

    const e = EVENT_DATA;
    const isCompleted = e.status === 'COMPLETED';

    return (
        <div className="min-h-screen bg-bullet-dark font-mono text-white pb-20">

            {/* 1. HERO HEADER (Imagem e Info Base) */}
            <div className="relative h-[50vh] w-full border-b border-white/10 overflow-hidden">
                {/* Imagem Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center grayscale opacity-60"
                    style={{ backgroundImage: `url('${e.image}')` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-bullet-dark via-bullet-dark/50 to-transparent"></div>

                {/* Conteúdo do Header - CORREÇÃO AQUI */}
                {/* Adicionado 'right-0' para funcionar com o mx-auto e centralizar */}
                <div className="absolute bottom-0 left-0 right-0 w-full p-8 max-w-[1600px] mx-auto flex flex-col md:flex-row items-end justify-between gap-6">

                    <div>
                        {/* Status Badge */}
                        <div className={`
                inline-block px-3 py-1 mb-3 text-xs font-bold uppercase tracking-widest border
                ${isCompleted ? 'bg-white/10 border-white/30 text-white' : 'bg-bullet-accent text-bullet-dark border-bullet-accent'}
            `}>
                            {e.status}
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wide leading-none mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                            {e.title}
                        </h1>

                        <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm text-bullet-muted font-bold tracking-wider">
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-bullet-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                {e.date} | {e.time}
                            </span>
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-bullet-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {e.location}
                            </span>
                        </div>
                    </div>

                    {/* Rating (Só aparece se concluído) */}
                    {isCompleted && (
                        <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-4 rounded-sm">
                            <div className="text-[10px] text-bullet-accent font-bold uppercase tracking-[0.2em] mb-1 text-right">
                                Mission Rating
                            </div>
                            <SatisfactionRating rating={e.satisfaction} count={e.totalReviews} />
                        </div>
                    )}

                </div>
            </div>

            {/* 2. TABS NAVIGATION */}
            <div className="sticky top-0 z-40 bg-bullet-dark/95 backdrop-blur border-b border-white/10">
                <div className="max-w-[1600px] mx-auto flex overflow-x-auto">
                    {['OPORD', 'ROSTER', 'FIELD INTEL', isCompleted ? 'DEBRIEF' : null].filter(Boolean).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as string)}
                            className={`
                px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] transition-all relative whitespace-nowrap
                ${activeTab === tab ? 'text-bullet-accent bg-white/5' : 'text-bullet-muted hover:text-white'}
              `}
                        >
                            {tab === 'OPORD' && 'Briefing'}
                            {tab === 'ROSTER' && 'Squads'}
                            {tab === 'FIELD INTEL' && 'Map & Intel'}
                            {tab === 'DEBRIEF' && 'AAR / Rankings'}

                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-bullet-accent shadow-[0_0_15px_var(--color-bullet-accent)]"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. MAIN CONTENT AREA */}
            <div className="max-w-[1600px] mx-auto p-8 min-h-[500px]">

                {/* --- TAB: BRIEFING --- */}
                {activeTab === 'OPORD' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="lg:col-span-2">
                            <h2 className="text-2xl text-white font-bold uppercase tracking-wide mb-6 border-l-4 border-bullet-accent pl-4">
                                Operation Order
                            </h2>
                            <div className="prose prose-invert prose-sm max-w-none font-mono text-bullet-muted whitespace-pre-line leading-relaxed">
                                {e.briefing}
                            </div>
                        </div>
                        {/* Sidebar de Regras Rápidas */}
                        <div className="bg-bullet-panel border border-white/10 p-6 h-fit">
                            <h3 className="text-bullet-accent text-sm font-bold uppercase tracking-widest mb-4">
                                Directives
                            </h3>
                            <ul className="space-y-3 text-xs text-white">
                                <li className="flex items-start gap-3">
                                    <span className="text-bullet-accent">01 //</span>
                                    <span>Safety glasses mandatory at all times.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-bullet-accent">02 //</span>
                                    <span>FPS Limit: 370 (0.20g BBs).</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-bullet-accent">03 //</span>
                                    <span>Dead rags required for elimination.</span>
                                </li>
                            </ul>
                            <div className="mt-8 pt-6 border-t border-white/10">
                                <button className="w-full bg-white/5 hover:bg-bullet-accent hover:text-bullet-dark text-white border border-white/20 hover:border-bullet-accent text-xs font-bold py-3 uppercase tracking-widest transition-all">
                                    Download Full PDF
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB: ROSTER --- */}
                {activeTab === 'ROSTER' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {e.factions.map((faction, idx) => (
                            <div key={idx} className="bg-bullet-panel border border-white/5 overflow-hidden">
                                {/* Faction Header */}
                                <div className={`p-4 border-b border-white/10 flex justify-between items-center bg-black/20 ${faction.color}`}>
                                    <h3 className="font-bold uppercase tracking-widest text-lg">{faction.name}</h3>
                                    <div className="text-[10px] font-bold border border-current px-2 py-0.5 opacity-70">
                                        FACTION
                                    </div>
                                </div>

                                {/* Squads List */}
                                <div className="p-6 space-y-6">
                                    {faction.squads.map((squad, sIdx) => (
                                        <div key={sIdx}>
                                            <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                                <div className="w-1 h-3 bg-bullet-muted"></div>
                                                {squad.name}
                                            </h4>
                                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {squad.members.map((member, mIdx) => (
                                                    <li key={mIdx} className="flex items-center gap-3 bg-white/5 p-2 border-l-2 border-transparent hover:border-bullet-accent transition-colors">
                                                        <div className="w-6 h-6 bg-black/50 flex items-center justify-center text-[10px] font-bold text-bullet-muted">
                                                            {member[0]}
                                                        </div>
                                                        <span className="text-sm text-bullet-muted uppercase">{member}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- TAB: FIELD INTEL --- */}
                {activeTab === 'FIELD INTEL' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Coluna do Mapa */}
                        <div className="lg:col-span-2 relative group bg-black border border-white/10 overflow-hidden min-h-[400px]">
                            {/* Grelha Overlay */}
                            <div className="absolute inset-0 pointer-events-none z-10 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                            {/* Imagem do Mapa */}
                            <div
                                className="absolute inset-0 bg-cover bg-center grayscale opacity-60 group-hover:opacity-100 transition-opacity duration-500 scale-100 group-hover:scale-105"
                                style={{ backgroundImage: `url('${e.field.mapImage}')` }}
                            ></div>

                            {/* Pontos de Interesse (POIs) - Exemplo */}
                            <div className="absolute top-1/3 left-1/4 z-20 flex flex-col items-center group/marker">
                                <div className="w-4 h-4 bg-bullet-accent rounded-full animate-ping absolute"></div>
                                <div className="w-4 h-4 bg-bullet-accent rounded-full border-2 border-black relative"></div>
                                <span className="mt-1 bg-black/80 text-bullet-accent text-[10px] px-1 font-bold">OBJ ALPHA</span>
                            </div>
                        </div>

                        {/* Coluna de Dados do Campo */}
                        <div className="space-y-6">
                            <div className="bg-bullet-panel p-6 border-l-4 border-bullet-accent">
                                <h3 className="text-xl text-white font-bold uppercase tracking-wide mb-1">{e.field.name}</h3>
                                <p className="text-bullet-muted text-xs uppercase tracking-widest">{e.field.type}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 border border-white/5">
                                    <div className="text-[10px] text-bullet-muted uppercase tracking-widest mb-1">Grid Size</div>
                                    <div className="text-white font-bold">{e.field.size}</div>
                                </div>
                                <div className="bg-white/5 p-4 border border-white/5">
                                    <div className="text-[10px] text-bullet-muted uppercase tracking-widest mb-1">Weather Intel</div>
                                    <div className="text-bullet-accent font-bold">{e.field.weather}</div>
                                </div>
                            </div>

                            <div className="bg-black/40 p-6 border border-white/5 text-xs text-bullet-muted leading-relaxed">
                                <strong className="text-white uppercase block mb-2">Tactical Assessment:</strong>
                                Multiple entry points. Verticality is key in the central warehouse.
                                Expect long-range engagements on the perimeter and intense CQB in the center.
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB: DEBRIEF / RANKINGS --- */}
                {activeTab === 'DEBRIEF' && isCompleted && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Winner Banner */}
                        <div className="relative bg-gradient-to-r from-blue-900/40 to-transparent border-l-4 border-blue-500 p-8 mb-12 overflow-hidden">
                            <div className="relative z-10">
                                <div className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.3em] mb-2">Operation Victor</div>
                                <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic">{e.results.winner}</h2>
                                <div className="mt-2 text-2xl font-mono text-white/80">Final Score: {e.results.score}</div>
                            </div>
                            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-500/10 to-transparent skew-x-12"></div>
                        </div>

                        {/* Sub-Tabs de Ranking */}
                        <div className="flex gap-4 mb-6 border-b border-white/10 pb-1">
                            <button
                                onClick={() => setRankFilter('PLAYERS')}
                                className={`text-sm font-bold uppercase tracking-widest pb-2 border-b-2 transition-colors ${rankFilter === 'PLAYERS' ? 'text-white border-bullet-accent' : 'text-bullet-muted border-transparent hover:text-white'}`}
                            >
                                Operator Rankings
                            </button>
                            <button
                                onClick={() => setRankFilter('MISSIONS')}
                                className={`text-sm font-bold uppercase tracking-widest pb-2 border-b-2 transition-colors ${rankFilter === 'MISSIONS' ? 'text-white border-bullet-accent' : 'text-bullet-muted border-transparent hover:text-white'}`}
                            >
                                Mission Breakdown
                            </button>
                        </div>

                        {/* Tabela de Rankings */}
                        {rankFilter === 'PLAYERS' ? (
                            <div className="bg-black/20 border border-white/5">
                                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-white/5 text-[10px] text-bullet-muted uppercase tracking-widest font-bold">
                                    <div className="col-span-1 text-center">Rank</div>
                                    <div className="col-span-5">Operator</div>
                                    <div className="col-span-3">Faction</div>
                                    <div className="col-span-2 text-center">K/D/A</div>
                                    <div className="col-span-1 text-right">Score</div>
                                </div>
                                <div className="divide-y divide-white/5">
                                    {e.results.topPlayers.map((p) => (
                                        <div key={p.rank} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/5 transition-colors">
                                            <div className="col-span-1 flex justify-center">
                                                <div className={`w-8 h-8 flex items-center justify-center font-bold text-sm ${p.rank === 1 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500' : 'bg-white/5 text-bullet-muted'}`}>
                                                    {p.rank}
                                                </div>
                                            </div>
                                            <div className="col-span-5 font-bold text-white uppercase">{p.name}</div>
                                            <div className="col-span-3 text-xs text-bullet-muted uppercase">{p.faction}</div>
                                            <div className="col-span-2 text-center font-mono text-white">{p.kda}</div>
                                            <div className="col-span-1 text-right font-mono font-bold text-bullet-accent">{p.score}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {e.results.missions.map((mission, idx) => (
                                    <div key={idx} className="bg-bullet-panel p-6 border border-white/5 flex justify-between items-center group hover:border-bullet-accent transition-colors">
                                        <div>
                                            <div className="text-[10px] text-bullet-muted uppercase tracking-widest mb-1">Objective {idx + 1}</div>
                                            <h3 className="text-lg font-bold text-white uppercase">{mission.name}</h3>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-xl font-bold uppercase ${mission.winner === 'TF 141' ? 'text-blue-400' : 'text-red-500'}`}>
                                                {mission.winner}
                                            </div>
                                            <div className="text-xs font-mono text-bullet-muted">+{mission.points} PTS</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                )}

            </div>

        </div>
    );
}