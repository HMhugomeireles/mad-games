export const PrimaryButton = ({ children, onClick, className = '' }: React.ComponentProps<"button">) => (
  <button 
    onClick={onClick}
    className={`
      relative group overflow-hidden
      bg-gradient-to-r from-bullet-accent to-orange-600 
      hover:to-orange-500 text-white 
      text-sm font-bold uppercase tracking-[0.2em]
      py-3 px-8 shadow-[0_0_15px_rgba(217,119,6,0.3)]
      transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
      cursor-pointer
      ${className}
    `}
    style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
  >
    <span className="relative z-10">{children}</span>
    {/* Efeito Scanline */}
    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12 z-0"></div>
  </button>
);

// --- 2. BOTÃO SECUNDÁRIO ("Glass / Ghost") ---
// Uso: Cancelar, Voltar, Definições, Ações alternativas
export const SecondaryButton = ({ children, onClick, className = '' }: React.ComponentProps<"button">) => (
  <button 
    onClick={onClick}
    className={`
      relative group
      bg-white/5 hover:bg-white/10
      border border-white/10 hover:border-bullet-accent/50
      text-bullet-muted hover:text-white
      text-sm font-bold uppercase tracking-[0.15em]
      py-3 px-8 backdrop-blur-sm
      transition-all duration-300
      cursor-pointer
      ${className}
    `}
    // Corte ligeiramente menos agressivo que o primário
    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)' }}
  >
    <span className="relative z-10 flex items-center justify-center gap-2">
      {children}
    </span>
    
    {/* Decoração Tática no Hover (Canto inferior acende) */}
    <div className="absolute bottom-0 right-0 w-3 h-3 bg-bullet-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  </button>
);

// --- 3. BOTÃO TERCIÁRIO ("Text / Minimal") ---
// Uso: Links simples, "Forgot Password", Breadcrumbs, Filtros
export const TertiaryButton = ({ children, onClick, className = '' }: React.ComponentProps<"button">) => (
  <button 
    onClick={onClick}
    className={`
        w-full
      group relative
      text-bullet-muted hover:text-bullet-accent
      text-xs font-bold uppercase tracking-[0.15em]
      py-2 px-4
      transition-colors duration-200
      cursor-pointer
      ${className}
    `}
  >
    {/* Texto */}
    <span className="relative z-10">{children}</span>

    {/* Linhas de Mira que aparecem no Hover [ TEXTO ] */}
    <span className="absolute left-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all text-bullet-accent font-light">
      [
    </span>
    <span className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-bullet-accent font-light">
      ]
    </span>
    
    {/* Linha inferior subtil */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-bullet-accent group-hover:w-full transition-all duration-300 opacity-50"></div>
  </button>
);