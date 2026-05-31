import './global.css';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GluestackUIProvider } from './src/components/ui';
import { AuthProvider } from './src/context/AuthContext';
import { CVProvider } from './src/context/CVContext';
import { ThemeProvider } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider>
        <ThemeProvider>
          <AuthProvider>
            <CVProvider>
              <AppNavigator />
            </CVProvider>
          </AuthProvider>
        </ThemeProvider>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
