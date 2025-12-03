import reactAriaComponents from 'tailwindcss-react-aria-components';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Shadowrun/Cyberpunk color palette
        // Base backgrounds - deep dark with subtle blue tint
        'sr-dark': '#0a0a0f',
        'sr-darker': '#050508',
        'sr-darkest': '#000000',
        
        // Surface colors - layered grays with blue undertones
        'sr-gray': '#1a1a24',
        'sr-gray-light': '#252535',
        'sr-light-gray': '#2a2a3a',
        'sr-lighter-gray': '#3a3a4a',
        
        // Primary accent - neon cyan (classic cyberpunk)
        'sr-accent': '#00d4ff',
        'sr-accent-dark': '#0099cc',
        'sr-accent-light': '#33e0ff',
        'sr-accent-glow': '#00d4ff',
        
        // Secondary accent - electric magenta/pink
        'sr-secondary': '#ff00ff',
        'sr-secondary-dark': '#cc00cc',
        'sr-secondary-light': '#ff33ff',
        
        // Tertiary accent - electric blue
        'sr-tertiary': '#0066ff',
        'sr-tertiary-dark': '#0052cc',
        'sr-tertiary-light': '#3385ff',
        
        // Status colors with cyberpunk glow
        'sr-danger': '#ff3366',
        'sr-danger-dark': '#cc1a3d',
        'sr-danger-glow': '#ff3366',
        
        'sr-success': '#00ff88',
        'sr-success-dark': '#00cc6a',
        'sr-success-glow': '#00ff88',
        
        'sr-warning': '#ffaa00',
        'sr-warning-dark': '#cc8800',
        'sr-warning-glow': '#ffaa00',
        
        // Matrix green variant
        'sr-matrix': '#00ff41',
        'sr-matrix-dark': '#00cc33',
        
        // Text colors with good contrast
        'sr-text': '#e0e0e0',
        'sr-text-dim': '#a0a0a0',
        'sr-text-muted': '#707070',
      },
      fontFamily: {
        // Tech font for headings (cyberpunk aesthetic)
        'tech': ['Orbitron', 'Rajdhani', 'sans-serif'],
        // Readable sans-serif for body
        'body': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        // Monospace for code/data
        'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
      },
      boxShadow: {
        // Glow effects for cyberpunk aesthetic
        'glow-cyan': '0 0 10px rgba(0, 212, 255, 0.5), 0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-cyan-lg': '0 0 20px rgba(0, 212, 255, 0.6), 0 0 40px rgba(0, 212, 255, 0.4)',
        'glow-magenta': '0 0 10px rgba(255, 0, 255, 0.5), 0 0 20px rgba(255, 0, 255, 0.3)',
        'glow-blue': '0 0 10px rgba(0, 102, 255, 0.5), 0 0 20px rgba(0, 102, 255, 0.3)',
        'glow-success': '0 0 10px rgba(0, 255, 136, 0.5), 0 0 20px rgba(0, 255, 136, 0.3)',
        'glow-danger': '0 0 10px rgba(255, 51, 102, 0.5), 0 0 20px rgba(255, 51, 102, 0.3)',
        'glow-warning': '0 0 10px rgba(255, 170, 0, 0.5), 0 0 20px rgba(255, 170, 0, 0.3)',
        'inner-glow': 'inset 0 0 10px rgba(0, 212, 255, 0.2)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 0.15s infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            opacity: '1',
            boxShadow: '0 0 10px rgba(0, 212, 255, 0.5), 0 0 20px rgba(0, 212, 255, 0.3)',
          },
          '50%': { 
            opacity: '0.8',
            boxShadow: '0 0 15px rgba(0, 212, 255, 0.7), 0 0 30px rgba(0, 212, 255, 0.5)',
          },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)',
        'scanline-pattern': 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 2px)',
      },
      backgroundSize: {
        'grid': '20px 20px',
      },
    },
  },
  plugins: [
    reactAriaComponents,
  ],
}

