import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, FileText, BarChart2, Briefcase } from 'lucide-react-native';
import HomeScreen from '../screens/home/HomeScreen';
import CVBuilderStack from './CVBuilderStack';
import ATSScreen from '../screens/ats/ATSScreen';
import JobsScreen from '../screens/jobs/JobsScreen';
import { useTheme } from '../context/ThemeContext';

export type BottomTabParamList = {
  Home: undefined;
  'CV Builder': undefined;
  ATS: undefined;
  Jobs: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabs() {
  const { colors, theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarLabelStyle: { fontFamily: 'Ubuntu_500Medium', fontSize: 11 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color, size }) => <Home size={size} color={color} /> }}
      />
      <Tab.Screen
        name="CV Builder"
        component={CVBuilderStack}
        options={{ tabBarIcon: ({ color, size }) => <FileText size={size} color={color} /> }}
      />
      <Tab.Screen
        name="ATS"
        component={ATSScreen}
        options={{ tabBarIcon: ({ color, size }) => <BarChart2 size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Jobs"
        component={JobsScreen}
        options={{ tabBarIcon: ({ color, size }) => <Briefcase size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}
