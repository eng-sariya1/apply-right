import { useState, useEffect } from 'react';
import { Alert, StatusBar, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../navigation/AuthStack';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
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

WebBrowser.maybeCompleteAuthSession();

type Nav = StackNavigationProp<AuthStackParamList, 'Signup'>;

export default function SignupScreen() {
  const navigation = useNavigation<Nav>();
  const { signup, loginWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const ANDROID_CLIENT_ID = '281924958406-oe7v1j9vnfn83bim78v2tis7k39k60rg.apps.googleusercontent.com';

  const WEB_CLIENT_ID = '281924958406-c4mc8hdc1ps4jopk7sl8ccn7aftd9fqj.apps.googleusercontent.com';

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    if (response?.type === 'success' && response.params?.code && request?.codeVerifier && request?.redirectUri) {
      setGoogleLoading(true);
      fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code: response.params.code,
          client_id: WEB_CLIENT_ID,
          redirect_uri: request.redirectUri,
          grant_type: 'authorization_code',
          code_verifier: request.codeVerifier,
        }).toString(),
      })
        .then((r) => r.json())
        .then((tokens) => loginWithGoogle(tokens.id_token))
        .catch((err: any) => Alert.alert('Google Sign-In failed', err.message || 'Please try again'))
        .finally(() => setGoogleLoading(false));
    }
  }, [response]);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signup(email.trim(), password, name.trim());
      Alert.alert('Verify Email', 'A verification email has been sent. Please check your inbox.');
    } catch (err: any) {
      Alert.alert('Signup Failed', err.message || 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Full Name', value: name, onChange: setName, placeholder: 'John Doe', kb: 'default' as const, cap: 'words' as const },
    { label: 'Email Address', value: email, onChange: setEmail, placeholder: 'you@example.com', kb: 'email-address' as const, cap: 'none' as const },
  ];

  return (
    <ScrollView
      className="flex-1 bg-background-light dark:bg-background-dark"
      contentContainerClassName="grow"
    >
      <StatusBar barStyle="light-content" backgroundColor="#015C6A" />

      <GradientHeader style={{ paddingHorizontal: 24, paddingTop: 56, paddingBottom: 40 }}>
        <Pressable className="mb-6" onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#fff" />
        </Pressable>
        <Heading size="xl" className="text-white">
          Create Account
        </Heading>
        <Text className="mt-2 text-[#a5d8e0]">Start building your professional CV today</Text>
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

        {fields.map(({ label, value, onChange, placeholder, kb, cap }) => (
          <Box key={label}>
            <Text className="mb-2 font-[Inter_600SemiBold] text-[11px] uppercase tracking-widest text-text-dark-light dark:text-text-dark-dark">
              {label}
            </Text>
            <Input>
              <InputField
                value={value}
                onChangeText={onChange}
                placeholder={placeholder}
                keyboardType={kb}
                autoCapitalize={cap}
              />
            </Input>
          </Box>
        ))}

        <Box>
          <Text className="mb-2 font-[Inter_600SemiBold] text-[11px] uppercase tracking-widest text-text-dark-light dark:text-text-dark-dark">
            Password
          </Text>
          <Input>
            <InputField
              value={password}
              onChangeText={setPassword}
              placeholder="At least 6 characters"
              secureTextEntry={!showPassword}
            />
            <Pressable className="px-3" onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} color="#6B9EA8" /> : <Eye size={20} color="#6B9EA8" />}
            </Pressable>
          </Input>
        </Box>

        <Button className="mt-2" isLoading={loading} onPress={handleSignup}>
          <ButtonText>Create Account</ButtonText>
        </Button>

        <HStack space={4} className="mt-2 justify-center">
          <Text className="text-text-light-light dark:text-text-light-dark">Already have an account?</Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text className="font-[Inter_600SemiBold] text-primary">Sign in</Text>
          </Pressable>
        </HStack>
      </VStack>
    </ScrollView>
  );
}
