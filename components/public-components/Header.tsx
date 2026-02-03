'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const navItems = [
  { name: 'HOME', href: '/' },
  { name: 'EVENTS', href: '/events' },
  { name: 'RANKING', href: '/rankings' },
  { name: 'SHOP', href: '/shop' },
];

export function Header({ session }: { session: any }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-bullet-dark/95 border-b border-white/10 backdrop-blur-md shadow-lg font-mono">

      {/* Linha Decorativa Topo (Acento Laranja) */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-bullet-accent/50 to-transparent"></div>

      <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">

        {/* --- 1. LOGO (ESQUERDA) --- */}
        <div className="flex items-center gap-3 cursor-pointer group">
          {/* Ícone Simples (Caveira ou Simbolo) */}
          <div className="w-10 h-10 bg-bullet-panel border border-white/10 flex items-center justify-center group-hover:border-bullet-accent transition-colors">
            <svg className="w-6 h-6 text-bullet-accent" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /><circle cx="12" cy="12" r="3" /></svg>
          </div>

          {/* Texto do Logo */}
          <div className="flex flex-col leading-none">
            <h1 className="text-2xl font-bold tracking-[0.15em] text-white uppercase group-hover:text-white/90 transition-colors">
              MAD<span className="text-bullet-accent">GAMES</span>
            </h1>
            <span className="text-[10px] text-bullet-muted tracking-[0.3em] uppercase group-hover:text-bullet-accent transition-colors">
              Tactical Gaming
            </span>
          </div>
        </div>

        {/* Wrapper para Navegação e Login (DIREITA) */}
        <div className="flex items-center gap-12">

          {/* --- 2. MENU DE NAVEGAÇÃO --- */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              // 3. Verificar se este item é o ativo
              // Usamos startsWith para que '/games/123' mantenha o link '/games' ativo
              // O caso do '/' é especial para não ficar sempre ativo
              const isActive = item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  // 4. Removemos o onClick={() => setActiveLink(...)} pois já não é necessário
                  className={`
              relative text-xs font-bold uppercase tracking-widest transition-colors py-2 group
              ${isActive ? 'text-white' : 'text-bullet-muted hover:text-white'}
            `}
                >
                  {item.name}

                  {/* Efeito Hover/Active: Linha Laranja e Glow */}
                  <span
                    className={`
                absolute bottom-0 left-0 h-[2px] bg-bullet-accent transition-all duration-300
                ${isActive ? 'w-full shadow-[0_0_10px_var(--color-bullet-accent)]' : 'w-0 group-hover:w-full'}
              `}
                  ></span>
                </Link>
              );
            })}
          </nav>

          {
            session !== null ? (
              <Link href={`/operator/${session.user?.id}`}>
                <Avatar>
                  <AvatarImage src={session.user?.image || undefined} />
                  <AvatarFallback>{session.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Link href="/login">
                <button
                  className="
                    relative group overflow-hidden
                    bg-gradient-to-r from-bullet-accent to-orange-600 
                    hover:to-orange-500 text-white 
                    text-[11px] font-bold uppercase tracking-[0.2em]
                    py-2.5 px-8 shadow-[0_0_15px_rgba(217,119,6,0.3)]
                    transition-all duration-200 hover:scale-105 cursor-pointer
                    border-t border-orange-400/30
                  "
                  style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }} // Corte Militar Duplo
                >
                  <span className="relative z-10">Login</span>

                  {/* Efeito de brilho ao passar o rato (Scanline) */}
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12 z-0"></div>
                </button>
              </Link>
            )
          }

          {/* Mobile Menu Icon (Hamburger) - Visível apenas em ecrãs pequenos */}
          <button className="md:hidden text-bullet-muted hover:text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>

        </div>
      </div>
    </header>
  );
}