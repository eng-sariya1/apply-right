import { useColorScheme, View } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, LogOut, FileText, LayoutTemplate } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Box, Center, HStack, Pressable, Text, VStack } from '../ui';
import { Badge } from '../ui/Badge';
import { GradientHeader } from '../ui/GradientHeader';

export default function DrawerContent(props: DrawerContentComponentProps) {
  const { currentUser, logout, userRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const initial = (currentUser?.displayName || currentUser?.email || 'U')[0].toUpperCase();

  return (
    <Box className="flex-1 bg-surface-light dark:bg-surface-dark">
      <GradientHeader style={{ paddingHorizontal: 16, paddingTop: 56, paddingBottom: 20 }}>
        <HStack space={12} className="mb-1 items-center">
          {/* Gradient ring avatar */}
          <LinearGradient
            colors={['#22d3ee', '#017A8C', '#015C6A']}
            style={{ width: 56, height: 56, borderRadius: 28, padding: 3, alignItems: 'center', justifyContent: 'center' }}
          >
            <View style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: isDark ? '#1A2740' : '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 20, fontWeight: 'bold', color: '#017A8C' }}>
                {initial}
              </Text>
            </View>
          </LinearGradient>

          <VStack className="flex-1">
            <Text
              numberOfLines={1}
              className="font-[Inter_700Bold] text-[15px] font-bold text-white"
            >
              {currentUser?.displayName || 'User'}
            </Text>
            <Text numberOfLines={1} className="text-xs text-[#a5d8e0]">
              {currentUser?.email}
            </Text>
            {userRole === 'admin' && (
              <View style={{ marginTop: 4 }}>
                <Badge variant="warning" label="Admin" size="sm" dark={isDark} />
              </View>
            )}
          </VStack>
        </HStack>
      </GradientHeader>

      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 8 }}>
        <DrawerItemList {...props} />
        <Pressable
          onPress={() => props.navigation.navigate('Main', { screen: 'CV Builder', params: { screen: 'TemplateSelect' } })}
          className="flex-row items-center gap-3 px-4 py-3"
        >
          <LayoutTemplate size={20} color="#017A8C" />
          <Text className="font-[Inter_500Medium] text-sm text-text-dark-light dark:text-text-dark-dark">Choose Template</Text>
        </Pressable>
      </DrawerContentScrollView>

      <Box className="border-t border-border-light p-3 dark:border-border-dark">
        <Pressable
          onPress={toggleTheme}
          className="flex-row items-center gap-3 px-1 py-3"
        >
          {theme === 'dark' ? <Moon size={20} color="#8BAFC0" /> : <Sun size={20} color="#6B9EA8" />}
          <Text className="font-[Inter_500Medium] text-sm text-text-dark-light dark:text-text-dark-dark">
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => logout()}
          className="flex-row items-center gap-3 px-1 py-3"
        >
          <LogOut size={20} color="#dc2626" />
          <Text className="font-[Inter_700Bold] text-sm font-bold text-[#dc2626]">Sign Out</Text>
        </Pressable>
      </Box>
    </Box>
  );
}
