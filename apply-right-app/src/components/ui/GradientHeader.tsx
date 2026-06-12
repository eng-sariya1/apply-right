import { type ReactNode } from 'react';
import { useColorScheme, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';

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
  const gradient = scheme === 'dark' ? colors.dark.gradient : colors.light.gradient;

  return (
    <LinearGradient colors={gradient} start={start} end={end} style={style}>
      {children}
    </LinearGradient>
  );
}
