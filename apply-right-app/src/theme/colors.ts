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
    statusBar: '#015C6A',
    placeholder: '#6B9EA8',
    shadow: '#017A8C',
    gradient: ['#015C6A', '#017A8C', '#019baf'] as [string, string, string],
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
    statusBar: '#013040',
    placeholder: '#8BAFC0',
    shadow: '#000000',
    gradient: ['#017A8C', '#013040', '#0B1120'] as [string, string, string],
  },
};

export type ColorScheme = keyof typeof colors;

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'neutral';

export const badgeStyles: Record<ColorScheme, Record<BadgeVariant, { bg: string; text: string }>> = {
  light: {
    success: { bg: '#dcfce7', text: '#16a34a' },
    warning: { bg: '#fef3c7', text: '#d97706' },
    danger: { bg: '#fef2f2', text: '#dc2626' },
    info: { bg: '#dbeafe', text: '#2563eb' },
    primary: { bg: '#E6F4F7', text: '#017A8C' },
    neutral: { bg: '#f1f5f9', text: '#475569' },
  },
  dark: {
    success: { bg: '#14532d', text: '#4ade80' },
    warning: { bg: '#78350f', text: '#fbbf24' },
    danger: { bg: '#7f1d1d', text: '#f87171' },
    info: { bg: '#1e3a5f', text: '#60a5fa' },
    primary: { bg: '#013040', text: '#22d3ee' },
    neutral: { bg: '#1e293b', text: '#94a3b8' },
  },
};

// Scheme-independent tokens for module-level styles that can't read the theme
// context (e.g. shared UI primitives, static shadow/placeholder definitions).
export const brand = {
  shadow: colors.light.shadow,
  placeholder: colors.light.placeholder,
} as const;
