'use client';

import React, { useState, useEffect } from 'react';

export default function GamePage() {
  const [showQuitModal, setShowQuitModal] = useState(false);

  // Exemplo: Abrir modal ao pressionar ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowQuitModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleQuit = () => {
    console.log("Quitting game...");
    // Lógica para sair ou redirecionar
    setShowQuitModal(false);
  };

  return (
    <div className="min-h-screen bg-bullet-dark text-white p-8">
      
      <h1 className="text-4xl mb-4">GAMEPLAY ACTIVE</h1>
      <p className="text-bullet-muted">Press <span className="text-bullet-accent font-bold">[ESC]</span> to test the quit modal.</p>

      {/* O Componente Modal */}
      <QuitModal 
        isOpen={showQuitModal} 
        onClose={() => setShowQuitModal(false)}
        onConfirm={handleQuit}
      />

    </div>
  );
}


function QuitModal({ isOpen, onClose, onConfirm, title = "Are you sure you want to quit ?" }:{ isOpen: boolean; onClose: () => void; onConfirm: () => void; title?: string }) {
  const [isVisible, setIsVisible] = useState(false);

  // Lógica de animação simples para entrada/saída
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div 
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        transition-opacity duration-200
        ${isOpen ? 'opacity-100' : 'opacity-0'}
      `}
    >
      {/* 1. BACKDROP (Fundo escuro que bloqueia o jogo) */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose} // Clicar fora fecha (opcional)
      ></div>

      {/* 2. A FAIXA DO MODAL (The Strip) */}
      <div 
        className="relative w-full bg-[#0f1216] border-y border-white/10 py-12 flex flex-col items-center justify-center gap-8 shadow-2xl transform transition-transform duration-200 scale-100"
        onClick={(e) => e.stopPropagation()} // Impede que o clique na faixa feche o modal
      >
        
        {/* Texto da Pergunta */}
        <h2 className="text-xl text-bullet-text font-normal tracking-wide text-center">
          {title}
        </h2>

        {/* Botões de Ação */}
        <div className="flex gap-4">
          
          {/* Botão NO */}
          <button
            onClick={onClose}
            className="w-24 py-2 bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/5 text-bullet-text text-xs font-bold uppercase tracking-widest transition-all duration-200"
          >
            No
          </button>

          {/* Botão YES */}
          <button
            onClick={onConfirm}
            className="w-24 py-2 bg-white/5 hover:bg-bullet-accent hover:text-white border border-transparent text-bullet-text text-xs font-bold uppercase tracking-widest transition-all duration-200"
          >
            Yes
          </button>

        </div>

        {/* Linhas Decorativas (Scanlines subtis apenas na faixa) */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_4px]"></div>
      </div>
    </div>
  );
}