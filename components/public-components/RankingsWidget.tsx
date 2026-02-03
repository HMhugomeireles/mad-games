'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

// --- TYPES & INTERFACES ---

type TrendDirection = 'up' | 'down' | 'same';
type GameType = 'MWII' | 'CS2' | 'VALORANT';
type FilterType = 'ALL' | GameType;
type TabType = 'OPERATORS' | 'UNITS';

interface BaseEntity {
    id: string;
    rank: number;
    name: string;
    game: number;
    score: number;
    trend: TrendDirection;
}

interface Player extends BaseEntity {
    kd: number;
    avatar?: string;
}

interface Team extends BaseEntity {
    members: number;
    logo?: string; // Iniciais ou URL
}

// --- MOCK DATA ---

const PLAYERS_DB: Player[] = [
    { id: 'p1', rank: 1, name: 'Ghost_Actual', game: 25, score: 9850, kd: 2.4, trend: 'up', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ghost' },
    { id: 'p2', rank: 2, name: 'S1mple_Clone', game: 33, score: 9720, kd: 1.9, trend: 'same', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Simple' },
    { id: 'p3', rank: 3, name: 'Jett_Main', game: 34, score: 9500, kd: 1.5, trend: 'down', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jett' },
    { id: 'p4', rank: 4, name: 'Price_Capt', game: 25, score: 8400, kd: 1.8, trend: 'up', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Price' },
    { id: 'p5', rank: 5, name: 'Soap_Mac', game: 25, score: 8100, kd: 1.6, trend: 'up', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Soap' },
    { id: 'p6', rank: 6, name: 'Viper_One', game: 34, score: 7900, kd: 1.2, trend: 'down', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Viper' },
];

const TEAMS_DB: Team[] = [
    { id: 't1', rank: 1, name: 'Task Force 141', game: 25, score: 45000, members: 12, trend: 'up', logo: 'T1' },
    { id: 't2', rank: 2, name: 'Navi Junior', game: 33, score: 42500, members: 5, trend: 'same', logo: 'NJ' },
    { id: 't3', rank: 3, name: 'Sentinels', game: 34, score: 39000, members: 6, trend: 'down', logo: 'SN' },
    { id: 't4', rank: 4, name: 'Shadow Company', game: 25, score: 36000, members: 20, trend: 'up', logo: 'SC' },
];

// --- TYPE GUARDS ---

const isPlayer = (item: Player | Team): item is Player => {
    return (item as Player).kd !== undefined;
};

// --- SUB-COMPONENTES VISUAIS ---

interface RankBadgeProps {
    rank: number;
}

const RankBadge: React.FC<RankBadgeProps> = ({ rank }) => {
    let colors = "bg-white/5 text-bullet-muted border-white/10";
    if (rank === 1) colors = "bg-yellow-500/20 text-yellow-500 border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]";
    if (rank === 2) colors = "bg-slate-300/20 text-slate-300 border-slate-300";
    if (rank === 3) colors = "bg-orange-700/20 text-orange-600 border-orange-700";

    return (
        <div className={`w-8 h-8 flex items-center justify-center border font-bold text-sm ${colors}`}>
            {rank}
        </div>
    );
};

interface TrendIconProps {
    trend: TrendDirection;
}

const TrendIcon: React.FC<TrendIconProps> = ({ trend }) => {
    if (trend === 'up') return <span className="text-green-500 text-[10px]">▲</span>;
    if (trend === 'down') return <span className="text-red-500 text-[10px]">▼</span>;
    return <span className="text-bullet-muted text-[10px]">-</span>;
};

// --- COMPONENTE PRINCIPAL ---

export function RankingsWidget() {
    const [activeTab, setActiveTab] = useState<TabType>('OPERATORS');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [gameFilter, setGameFilter] = useState<FilterType>('ALL');

    // Lógica de Filtragem com TypeScript
    const filteredData = useMemo(() => {
        // Definimos explicitamente que a DB pode ser Array de Players ou Teams
        const db: (Player | Team)[] = activeTab === 'OPERATORS' ? PLAYERS_DB : TEAMS_DB;

        return db.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesGame = gameFilter === 'ALL';
            return matchesSearch && matchesGame;
        });
    }, [activeTab, searchTerm, gameFilter]);

    const filters: FilterType[] = ['ALL', 'MWII', 'CS2', 'VALORANT'];

    return (
        <div className="w-full bg-bullet-dark/50 border border-white/10 p-1 font-mono">

            {/* 1. HEADER & FILTROS (Topo) */}
            <div className="bg-bullet-panel p-6 border-b border-white/5">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6">

                    <div>
                        <h2 className="text-2xl text-white font-normal uppercase tracking-wide">
                            Global Leaderboards
                        </h2>
                        <p className="text-bullet-muted text-xs tracking-widest mt-1">
                            Top performing assets across all sectors.
                        </p>
                    </div>

                    {/* Filtros Rápidos */}
                    <div className="flex gap-2">
                        {filters.map(game => (
                            <button
                                key={game}
                                onClick={() => setGameFilter(game)}
                                className={`
                  px-3 py-1 text-[10px] font-bold uppercase tracking-widest border transition-all
                  ${gameFilter === game
                                        ? 'bg-bullet-accent text-bullet-dark border-bullet-accent'
                                        : 'bg-transparent text-bullet-muted border-white/10 hover:border-white/30 hover:text-white'}
                `}
                            >
                                {game}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Bar Tática */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-bullet-muted">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input
                        type="text"
                        placeholder={`SEARCH ${activeTab}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 text-white text-sm p-3 pl-10 outline-none focus:border-bullet-accent transition-colors font-mono uppercase tracking-wide placeholder-bullet-muted"
                    />
                    <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-bullet-muted/20 to-transparent pointer-events-none"></div>
                </div>
            </div>

            {/* 2. TABS (Abas) */}
            <div className="flex border-b border-white/10 bg-black/20">
                <button
                    onClick={() => setActiveTab('OPERATORS')}
                    className={`
            flex-1 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all relative
            ${activeTab === 'OPERATORS' ? 'text-white bg-white/5' : 'text-bullet-muted hover:text-white hover:bg-white/5'}
          `}
                >
                    Operators (All Games)
                    {activeTab === 'OPERATORS' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-bullet-accent shadow-[0_0_10px_var(--color-bullet-accent)]"></div>}
                </button>

                <button
                    onClick={() => setActiveTab('UNITS')}
                    className={`
            flex-1 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all relative
            ${activeTab === 'UNITS' ? 'text-white bg-white/5' : 'text-bullet-muted hover:text-white hover:bg-white/5'}
          `}
                >
                    Units (Teams)
                    {activeTab === 'UNITS' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-bullet-accent shadow-[0_0_10px_var(--color-bullet-accent)]"></div>}
                </button>
            </div>

            {/* 3. LISTA / TABELA */}
            <div className="bg-bullet-dark min-h-[400px]">

                {/* Cabeçalho da Tabela */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-[10px] text-bullet-muted uppercase tracking-widest font-bold">
                    <div className="col-span-1 text-center">Rank</div>
                    <div className="col-span-1 text-center">Trend</div>
                    <div className="col-span-4">{activeTab === 'OPERATORS' ? 'Operator' : 'Unit Name'}</div>
                    <div className="col-span-2 hidden md:block">Games played</div>
                    <div className="col-span-2 text-center">{activeTab === 'OPERATORS' ? 'K/D Ratio' : 'Members'}</div>
                    <div className="col-span-2 text-right">Score</div>
                </div>

                {/* Linhas da Tabela */}
                <div className="divide-y divide-white/5">
                    {filteredData.length > 0 ? (
                        filteredData.map((item) => {
                            // Determina a Rota baseada no Tipo
                            const linkTarget = isPlayer(item) ? `/operator/${item.id}` : `/team/${item.id}`;

                            return (
                                <Link key={item.id} href={linkTarget} className="block group">
                                    <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/5 transition-colors cursor-pointer border-l-2 border-transparent hover:border-bullet-accent">

                                        {/* Rank */}
                                        <div className="col-span-1 flex justify-center">
                                            <RankBadge rank={item.rank} />
                                        </div>

                                        {/* Trend */}
                                        <div className="col-span-1 flex justify-center opacity-70">
                                            <TrendIcon trend={item.trend} />
                                        </div>

                                        {/* Nome & Avatar/Logo */}
                                        <div className="col-span-4 flex items-center gap-3">
                                            <div className="w-8 h-8 bg-bullet-panel border border-white/10 overflow-hidden flex items-center justify-center">
                                                {isPlayer(item) ? (
                                                    item.avatar ? (
                                                        <img src={item.avatar} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-bullet-muted">{item.name[0]}</span>
                                                    )
                                                ) : (
                                                    <div className="text-[10px] font-bold text-bullet-muted group-hover:text-white">
                                                        {(item as Team).logo}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-sm font-bold text-white tracking-wide group-hover:text-bullet-accent transition-colors uppercase truncate">
                                                {item.name}
                                            </span>
                                        </div>

                                        {/* Jogo */}
                                        <div className="col-span-2 hidden md:flex items-center">
                                            <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 text-bullet-muted uppercase tracking-wider">
                                                {item.game}
                                            </span>
                                        </div>

                                        {/* Stats Secundário (KD ou Members) */}
                                        <div className="col-span-2 text-center font-mono text-bullet-muted text-xs">
                                            {isPlayer(item) ? item.kd.toFixed(2) : (item as Team).members}
                                        </div>

                                        {/* Score Principal */}
                                        <div className="col-span-2 text-right font-mono font-bold text-bullet-accent text-sm">
                                            {item.score.toLocaleString()}
                                        </div>

                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <div className="p-12 text-center text-bullet-muted text-xs uppercase tracking-widest">
                            No data found matching parameters.
                        </div>
                    )}
                </div>

                {/* Paginação Footer */}
                <div className="p-4 border-t border-white/5 flex justify-center gap-4 text-xs text-bullet-muted font-bold">
                    <button className="hover:text-white transition-colors">&lt; PREV</button>
                    <span className="text-bullet-accent">PAGE 1 / 5</span>
                    <button className="hover:text-white transition-colors">NEXT &gt;</button>
                </div>

            </div>
        </div>
    );
}