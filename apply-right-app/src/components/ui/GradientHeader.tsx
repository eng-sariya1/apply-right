import { type ReactNode } from 'react';
import { useColorScheme, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const LIGHT_COLORS = ['#015C6A', '#017A8C', '#019baf'] as const;
const DARK_COLORS = ['#017A8C', '#013040', '#0B1120'] as const;

interface GradientHeaderProps {
  children: ReactNode;
  style?: ViewStyle;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

export function GradientHeader({
  children,
  style,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
}: GradientHeaderProps) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? DARK_COLORS : LIGHT_COLORS;

  return (
    <LinearGradient colors={colors} start={start} end={end} style={style}>
      {children}
    </LinearGradient>
  );
}
