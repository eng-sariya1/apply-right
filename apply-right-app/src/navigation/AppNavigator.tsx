import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import MainDrawer from './MainDrawer';
import { Center, Spinner } from '../components/ui';

export default function AppNavigator() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <Center className="flex-1 bg-background-light dark:bg-background-dark">
        <Spinner />
      </Center>
    );
  }

  return (
    <NavigationContainer>
      {currentUser ? <MainDrawer /> : <AuthStack />}
    </NavigationContainer>
  );
}
