'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { authClient } from '@/lib/auth/client';

const navItems = [
  { name: 'HOME', href: '/' },
  { name: 'EVENTS', href: '/events' },
  { name: 'RANKING', href: '/rankings' },
  { name: 'SHOP', href: '/shop' },
];

export function Header({ session }: { session: any }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
  };

  const userOptions = [
    { name: 'Operator Profile', href: `/operator/${session?.user?.id}` },
    { name: 'Team Profile', href: `/team/${session?.user?.id}` },
    { name: 'Admin Dashboard', href: '/admin' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-bullet-dark/95 border-b border-white/10 backdrop-blur-md shadow-lg font-mono">

      {/* Linha Decorativa Topo */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-bullet-accent/50 to-transparent"></div>

      {/* Overlay invisível para fechar o dropdown desktop */}
      {isUserDropdownOpen && (
        <div
          className="fixed inset-0 z-40 bg-transparent cursor-default"
          onClick={() => setIsUserDropdownOpen(false)}
        ></div>
      )}

      <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between relative z-50">

        {/* --- LOGO --- */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-bullet-panel border border-white/10 flex items-center justify-center group-hover:border-bullet-accent transition-colors">
              <svg className="w-6 h-6 text-bullet-accent" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /><circle cx="12" cy="12" r="3" /></svg>
            </div>
            <div className="flex flex-col leading-none">
              <h1 className="text-2xl font-bold tracking-[0.15em] text-white uppercase group-hover:text-white/90 transition-colors">
                MAD<span className="text-bullet-accent">GAMES</span>
              </h1>
              <span className="text-[10px] text-bullet-muted tracking-[0.3em] uppercase group-hover:text-bullet-accent transition-colors">
                Tactical Gaming
              </span>
            </div>
          </Link>
        </div>

        {/* --- DIREITA (DESKTOP) --- */}
        <div className="flex items-center gap-12">
          {/* MENU DESKTOP */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative text-xs font-bold uppercase tracking-widest transition-colors py-2 group ${isActive ? 'text-white' : 'text-bullet-muted hover:text-white'}`}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-0 h-[2px] bg-bullet-accent transition-all duration-300 ${isActive ? 'w-full shadow-[0_0_10px_var(--color-bullet-accent)]' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
              );
            })}
          </nav>

          {/* AVATAR / LOGIN (DESKTOP) */}
          <div className="hidden md:block relative">
            {session !== null ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-3 focus:outline-none group"
                >
                  <div className={`transition-all duration-200 ${isUserDropdownOpen ? 'ring-2 ring-bullet-accent rounded-full' : ''}`}>
                    <Avatar>
                      <AvatarImage src={session.user?.image || undefined} />
                      <AvatarFallback>{session.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </div>
                  <svg className={`w-3 h-3 text-bullet-muted transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180 text-bullet-accent' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                {/* Dropdown Desktop */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full mt-4 w-56 bg-bullet-panel border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-white/5 bg-black/20">
                      <p className="text-white text-sm font-bold uppercase truncate">{session.user?.name}</p>
                      <p className="text-[10px] text-bullet-muted uppercase tracking-widest">Active Operator</p>
                    </div>
                    <div className="py-1">
                      {userOptions.map((opt) => (
                        <Link
                          key={opt.name}
                          href={opt.href}
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="block px-4 py-2 text-xs font-bold uppercase tracking-wide text-bullet-muted hover:text-white hover:bg-white/5 hover:border-l-2 hover:border-bullet-accent transition-all"
                        >
                          {opt.name}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-white/5 py-1">
                      <button
                        onClick={() => { handleLogout(); setIsUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wide text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <button
                  className="relative group overflow-hidden bg-gradient-to-r from-bullet-accent to-orange-600 hover:to-orange-500 text-white text-[11px] font-bold uppercase tracking-[0.2em] py-2.5 px-8 shadow-[0_0_15px_rgba(217,119,6,0.3)] transition-all duration-200 hover:scale-105 cursor-pointer border-t border-orange-400/30"
                  style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
                >
                  <span className="relative z-10">Login</span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12 z-0"></div>
                </button>
              </Link>
            )}
          </div>

          {/* BOTÃO MOBILE */}
          <button
            className="md:hidden text-bullet-muted hover:text-white z-50 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            )}
          </button>
        </div>
      </div>

      {/* --- MENU MOBILE (CORRIGIDO: OPACO) --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-bullet-dark border-b border-white/10 shadow-2xl animate-in slide-in-from-top-5 duration-200 overflow-y-auto max-h-[calc(100vh-80px)]">
          <nav className="flex flex-col p-6 space-y-4">

            {navItems.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    block w-full py-3 px-4 text-sm font-bold uppercase tracking-widest border-l-2 transition-colors
                    ${isActive
                      ? 'border-bullet-accent text-white bg-white/5'
                      : 'border-transparent text-bullet-muted hover:text-white hover:bg-white/5 hover:border-white/20'}
                  `}
                >
                  {item.name}
                </Link>
              );
            })}

            <div className="h-[1px] bg-white/10 w-full my-4"></div>

            <div className="px-2">
              {session !== null ? (
                <div className="bg-black/20 border border-white/5 p-4 rounded-sm">
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/5">
                    <Avatar className="h-12 w-12 border border-bullet-accent/50">
                      <AvatarImage src={session.user?.image || undefined} />
                      <AvatarFallback>{session.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-white font-bold uppercase text-lg">{session.user?.name}</span>
                      <span className="text-[10px] text-bullet-muted uppercase tracking-widest">Operator Online</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {userOptions.map((opt) => (
                      <Link
                        key={opt.name}
                        href={opt.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-2 px-2 text-xs font-bold uppercase tracking-wide text-bullet-muted hover:text-bullet-accent transition-colors flex justify-between items-center group"
                      >
                        {opt.name}
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </Link>
                    ))}

                    <button
                      onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                      className="w-full text-left py-2 px-2 text-xs font-bold uppercase tracking-wide text-red-400 hover:text-red-300 mt-2 border-t border-white/5 pt-3"
                    >
                      Logout System
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full bg-bullet-accent text-bullet-dark font-bold uppercase tracking-widest py-3 hover:bg-white hover:text-black transition-colors">
                    Login / Initialize
                  </button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}