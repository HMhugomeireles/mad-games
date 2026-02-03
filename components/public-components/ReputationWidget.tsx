// Componente de Reputação Avançado
export const ReputationWidget = ({ score, average }: { score: number, average: number }) => {
    // Cálculos Simples
    const diff = score - average;
    const isPositive = diff >= 0;
    const percentageDiff = Math.round((Math.abs(diff) / average) * 100);

    // Determinar Nível (Tier) baseado no score
    let tier = "NEUTRAL";
    let tierColor = "text-bullet-muted";

    if (score >= 900) { tier = "ELITE"; tierColor = "text-yellow-500"; }
    else if (score >= 750) { tier = "EXEMPLAR"; tierColor = "text-green-500"; }
    else if (score >= 600) { tier = "RESPECTED"; tierColor = "text-blue-400"; }
    else if (score < 400) { tier = "DISHONORABLE"; tierColor = "text-red-500"; }

    // Largura da barra (limitada a 100%)
    const barWidth = Math.min((score / 1000) * 100, 100);
    const avgPos = Math.min((average / 1000) * 100, 100);

    return (
        <div className="bg-black/20 border border-white/5 p-4 mt-4 relative group hover:border-bullet-accent/30 transition-colors">

            {/* 1. Header & Tier */}
            <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                    <span className="text-[10px] text-bullet-muted uppercase tracking-widest font-bold">Reputation Score</span>
                    <span className="text-3xl font-bold text-white tracking-tighter tabular-nums leading-none mt-1">
                        {score}
                        <span className="text-xs text-bullet-muted font-normal ml-1">/ 1000</span>
                    </span>
                </div>

                {/* Tier Badge */}
                <div className={`text-right ${tierColor}`}>
                    <div className="text-[10px] uppercase tracking-widest opacity-70">Standing</div>
                    <div className="text-lg font-bold uppercase tracking-wide drop-shadow-md">{tier}</div>
                </div>
            </div>

            {/* 2. Visual Bar (Player vs Average) */}
            <div className="relative h-6 w-full mt-2 mb-1">

                {/* Fundo da Barra (Track) */}
                <div className="absolute top-1/2 -translate-y-1/2 w-full h-1.5 bg-white/10 rounded-full overflow-hidden"></div>

                {/* Marcador da Média (Average Marker) */}
                <div
                    className="absolute top-0 bottom-0 w-[2px] bg-bullet-muted/50 z-10 flex flex-col items-center group/avg"
                    style={{ left: `${avgPos}%` }}
                >
                    {/* Tooltip da Média */}
                    <div className="absolute -top-4 text-[8px] bg-black px-1 border border-white/10 text-bullet-muted opacity-0 group-hover/avg:opacity-100 transition-opacity whitespace-nowrap">
                        AVG: {average}
                    </div>
                </div>

                {/* Barra de Progresso do Jogador */}
                <div
                    className={`absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full transition-all duration-1000 ${tierColor.replace('text-', 'bg-')}`}
                    style={{ width: `${barWidth}%` }}
                >
                    {/* Glow Effect na ponta */}
                    <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] ${tierColor.replace('text-', 'bg-')}`}></div>
                </div>
            </div>

            {/* 3. Footer: Comparação Estatística */}
            <div className="flex items-center gap-2 text-xs font-mono border-t border-white/5 pt-2 mt-2">
                <span className={`font-bold flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? '▲' : '▼'} {percentageDiff}%
                </span>
                <span className="text-bullet-muted uppercase tracking-wider text-[10px]">
                    {isPositive ? 'Above' : 'Below'} Players Average ({average})
                </span>
            </div>

            {/* Decoração de Canto */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20"></div>

        </div>
    );
};