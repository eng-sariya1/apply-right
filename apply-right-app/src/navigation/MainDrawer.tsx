import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabs from './BottomTabs';
import ProfileScreen from '../screens/profile/ProfileScreen';
import DashboardScreen from '../screens/admin/DashboardScreen';
import UsersScreen from '../screens/admin/UsersScreen';
import DrawerContent from '../components/layout/DrawerContent';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

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
        drawerLabelStyle: { fontFamily: 'Ubuntu_500Medium' },
      }}
    >
      <Drawer.Screen name="Main" component={BottomTabs} options={{ title: 'Home' }} />
      <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      {userRole === 'admin' && (
        <>
          <Drawer.Screen name="AdminDashboard" component={DashboardScreen} options={{ title: 'Admin Dashboard' }} />
          <Drawer.Screen name="AdminUsers" component={UsersScreen} options={{ title: 'Manage Users' }} />
        </>
      )}
    </Drawer.Navigator>
  );
}
