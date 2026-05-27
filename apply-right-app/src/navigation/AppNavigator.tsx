import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import MainDrawer from './MainDrawer';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function AppNavigator() {
  const { currentUser, loading } = useAuth();
  const { colors } = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {currentUser ? <MainDrawer /> : <AuthStack />}
    </NavigationContainer>
  );
}
