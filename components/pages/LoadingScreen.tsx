'use client';

import React, { useState, useEffect } from 'react';

// --- DADOS: Dicas de Jogo ---
const gameTips = [
  "Nullam et mollis ante, sed congue leo. Aenean facilisis.",
  "Remember to check your corners when entering a hostile building.",
  "Use smoke grenades to cover your team's movement across open areas.",
  "Switching to your pistol is always faster than reloading.",
  "Communication is key. Use your microphone to call out enemy positions.",
  "Complete daily objectives to earn extra Battle Tokens.",
];

export default function LoadingScreen({ onFinished = () => console.log("Loading finished, proceed to main app...") }: { onFinished?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState("");

  // 1. Escolher uma dica aleatória ao montar
  useEffect(() => {
    const randomTip = gameTips[Math.floor(Math.random() * gameTips.length)];
    setCurrentTip(randomTip);
  }, []);

  // 2. Simular o progresso de carregamento
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        // Simula variação de velocidade (mais rápido no início, lento no fim)
        const increment = Math.random() * (prev > 80 ? 2 : 15);
        const newProgress = prev + increment;

        if (newProgress >= 100) {
          clearInterval(interval);
          // Pequeno delay antes de "terminar" visualmente
          setTimeout(() => {
             if (onFinished) onFinished(); 
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onFinished]);

  return (
    <div className="fixed inset-0 z-50 bg-bullet-dark flex flex-col justify-end font-mono select-none">
      
      {/* --- BACKGROUND --- */}
      {/* Imagem do Soldado (Fundo) - Escurecida */}
      <div className="absolute inset-0 z-0">
         {/* Substituir pelo caminho real da tua imagem de soldado */}
         <div className="absolute inset-0 bg-[url('https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/mw2/meta/mw2-season-03-reveal-meta.jpg')] bg-cover bg-center opacity-20 grayscale mix-blend-overlay"></div>
         {/* Gradiente para escurecer, especialmente no fundo onde está o texto */}
         <div className="absolute inset-0 bg-gradient-to-t from-bullet-dark via-bullet-dark/80 to-bullet-dark/90"></div>
      </div>

      {/* --- CONTEÚDO INFERIOR --- */}
      <div className="relative z-10 w-full pb-8 px-12">
        
        {/* Container Flex para Texto "Loading" e "Game Tip" */}
        <div className="flex items-end justify-between mb-2">
          
          {/* Esquerda: Texto Loading */}
          <div className="text-xl text-bullet-muted uppercase tracking-widest animate-pulse">
            Loading...
          </div>

          {/* Direita: Game Tip */}
          <div className="max-w-xl text-right">
            <div className="text-[10px] uppercase font-bold text-bullet-accent tracking-[0.2em] mb-1 opacity-80">
              Game Tip
            </div>
            <p className="text-sm text-bullet-text/70 leading-relaxed">
              {currentTip}
            </p>
          </div>
        </div>

        {/* --- BARRA DE PROGRESSO --- */}
        <div className="w-full h-[6px] bg-white/5 relative overflow-hidden">
          {/* A Barra Laranja */}
          <div 
            className="h-full bg-bullet-accent shadow-[0_0_15px_var(--color-bullet-accent)] transition-all duration-200 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            {/* Brilho na ponta da barra */}
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
          </div>
        </div>

      </div>
    </div>
  );
}