'use client';

import React from 'react';
import Link from 'next/link';

// --- ÍCONES SOCIAIS (SVGs Simples) ---
const Icons = {
  Discord: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z"/></svg>,
  Twitter: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  Instagram: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.948-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>,
  Youtube: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
};

// Componente de Link Simples com Efeito "Bracket"
const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="group relative block w-fit">
    <span className="text-bullet-muted text-xs uppercase tracking-widest transition-colors group-hover:text-bullet-accent">
      {children}
    </span>
    {/* Efeito [ ] ao passar o rato */}
    <span className="absolute -left-3 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-bullet-accent text-xs">[</span>
    <span className="absolute -right-3 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-bullet-accent text-xs">]</span>
  </Link>
);

// Componente de Ícone Social
const SocialButton = ({ icon, href }: { icon: React.ReactNode; href: string }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="
      w-10 h-10 flex items-center justify-center 
      bg-white/5 border border-transparent hover:border-bullet-accent hover:bg-white/10 hover:text-bullet-accent
      text-bullet-muted transition-all duration-200
    "
  >
    {icon}
  </a>
);

export function Footer() {
  return (
    <footer className="w-full bg-bullet-dark border-t border-white/10 font-mono text-sm relative mt-auto">
      
      {/* Decoração: Linha de gradiente no topo */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-bullet-accent/30 to-transparent"></div>

      <div className="max-w-[1600px] mx-auto px-8 py-12">
        
        {/* --- GRID PRINCIPAL --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* COLUNA 1: BRAND & MISSION */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-bullet-accent/10 border border-bullet-accent flex items-center justify-center">
                <div className="w-4 h-4 bg-bullet-accent"></div>
              </div>
              <h2 className="text-xl font-bold tracking-[0.15em] text-white">
                MAD<span className="text-bullet-accent">GAMES</span>
              </h2>
            </div>
            <p className="text-bullet-muted text-xs leading-relaxed max-w-xs">
              Advanced tactical interface designed for high-performance operations. 
              Connect, compete, and dominate with superior intel.
            </p>
            {/* Newsletter Mini Input */}
            <div className="relative group max-w-xs">
               <input 
                 type="email" 
                 placeholder="ENTER COMMS (EMAIL)" 
                 className="w-full bg-black/30 border border-white/10 text-white text-xs p-3 pr-10 outline-none focus:border-bullet-accent transition-colors placeholder-bullet-muted/50"
               />
               <button className="absolute right-0 top-0 h-full w-10 text-bullet-accent hover:text-white flex items-center justify-center">
                 &rarr;
               </button>
            </div>
          </div>

          {/* COLUNA 2: NAVIGATION */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-bold uppercase tracking-[0.2em] mb-2 border-l-2 border-bullet-accent pl-2">
              Navigation
            </h3>
            <div className="space-y-2 flex flex-col">
              <FooterLink href="/">Home Base</FooterLink>
              <FooterLink href="/events">Events</FooterLink>
              <FooterLink href="/rankings">Rankings</FooterLink>
              <FooterLink href="/shop">Shop</FooterLink>
              <FooterLink href="/operator">Operator</FooterLink>
            </div>
          </div>

          {/* COLUNA 3: SUPPORT & LEGAL */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-bold uppercase tracking-[0.2em] mb-2 border-l-2 border-bullet-accent pl-2">
              Intel
            </h3>
            <div className="space-y-2 flex flex-col">
              <FooterLink href="/support">Support Ticket</FooterLink>
              <FooterLink href="/status">System Status</FooterLink>
              <FooterLink href="/privacy">Privacy Protocol</FooterLink>
              <FooterLink href="/terms">Terms of Engagement</FooterLink>
            </div>
          </div>

          {/* COLUNA 4: LIVE STATUS & SOCIALS */}
          <div className="space-y-6">
            
            {/* Social Icons */}
            <div>
              <h3 className="text-bullet-muted text-xs uppercase tracking-widest mb-4">Connect</h3>
              <div className="flex gap-2">
                <SocialButton icon={Icons.Discord} href="#" />
                <SocialButton icon={Icons.Twitter} href="#" />
                <SocialButton icon={Icons.Instagram} href="#" />
                <SocialButton icon={Icons.Youtube} href="#" />
              </div>
            </div>

            {/* System Status Box */}
            <div className="bg-black/40 border border-white/5 p-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-bullet-muted uppercase">Server Status</span>
                <span className="text-green-500 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  ONLINE
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-bullet-muted uppercase">Latency</span>
                <span className="text-bullet-accent">24ms</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-bullet-muted uppercase">Active Units</span>
                <span className="text-white">14,205</span>
              </div>
              {/* Barra de carga decorativa */}
              <div className="h-1 w-full bg-white/10 overflow-hidden mt-2">
                <div className="h-full bg-bullet-accent/50 w-[75%]"></div>
              </div>
            </div>

          </div>

        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-bullet-muted uppercase tracking-widest">
          
          <div className="flex items-center gap-4">
            <span>&copy; 2026 Mad Games System</span>
            <span className="hidden md:inline text-white/10">|</span>
            <span>All Rights Reserved</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="opacity-50">Secure Connection Est.</span>
            <div className="flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-bullet-muted rounded-full"></span>
               <span>v.0.0.5</span>
            </div>
          </div>

        </div>
      </div>
      
      {/* Background Grid Decoration (Bottom Corner) */}
      <div 
        className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none opacity-5"
        style={{
           backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
           backgroundSize: '20px 20px'
        }}
      ></div>

    </footer>
  );
}




/**
 * 

export function Footer() {
    return (
        <footer className="mt-8 pt-4 shrink-0 flex items-center gap-8 text-xs text-bullet-muted uppercase tracking-wider">

            <div className="mt-8 p-4 text-xs text-bullet-muted uppercase text-center  border-t border-white/10 shrink-0">
                &copy; 2024 Mad Games. All rights reserved.
            </div>
        </footer>
    );
}


<footer className="mt-8 pt-4  shrink-0 flex items-center gap-8 text-xs text-bullet-muted uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <span className="bg-bullet-text text-bullet-dark font-bold px-1 min-w-[20px] text-center">ESC</span>
          <span>Back</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-bullet-text text-bullet-dark font-bold px-1 min-w-[20px] text-center">ENTER</span>
          <span>Refresh</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-bullet-panel border border-bullet-muted px-1 min-w-[20px] text-center">J</span>
          <span>Join</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-bullet-panel border border-bullet-muted px-1 min-w-[20px] text-center">E</span>
          <span>Filters</span>
        </div>
      </footer>



 */