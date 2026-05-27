export const colors = {
  light: {
    background: '#FAF7F0',
    card: '#F3F3F3',
    primary: '#017A8C',
    primaryDark: '#015C6A',
    primaryLight: '#019baf',
    textDark: '#02343F',
    textLight: '#88B7C4',
    border: '#C6DEE4',
    surface: '#ffffff',
    error: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
  },
  dark: {
    background: '#0f172a',
    card: '#1e293b',
    primary: '#019baf',
    primaryDark: '#017A8C',
    primaryLight: '#22d3ee',
    textDark: '#e2e8f0',
    textLight: '#94a3b8',
    border: '#334155',
    surface: '#1e293b',
    error: '#f87171',
    success: '#4ade80',
    warning: '#fbbf24',
  },
};

export type ColorScheme = keyof typeof colors;
