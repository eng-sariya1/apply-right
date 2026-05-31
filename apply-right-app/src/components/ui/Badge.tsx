import { View, Text } from 'react-native';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'neutral';
type BadgeSize = 'sm' | 'md';

const STYLES: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: '#dcfce7', text: '#16a34a' },
  warning: { bg: '#fef3c7', text: '#d97706' },
  danger:  { bg: '#fef2f2', text: '#dc2626' },
  info:    { bg: '#dbeafe', text: '#2563eb' },
  primary: { bg: '#E6F4F7', text: '#017A8C' },
  neutral: { bg: '#f1f5f9', text: '#475569' },
};

const DARK_STYLES: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: '#14532d', text: '#4ade80' },
  warning: { bg: '#78350f', text: '#fbbf24' },
  danger:  { bg: '#7f1d1d', text: '#f87171' },
  info:    { bg: '#1e3a5f', text: '#60a5fa' },
  primary: { bg: '#013040', text: '#22d3ee' },
  neutral: { bg: '#1e293b', text: '#94a3b8' },
};

interface BadgeProps {
  variant?: BadgeVariant;
  label: string;
  size?: BadgeSize;
  dark?: boolean;
}

export function Badge({ variant = 'primary', label, size = 'sm', dark = false }: BadgeProps) {
  const style = dark ? DARK_STYLES[variant] : STYLES[variant];
  const paddingH = size === 'sm' ? 6 : 10;
  const paddingV = size === 'sm' ? 2 : 4;
  const fontSize = size === 'sm' ? 10 : 12;

  return (
    <View
      style={{
        backgroundColor: style.bg,
        borderRadius: 6,
        paddingHorizontal: paddingH,
        paddingVertical: paddingV,
        alignSelf: 'flex-start',
      }}
    >
      <Text
        style={{
          color: style.text,
          fontSize,
          fontFamily: 'Inter_600SemiBold',
          letterSpacing: 0.3,
        }}
      >
        {label.toUpperCase()}
      </Text>
    </View>
  );
}
