/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#0B0A10',
        surface: '#15131C',
        surface2: '#1D1A26',
        surface3: '#252130',
        hairline: '#2A2733',
        ink: '#F2F0EA',
        muted: '#9C97A8',
        faint: '#65616F',
        amber: {
          DEFAULT: '#F2A93B',
          soft: '#F7C877',
          dim: '#7A5A22',
        },
        violet: {
          DEFAULT: '#7C6CF0',
          soft: '#A79CF7',
          dim: '#372F63',
        },
        good: '#4ADE80',
        bad: '#F2545B',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(242,169,59,0.15), 0 8px 30px -8px rgba(242,169,59,0.25)',
        card: '0 1px 0 rgba(255,255,255,0.03) inset, 0 20px 40px -24px rgba(0,0,0,0.6)',
      },
      keyframes: {
        spin_slow: {
          to: { transform: 'rotate(360deg)' },
        },
        rise: {
          '0%': { opacity: 0, transform: 'translateY(14px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        dash: {
          '0%': { strokeDashoffset: 220 },
          '100%': { strokeDashoffset: 0 },
        },
        pulse_soft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
      animation: {
        spin_slow: 'spin_slow 40s linear infinite',
        rise: 'rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        dash: 'dash 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        pulse_soft: 'pulse_soft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
