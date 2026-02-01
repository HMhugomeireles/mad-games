const config = {
  darkMode: "class",
  // ...
  theme: {
    extend: {
      // 1. Definição da Paleta de Cores C2
      colors: {
        c2: {
          dark: '#0a0b0c',      // Fundo principal (quase preto)
          panel: '#111316',     // Fundo dos painéis
          neon: '#4deeea',      // Azul Ciano principal
          warning: '#ffd700',   // Amarelo/Âmbar
          alert: '#ff3333',     // Vermelho
          muted: '#6e7d8c',     // Texto secundário
        }
      },
      // 2. Definição da Fonte Terminal
      fontFamily: {
        mono: ['var(--font-share-tech)', 'monospace'],
      },
      // 3. Animação de "piscar" estilo terminal (mais agressiva que o 'pulse' padrão)
      animation: {
        'terminal-blink': 'blink 1s steps(2, start) infinite',
      },
      keyframes: {
        blink: {
          'to': { visibility: 'hidden' },
        }
      },
      // 4. Box Shadows para brilho neon subtil
      boxShadow: {
        'neon-glow': '0 0 10px rgba(77, 238, 234, 0.1) inset',
        'alert-glow': '0 0 10px rgba(255, 51, 51, 0.1) inset',
      },
      // 5. Imagens de fundo para efeitos complexos (linhas tracejadas)
      backgroundImage: {
        'dashed-line': 'linear-gradient(to right, var(--tw-gradient-from) 30%, transparent 0%)',
      }
    },
  },
  plugins: [],
}
export default config