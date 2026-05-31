export const colors = {
  light: {
    background: '#FAF7F0',
    card: '#FFFFFF',
    primary: '#017A8C',
    primaryDark: '#015C6A',
    primaryLight: '#019baf',
    textDark: '#02343F',
    textLight: '#6B9EA8',
    border: '#D8EBF0',
    surface: '#FFFFFF',
    error: '#dc2626',
    success: '#16a34a',
    warning: '#d97706',
  },
  dark: {
    background: '#0B1120',
    card: '#172032',
    primary: '#019baf',
    primaryDark: '#017A8C',
    primaryLight: '#22d3ee',
    textDark: '#EDF2F7',
    textLight: '#8BAFC0',
    border: '#263A52',
    surface: '#1A2740',
    error: '#f87171',
    success: '#4ade80',
    warning: '#fbbf24',
  },
};

export type ColorScheme = keyof typeof colors;
