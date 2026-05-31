import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import CVBuilderStack from './CVBuilderStack';
import ATSScreen from '../screens/ats/ATSScreen';
import JobsScreen from '../screens/jobs/JobsScreen';
import CustomTabBar from '../components/layout/TabBar';

export type BottomTabParamList = {
  Home: undefined;
  'CV Builder': undefined;
  ATS: undefined;
  Jobs: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="CV Builder" component={CVBuilderStack} />
      <Tab.Screen name="ATS" component={ATSScreen} />
      <Tab.Screen name="Jobs" component={JobsScreen} />
    </Tab.Navigator>
  );
}
