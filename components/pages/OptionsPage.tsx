'use client';

import React, { useState } from 'react';

// --- DADOS DO MENU ---
const descriptions = {
  displayMode: { title: "Display Mode", text: "Sets the application window mode. Fullscreen provides the best performance." },
  resolution: { title: "Resolution", text: "Determines the pixel density of the screen. Higher values look sharper but impact performance." },
  brightness: { title: "Brightness", text: "Adjusts the gamma levels of the display. Set this so the logo on the left is barely visible." },
  fov: { title: "Field of View", text: "Defines the observable game world that is seen on the display at any given moment." },
  maxFrames: { title: "Max Frames", text: "Limits the maximum frames per second to save GPU resources or prevent tearing." },
  sync: { title: "Sync Every Frame", text: "Synchronizes the frame rate with the monitor refresh rate (V-Sync) to prevent screen tearing." },
  fps: { title: "Display FPS", text: "Toggles the on-screen frames per second counter." }
};

export default function OptionsPage() {
  const [activeTab, setActiveTab] = useState('GRAPHICS');
  
  // Estados do Formulário
  const [settings, setSettings] = useState({
    displayMode: 'Fullscreen',
    resolution: '1920x1080',
    gamma: '2.2 (sRGB)',
    brightness: 0.55,
    fov: 90,
    maxFrames: 144,
    vsync: true,
    showFps: false
  });

  // Estado para a descrição dinâmica (Coluna Direita)
  const [focusedDesc, setFocusedDesc] = useState(descriptions.brightness);

  const handleUpdate = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col h-screen p-8 max-w-[1600px] mx-auto overflow-hidden bg-bullet-dark font-mono text-white select-none">
      
      {/* --- HEADER --- */}
      <header className="mb-8 shrink-0">
        <h1 className="text-4xl text-white font-normal uppercase tracking-wide mb-6">
          Options
        </h1>
        
        {/* TABS */}
        <nav className="flex space-x-1 border-b border-white/10">
          {['AUDIO', 'GRAPHICS', 'CONTROLS'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-8 py-3 uppercase tracking-wider text-sm font-bold transition-all relative
                ${activeTab === tab 
                  ? 'text-bullet-accent bg-gradient-to-t from-bullet-accent/10 to-transparent' 
                  : 'text-bullet-muted hover:text-white hover:bg-white/5'}
              `}
            >
              {tab}
              {/* Marcador Laranja da Tab Ativa */}
              {activeTab === tab && (
                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-bullet-accent"></div>
              )}
            </button>
          ))}
        </nav>
      </header>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="flex flex-1 gap-12 overflow-hidden">
        
        {/* COLUNA ESQUERDA: Settings Form */}
        <div className="w-[60%] max-w-3xl overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-bullet-accent/20">
          
          <div className="space-y-1 bg-black/20 p-4 border border-white/5">
            
            {/* Secção 1: Display */}
            <TacticalDropdown 
              label="Display Mode" 
              value={settings.displayMode} 
              options={['Windowed', 'Fullscreen', 'Windowed (Fullscreen)']}
              onChange={(v) => handleUpdate('displayMode', v)}
              onFocus={() => setFocusedDesc(descriptions.displayMode)}
            />
            <TacticalDropdown 
              label="Resolution" 
              value={settings.resolution} 
              options={['1920x1080', '2560x1440', '3840x2160']}
              onChange={(v) => handleUpdate('resolution', v)}
              onFocus={() => setFocusedDesc(descriptions.resolution)}
            />
             <TacticalDropdown 
              label="Display Gamma" 
              value={settings.gamma} 
              options={['2.2 (sRGB)', '2.4 (BT.1886)']}
              onChange={(v) => handleUpdate('gamma', v)}
              onFocus={() => setFocusedDesc(descriptions.resolution)} // Reuse
            />

            {/* Divisor */}
            <div className="h-[1px] bg-white/10 my-4 mx-4"></div>

            {/* Secção 2: Sliders */}
            <TacticalSlider 
              label="Brightness" 
              value={settings.brightness} min={0} max={1} 
              onChange={(v) => handleUpdate('brightness', v)}
              onFocus={() => setFocusedDesc(descriptions.brightness)}
            />
            <TacticalSlider 
              label="Field of View" 
              value={settings.fov} min={60} max={120} 
              onChange={(v) => handleUpdate('fov', v)}
              onFocus={() => setFocusedDesc(descriptions.fov)}
            />
            <TacticalSlider 
              label="Max Frames" 
              value={settings.maxFrames} min={30} max={300} 
              onChange={(v) => handleUpdate('maxFrames', v)}
              onFocus={() => setFocusedDesc(descriptions.maxFrames)}
            />

            {/* Divisor */}
            <div className="h-[1px] bg-white/10 my-4 mx-4"></div>

            {/* Secção 3: Checkboxes */}
            <TacticalCheckbox 
              label="Sync Every Frame" 
              checked={settings.vsync} 
              onChange={(v) => handleUpdate('vsync', v)}
              onFocus={() => setFocusedDesc(descriptions.sync)}
            />
            <TacticalCheckbox 
              label="Display FPS" 
              checked={settings.showFps} 
              onChange={(v) => handleUpdate('showFps', v)}
              onFocus={() => setFocusedDesc(descriptions.fps)}
            />

          </div>
        </div>

        {/* COLUNA DIREITA: Descrição Contextual */}
        <aside className="w-[35%] pt-4">
          <div className="sticky top-0">
            <h3 className="text-xl text-white font-normal mb-4">
              {focusedDesc.title}
            </h3>
            
            <p className="text-bullet-muted text-sm leading-relaxed mb-8">
              {focusedDesc.text}
            </p>

            {/* Imagem de Ajuda/Preview (Fundo do soldado desfocado) */}
            <div className="relative w-full h-64 border border-white/10 bg-black/50 overflow-hidden">
               {/* Simulação de imagem de preview */}
               <div className="absolute inset-0 bg-[url('https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/mw2/meta/mw2-season-03-reveal-meta.jpg')] bg-cover bg-center opacity-30 grayscale"></div>
               
               {/* Exemplo de Brilho se a opção for brilho */}
               {focusedDesc.title === 'Brightness' && (
                 <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                    <div className="w-32 h-32 bg-black border border-white/20 flex items-center justify-center">
                      <span className="text-xs text-white/10" style={{ opacity: settings.brightness }}>LOGO</span>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </aside>

      </main>

      {/* --- FOOTER: Keybinds --- */}
      <footer className="mt-6 pt-4 border-t border-white/10 shrink-0 flex items-center gap-8 text-xs text-bullet-muted uppercase tracking-wider">
        <div className="flex items-center gap-2 cursor-pointer hover:text-white">
          <span className="text-white font-bold text-lg">ESC</span>
          <span>Back</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:text-white">
          <span className="border border-white/20 bg-white/5 px-2 py-0.5 text-white font-bold">F</span>
          <span>Apply</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:text-white">
          <span className="border border-white/20 bg-white/5 px-2 py-0.5 text-white font-bold">R</span>
          <span>Reset to Defaults</span>
        </div>
      </footer>

    </div>
  );
}



const TacticalSlider = ({ value, min, max, onChange, label, onFocus }: { value: number; min: number; max: number; onChange: (value: number) => void; label: string; onFocus: () => void }) => {
  // Calcula a percentagem para a largura da barra laranja
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div 
      className="group flex items-center justify-between py-3 px-4 hover:bg-white/5 transition-colors cursor-pointer"
      onMouseEnter={onFocus}
    >
      <label className="text-bullet-text text-sm w-1/3 font-bold">{label}</label>
      
      <div className="flex-1 flex items-center gap-4">
        <div className="relative w-full h-6 flex items-center">
          {/* Track (Fundo Cinzento) */}
          <div className="absolute w-full h-[2px] bg-white/20"></div>
          
          {/* Input Range Invisível (para acessibilidade e arrasto) */}
          <input 
            type="range" min={min} max={max} value={value} 
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute w-full h-full opacity-0 z-20 cursor-pointer"
          />
          
          {/* Fill (Barra Laranja visível) */}
          <div 
            className="absolute h-[2px] bg-bullet-accent z-10 pointer-events-none"
            style={{ width: `${percentage}%` }}
          ></div>
          
          {/* Thumb (O retângulo/pega) */}
          <div 
            className="absolute h-4 w-2 bg-bullet-text border border-black z-10 pointer-events-none shadow-md"
            style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
          ></div>
        </div>
        
        {/* Valor Numérico */}
        <span className="text-bullet-text text-xs w-12 text-right tabular-nums">
          {value.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

 const TacticalCheckbox = ({ checked, onChange, label, onFocus }: { checked: boolean; onChange: (checked: boolean) => void; label: string; onFocus: () => void }) => {
  return (
    <div 
      className="flex items-center py-3 px-4 hover:bg-white/5 transition-colors cursor-pointer group"
      onClick={() => onChange(!checked)}
      onMouseEnter={onFocus}
    >
      {/* Caixa */}
      <div className={`
        w-4 h-4 mr-4 border flex items-center justify-center transition-colors
        ${checked ? 'bg-bullet-accent border-bullet-accent' : 'bg-transparent border-bullet-muted group-hover:border-white'}
      `}>
        {checked && <div className="w-2 h-2 bg-black"></div>} {/* Quadrado preto interior */}
      </div>
      
      <label className={`text-sm font-bold cursor-pointer ${checked ? 'text-white' : 'text-bullet-muted group-hover:text-bullet-text'}`}>
        {label}
      </label>
    </div>
  );
};

 const TacticalDropdown = ({ value, options, onChange, label, onFocus }: { value: string; options: string[]; onChange: (value: string) => void; label: string; onFocus: () => void }) => {
  return (
    <div 
      className="flex items-center justify-between py-3 px-4 hover:bg-white/5 transition-colors group"
      onMouseEnter={onFocus}
    >
      <label className="text-bullet-muted group-hover:text-bullet-text text-sm w-1/3 font-bold">{label}</label>
      <div className="flex-1 relative">
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/5 border border-transparent focus:border-bullet-accent text-bullet-text text-sm p-2 outline-none appearance-none cursor-pointer"
        >
            {options.map((opt: string) => (
            <option key={opt} value={opt} className="bg-bullet-panel text-bullet-text">
              {opt}
            </option>
            ))}
        </select>
        {/* Seta Customizada */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-bullet-muted">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor"><path d="M0 0L5 6L10 0H0Z"/></svg>
        </div>
      </div>
    </div>
  );
};