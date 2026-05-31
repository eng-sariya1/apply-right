import { type ReactNode, useEffect } from 'react';
import { Platform, Pressable, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, FileText, BarChart2, Briefcase } from 'lucide-react-native';
import Reanimated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const ICONS: Record<string, (color: string, size: number) => ReactNode> = {
  Home: (c, s) => <Home size={s} color={c} />,
  'CV Builder': (c, s) => <FileText size={s} color={c} />,
  ATS: (c, s) => <BarChart2 size={s} color={c} />,
  Jobs: (c, s) => <Briefcase size={s} color={c} />,
};

const BAR_SHADOW = Platform.select({
  ios: {
    shadowColor: '#015C6A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  android: { elevation: 12 },
  default: {},
});

function TabItem({
  label,
  focused,
  onPress,
}: {
  label: string;
  focused: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  useEffect(() => {
    if (focused) {
      scale.value = withSpring(1.12, { damping: 10, stiffness: 200 }, () => {
        scale.value = withSpring(1, { damping: 12, stiffness: 200 });
      });
    }
  }, [focused]);

  const scheme = useColorScheme();
  const inactiveColor = focused ? '#fff' : (scheme === 'dark' ? '#8BAFC0' : '#017A8C');
  const iconNode = ICONS[label]?.(inactiveColor, 22);

  return (
    <Pressable
      onPress={onPress}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 6 }}
    >
      {focused ? (
        <LinearGradient
          colors={['#015C6A', '#019baf']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center', flexDirection: 'row', gap: 6 }}
        >
          <Reanimated.View style={animatedStyle}>
            {iconNode}
          </Reanimated.View>
          <Text style={{ color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 12, letterSpacing: -0.2 }}>
            {label}
          </Text>
        </LinearGradient>
      ) : (
        <Reanimated.View style={[{ alignItems: 'center', gap: 3 }, animatedStyle]}>
          {iconNode}
          <Text style={{ color: scheme === 'dark' ? '#8BAFC0' : '#6B9EA8', fontFamily: 'Inter_500Medium', fontSize: 10 }}>
            {label}
          </Text>
        </Reanimated.View>
      )}
    </Pressable>
  );
}

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const bgColor = scheme === 'dark' ? '#1A2740' : '#FFFFFF';

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 12 + insets.bottom,
        left: 16,
        right: 16,
        backgroundColor: bgColor,
        borderRadius: 28,
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 8,
        ...BAR_SHADOW,
      }}
    >
      {state.routes.map((route, index) => (
        <TabItem
          key={route.key}
          label={route.name}
          focused={state.index === index}
          onPress={() => navigation.navigate(route.name)}
        />
      ))}
    </View>
  );
}
