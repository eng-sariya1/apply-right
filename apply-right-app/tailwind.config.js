/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#017A8C',
          dark: '#015C6A',
          light: '#019baf',
          bright: '#22d3ee',
          muted: '#E6F4F7',
        },
        background: {
          light: '#FAF7F0',
          dark: '#0B1120',
        },
        card: {
          light: '#FFFFFF',
          dark: '#172032',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1A2740',
        },
        'text-dark': {
          light: '#02343F',
          dark: '#EDF2F7',
        },
        'text-light': {
          light: '#6B9EA8',
          dark: '#8BAFC0',
        },
        border: {
          light: '#D8EBF0',
          dark: '#263A52',
        },
        success: {
          light: '#16a34a',
          dark: '#4ade80',
        },
        warning: {
          light: '#d97706',
          dark: '#fbbf24',
        },
        danger: {
          light: '#dc2626',
          dark: '#f87171',
        },
        info: {
          light: '#2563eb',
          dark: '#60a5fa',
        },
      },
      fontFamily: {
        ubuntu: ['Inter_300Light', 'Inter_500Medium', 'Inter_700Bold'],
      },
      letterSpacing: {
        tightest: '-0.05em',
        tighter: '-0.03em',
        tight: '-0.015em',
        widest: '0.12em',
      },
    },
  },
  plugins: [],
};
