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
        },
        background: {
          light: '#FAF7F0',
          dark: '#0f172a',
        },
        card: {
          light: '#F3F3F3',
          dark: '#1e293b',
        },
        surface: {
          light: '#ffffff',
          dark: '#1e293b',
        },
        'text-dark': {
          light: '#02343F',
          dark: '#e2e8f0',
        },
        'text-light': {
          light: '#88B7C4',
          dark: '#94a3b8',
        },
        border: {
          light: '#C6DEE4',
          dark: '#334155',
        },
      },
      fontFamily: {
        ubuntu: ['Ubuntu_300Light', 'Ubuntu_500Medium', 'Ubuntu_700Bold'],
      },
    },
  },
  plugins: [],
};
