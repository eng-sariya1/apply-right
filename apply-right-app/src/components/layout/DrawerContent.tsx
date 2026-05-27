import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, LogOut, FileText } from 'lucide-react-native';

export default function DrawerContent(props: DrawerContentComponentProps) {
  const { currentUser, logout, userRole } = useAuth();
  const { colors, theme, toggleTheme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* User info */}
      <View style={{ backgroundColor: colors.primaryDark, paddingTop: 56, paddingBottom: 20, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff', fontFamily: 'Ubuntu_700Bold' }}>
              {(currentUser?.displayName || currentUser?.email || 'U')[0].toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff', fontFamily: 'Ubuntu_700Bold' }} numberOfLines={1}>
              {currentUser?.displayName || 'User'}
            </Text>
            <Text style={{ fontSize: 12, color: '#a5d8e0', fontFamily: 'Ubuntu_300Light' }} numberOfLines={1}>
              {currentUser?.email}
            </Text>
            {userRole === 'admin' && (
              <View style={{ backgroundColor: '#f59e0b', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start', marginTop: 4 }}>
                <Text style={{ fontSize: 10, color: '#fff', fontFamily: 'Ubuntu_500Medium' }}>ADMIN</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* App logo */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }}>
          <FileText size={16} color="#fff" />
        </View>
        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.primary, fontFamily: 'Ubuntu_700Bold' }}>Apply Right</Text>
      </View>

      {/* Nav items */}
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 8 }}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Bottom actions */}
      <View style={{ borderTopWidth: 1, borderTopColor: colors.border, padding: 12 }}>
        <TouchableOpacity
          onPress={toggleTheme}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 4 }}
        >
          {theme === 'dark' ? <Moon size={20} color={colors.textLight} /> : <Sun size={20} color={colors.textLight} />}
          <Text style={{ fontSize: 14, color: colors.textDark, fontFamily: 'Ubuntu_500Medium' }}>
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => logout()}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 4 }}
        >
          <LogOut size={20} color="#ef4444" />
          <Text style={{ fontSize: 14, color: '#ef4444', fontFamily: 'Ubuntu_700Bold' }}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
