import { useState } from 'react';
import { Alert, StatusBar, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../navigation/AuthStack';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, ArrowLeft, FileText } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Box,
  Button,
  ButtonText,
  HStack,
  Heading,
  Input,
  InputField,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from '../../components/ui';
import { GradientHeader } from '../../components/ui/GradientHeader';
import { GoogleIcon } from '../../components/ui/GoogleIcon';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import { colors } from '../../theme/colors';

type Nav = StackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { login, resetPassword } = useAuth();
  const { request, promptAsync, googleLoading } = useGoogleAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Reset Password', 'Please enter your email address first');
      return;
    }
    try {
      await resetPassword(email.trim());
      Alert.alert('Email Sent', 'Password reset email has been sent to your inbox');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to send reset email');
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background-light dark:bg-background-dark"
      contentContainerClassName="grow"
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.light.statusBar} />

      <GradientHeader style={{ paddingHorizontal: 24, paddingTop: 56, paddingBottom: 40 }}>
        <Pressable className="mb-6" onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#fff" />
        </Pressable>
        <HStack space={12} className="items-center">
          <LinearGradient
            colors={['#015C6A', '#019baf']}
            style={{ width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}
          >
            <FileText size={22} color="#fff" />
          </LinearGradient>
          <Heading size="xl" className="text-white">
            Welcome back
          </Heading>
        </HStack>
        <Text className="mt-2 text-[#a5d8e0]">Sign in to continue building your career</Text>
      </GradientHeader>

      <VStack space={20} className="p-6">
        <Pressable
          disabled={!request || googleLoading}
          onPress={() => promptAsync()}
          style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            gap: 10, borderRadius: 16, borderWidth: 1,
            borderColor: '#D8EBF0', backgroundColor: '#fff',
            paddingVertical: 14,
            opacity: !request || googleLoading ? 0.6 : 1,
          }}
        >
          <GoogleIcon size={20} />
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#02343F' }}>
            {googleLoading ? 'Signing in…' : 'Continue with Google'}
          </Text>
        </Pressable>

        <HStack space={8} className="items-center">
          <View style={{ flex: 1, height: 1, backgroundColor: '#D8EBF0' }} />
          <Text className="font-[Inter_400Regular] text-[12px] text-text-light-light dark:text-text-light-dark">
            or continue with email
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: '#D8EBF0' }} />
        </HStack>

        <Box>
          <Text className="mb-2 font-[Inter_600SemiBold] text-[11px] uppercase tracking-widest text-text-dark-light dark:text-text-dark-dark">
            Email Address
          </Text>
          <Input>
            <InputField
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Input>
        </Box>

        <Box>
          <Text className="mb-2 font-[Inter_600SemiBold] text-[11px] uppercase tracking-widest text-text-dark-light dark:text-text-dark-dark">
            Password
          </Text>
          <Input>
            <InputField
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
            />
            <Pressable className="px-3" onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} color="#6B9EA8" /> : <Eye size={20} color="#6B9EA8" />}
            </Pressable>
          </Input>
          <Pressable className="mt-2 self-end" onPress={handleForgotPassword}>
            <Text className="font-[Inter_500Medium] text-xs text-primary">Forgot password?</Text>
          </Pressable>
        </Box>

        <Button className="mt-2" isLoading={loading} onPress={handleLogin}>
          <ButtonText>Sign In</ButtonText>
        </Button>

        <HStack space={4} className="mt-2 justify-center">
          <Text className="text-text-light-light dark:text-text-light-dark">Don't have an account?</Text>
          <Pressable onPress={() => navigation.navigate('Signup')}>
            <Text className="font-[Inter_600SemiBold] text-primary">Sign up</Text>
          </Pressable>
        </HStack>
      </VStack>
    </ScrollView>
  );
}
