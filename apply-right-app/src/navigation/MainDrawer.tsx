import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabs from './BottomTabs';
import ProfileScreen from '../screens/profile/ProfileScreen';
import DashboardScreen from '../screens/admin/DashboardScreen';
import UsersScreen from '../screens/admin/UsersScreen';
import DrawerContent from '../components/layout/DrawerContent';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Home, User, LayoutDashboard, Users } from 'lucide-react-native';
import { View } from 'react-native';

const DrawerIcon = ({ icon: Icon, color }: { icon: React.ComponentType<{ size: number; color: string }>; color: string }) => (
  <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
    <Icon size={20} color={color} />
  </View>
);

export type MainDrawerParamList = {
  Main: undefined;
  Profile: undefined;
  AdminDashboard: undefined;
  AdminUsers: undefined;
};

const Drawer = createDrawerNavigator<MainDrawerParamList>();

export default function MainDrawer() {
  const { colors } = useTheme();
  const { userRole } = useAuth();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: colors.surface, width: 280 },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textDark,
        drawerLabelStyle: { fontFamily: 'Inter_500Medium' },
      }}
    >
      <Drawer.Screen
        name="Main"
        component={BottomTabs}
        options={{
          title: 'Home',
          drawerIcon: ({ color }) => <DrawerIcon icon={Home} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          drawerIcon: ({ color }) => <DrawerIcon icon={User} color={color} />,
        }}
      />
      {userRole === 'admin' && (
        <>
          <Drawer.Screen
            name="AdminDashboard"
            component={DashboardScreen}
            options={{
              title: 'Admin Dashboard',
              drawerIcon: ({ color }) => <DrawerIcon icon={LayoutDashboard} color={color} />,
            }}
          />
          <Drawer.Screen
            name="AdminUsers"
            component={UsersScreen}
            options={{
              title: 'Manage Users',
              drawerIcon: ({ color }) => <DrawerIcon icon={Users} color={color} />,
            }}
          />
        </>
      )}
    </Drawer.Navigator>
  );
}
