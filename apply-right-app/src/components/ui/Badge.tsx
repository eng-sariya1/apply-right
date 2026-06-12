import { View, Text } from 'react-native';
import { badgeStyles, type BadgeVariant } from '../../theme/colors';

type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  label: string;
  size?: BadgeSize;
  dark?: boolean;
}

export function Badge({ variant = 'primary', label, size = 'sm', dark = false }: BadgeProps) {
  const style = dark ? badgeStyles.dark[variant] : badgeStyles.light[variant];
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
