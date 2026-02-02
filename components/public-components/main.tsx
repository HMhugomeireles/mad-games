'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PrimaryButton, SecondaryButton } from './ui/button';


// --- MOCK DATA ---
const GAMES = ['GERAL', 'TEAMS'];

const EVENTS = [
  { id: 1, title: "Dark Fall", game: "Avecar", date: "26 OCT 18:00", prize: "5000 TK", status: "UPCOMING", image: "https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/mw2/meta/mw2-season-03-reveal-meta.jpg" },
  { id: 2, title: "Tactical Moon", game: "Stunhouse", date: "28 OCT 20:00", prize: "2000 TK", status: "UPCOMING", image: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/e49d68512701d7e23a3cb065c71b69f82d410757-1920x1080.jpg" },
  { id: 3, title: "Only Bracket", game: "Arena 24", date: "30 OCT 15:00", prize: "1000 TK", status: "REGISTRATION", image: "https://pbs.twimg.com/media/FuW89mHWcAEnqx_.jpg:large" },
];

const RANKINGS = {
  'GERAL': [
    { rank: 1, name: "Ghost_Actual", score: 2450, trend: 'up' as const },
    { rank: 2, name: "SoapMactavish", score: 2310, trend: 'same' as const },
    { rank: 3, name: "Gaz_Bravo", score: 2100, trend: 'down' as const },
    { rank: 4, name: "Price_Capt", score: 1950, trend: 'up' as const },
    { rank: 5, name: "Roach", score: 1840, trend: 'up' as const },
  ],
  'TEAMS': [
    { rank: 1, name: "S1mple_Clone", score: 3000, trend: 'same' as const },
    { rank: 2, name: "Zywoo_Bot", score: 2950, trend: 'up' as const },
    { rank: 3, name: "Niko_Aim", score: 2800, trend: 'down' as const },
  ]
};

const NEWS = [
  { id: 1, date: "TODAY", title: "Patch Notes v.4.0.2 deployed", category: "SYSTEM" },
  { id: 2, date: "YESTERDAY", title: "New map 'District' added to rotation", category: "CONTENT" },
  { id: 3, date: "22 OCT", title: "Server maintenance scheduled for 04:00", category: "ALERT" },
];

// --- COMPONENTES VISUAIS ---

// Cartão de Evento
const EventCard = ({ event }: { event: { id: number; title: string; game: string; date: string; prize: string; status: string; image: string } }) => (
  <div className="group relative h-64 border border-white/5 bg-bullet-panel hover:border-bullet-accent/50 transition-all overflow-hidden cursor-pointer">
    {/* Imagem de Fundo com Overlay */}
    <div
      className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500 grayscale group-hover:grayscale-0"
      style={{ backgroundImage: `url('${event.image}')` }}
    ></div>
    <div className="absolute inset-0 bg-gradient-to-t from-bullet-dark via-bullet-dark/50 to-transparent"></div>

    {/* Status Badge */}
    <div className="absolute top-4 right-4">
      {event.status === 'LIVE' ? (
        <span className="flex items-center gap-2 bg-red-500/20 border border-red-500 text-red-500 text-[10px] font-bold px-2 py-1 uppercase tracking-widest animate-pulse">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Live
        </span>
      ) : (
        <span className="bg-black/60 border border-white/10 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
          {event.status}
        </span>
      )}
    </div>

    {/* Conteúdo */}
    <div className="absolute bottom-0 left-0 w-full p-6">
      <div className="text-bullet-accent text-[10px] font-bold uppercase tracking-widest mb-1">{event.game}</div>
      <h3 className="text-xl text-white font-bold uppercase tracking-wide mb-2 group-hover:text-bullet-accent transition-colors">{event.title}</h3>

      <div className="flex items-center gap-4 text-xs text-bullet-muted font-mono">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          {event.date}
        </span>
        <span className="flex items-center gap-1 text-yellow-500">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" opacity="0.2" /><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" /></svg>
          {event.prize}
        </span>
      </div>
    </div>
  </div>
);

// Linha do Ranking
const RankingRow = ({ rank, player }: { rank: number; player: { name: string; score: number; trend: 'up' | 'down' | 'same' } }) => (
  <div className="flex items-center justify-between py-2 px-3 border-b border-white/5 hover:bg-white/5 transition-colors text-xs font-mono group cursor-pointer">
    <div className="flex items-center gap-3">
      <span className={`
        w-6 h-6 flex items-center justify-center font-bold
        ${rank === 1 ? 'bg-bullet-accent text-bullet-dark' : 'bg-white/10 text-bullet-muted'}
      `}>
        {rank}
      </span>
      <span className={`uppercase font-bold tracking-wide ${rank === 1 ? 'text-white' : 'text-bullet-muted group-hover:text-white'}`}>
        {player.name}
      </span>
    </div>

    <div className="flex items-center gap-4">
      <span className="text-white tabular-nums">{player.score}</span>
      {/* Indicador de Tendência */}
      <span className="w-4 flex justify-center">
        {player.trend === 'up' && <span className="text-green-500">▲</span>}
        {player.trend === 'down' && <span className="text-red-500">▼</span>}
        {player.trend === 'same' && <span className="text-bullet-muted">-</span>}
      </span>
    </div>
  </div>
);

// --- PÁGINA PRINCIPAL ---

export default function HomePage() {
  const [activeRankingTab, setActiveRankingTab] = useState<keyof typeof RANKINGS>('GERAL');

  return (
    <div className="min-h-screen bg-bullet-dark font-mono text-bullet-text pb-20">

      {/* --- 1. HERO SECTION --- */}
      <section className="relative h-[60vh] flex items-center border-b border-white/10 overflow-hidden">

        {/* Content */}
        <div className="relative z-10 max-w-[1600px] mx-auto px-8 w-full flex flex-col justify-center h-full">
          <div className="inline-flex items-center gap-2 text-bullet-accent text-xs font-bold uppercase tracking-[0.3em] mb-4">
            <div className="w-2 h-2 bg-bullet-accent animate-pulse"></div>
            System Online
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mb-2 leading-none">
            Deploy <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-bullet-accent to-white">Into Action</span>
          </h1>

          <p className="max-w-xl text-bullet-muted text-sm md:text-base leading-relaxed mb-8 border-l-2 border-bullet-accent pl-4">
            Welcome to the ultimate competitive ecosystem. Track your stats,
            join elite events, and dominate the leaderboard.
            Player to win, player for fun.
            Verify your loadout before entry.
          </p>

          <div className="flex flex-wrap gap-4">
            <PrimaryButton onClick={() => console.log('Join')}>
              Creacte Account
            </PrimaryButton>
          </div>
        </div>

        {/* Decorative Grid Right */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 border-l border-white/5 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </section>

      {/* --- 2. GLOBAL STATS STRIP --- */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-8 py-4 flex flex-wrap justify-between items-center gap-8 text-xs uppercase tracking-widest text-bullet-muted">
          <div className="flex items-center gap-2">
            <span className="text-bullet-accent font-bold">200</span> Games playerd
          </div>
          <div className="hidden md:block w-[1px] h-4 bg-white/10"></div>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">50</span> Active Members
          </div>
          <div className="hidden md:block w-[1px] h-4 bg-white/10"></div>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">1,000€</span> Total Prize Pool
          </div>

          <div className="ml-auto flex items-center gap-2 text-[10px] opacity-60">
            <span>Server Time:</span>
            <span className="text-white">14:02 UTC</span>
          </div>
        </div>
      </div>

      {/* --- 3. MAIN CONTENT GRID --- */}
      <div className="max-w-[1600px] mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* === ESQUERDA: EVENTOS (2/3) === */}
        <div className="lg:col-span-2 space-y-8">

          {/* Section Header */}
          <div className="flex items-end justify-between border-b border-white/10 pb-4">
            <h2 className="text-2xl text-white uppercase font-bold tracking-wide">
              Progamati Operations Programati Events
            </h2>
            <Link href="/events" className="text-bullet-accent text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
              View All Events &rarr;
            </Link>
          </div>

          {/* Featured Event (Large) */}
          <div className="relative h-96 w-full border border-bullet-accent/50 group cursor-pointer overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt5f5c862363162331/6359b35b62796c56782488a0/Valorant_2022_KeyArt_4k-02.jpg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

            <div className="absolute bottom-0 left-0 p-8 w-full">
              <span className="bg-bullet-accent text-bullet-dark font-bold px-2 py-1 text-xs uppercase tracking-widest mb-2 inline-block">
                Featured Event
              </span>
              <h3 className="text-4xl font-black text-white uppercase italic mb-2">
                Stunhouse: Glory
              </h3>
              <p className="text-bullet-muted max-w-lg mb-6 text-sm">
                Join the elite. Tactical games.
                4 games 2 Squads. Prove your dominance in the arena and claim your points.
              </p>
              <PrimaryButton>Register player</PrimaryButton>
            </div>
          </div>

          {/* Secondary Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EVENTS.map(event => <EventCard key={event.id} event={event} />)}
          </div>

        </div>

        {/* === DIREITA: SIDEBAR (1/3) === */}
        <aside className="space-y-12">

          {/* WIDGET 1: LEADERBOARDS */}
          <div className="bg-bullet-panel border border-white/5 p-1">
            <div className="bg-bullet-dark/50 p-4 border-b border-white/5 mb-2">
              <h3 className="text-bullet-accent text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" /></svg>
                Global Rankings
              </h3>
            </div>

            {/* Tabs de Jogo */}
            <div className="flex border-b border-white/5 mb-2">
              {GAMES.map(game => (
                <button
                  key={game}
                  onClick={() => setActiveRankingTab(game as keyof typeof RANKINGS)}
                  className={`
                      flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors
                      ${activeRankingTab === game ? 'text-white bg-white/5 border-b-2 border-bullet-accent' : 'text-bullet-muted hover:text-white hover:bg-white/5'}
                    `}
                >
                  {game.split(' ')[0]} {/* Mostra so a primeira palavra para caber */}
                </button>
              ))}
            </div>

            {/* Lista do Top 5 */}
            <div className="px-2 pb-2">
              <div className="flex justify-between text-[10px] text-bullet-muted uppercase px-3 py-2">
                <span>Operator</span>
                <span>Rating</span>
              </div>
              {RANKINGS[activeRankingTab].map(player => (
                <RankingRow key={player.rank} rank={player.rank} player={player} />
              ))}
            </div>

            <div className="p-3 border-t border-white/5 text-center">
              <button className="text-[10px] text-bullet-accent hover:text-white uppercase tracking-widest font-bold">
                View Full Leaderboard
              </button>
            </div>
          </div>

          {/* WIDGET 
          
          <h3 className="text-white text-sm font-bold uppercase tracking-[0.2em] mb-4 border-l-4 border-bullet-accent pl-3">
            Latest Intel
          </h3>

          <div className="space-y-4">
            {NEWS.map((news) => (
              <div key={news.id} className="group relative pl-4 border-l border-white/10 hover:border-bullet-accent transition-colors cursor-pointer">
                <div className="text-[10px] text-bullet-muted font-bold tracking-widest mb-1 flex justify-between">
                  <span>{news.date}</span>
                  <span className="text-bullet-accent opacity-50 group-hover:opacity-100">[{news.category}]</span>
                </div>
                <h4 className="text-sm text-white font-bold uppercase leading-tight group-hover:text-bullet-accent transition-colors">
                  {news.title}
                </h4>
              </div>
            ))}
          </div>
          
          
          / NEWS */}
          <div>

            {/* Ad Space / Banner interno */}
            <div className="mt-8 relative h-32 border border-white/10 bg-black/40 flex items-center justify-center overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)]"></div>
              <div className="text-center z-10">
                <div className="text-bullet-accent text-xs font-bold uppercase tracking-widest mb-1">Premium Access</div>
                <div className="text-white font-bold">Buy games tickets</div>
              </div>
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-bullet-accent group-hover:w-full transition-all duration-500"></div>
            </div>

          </div>

        </aside>

      </div>

    </div>
  );
}