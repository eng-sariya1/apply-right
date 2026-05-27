import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StatusBar, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../navigation/AuthStack';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Eye, EyeOff, ArrowLeft, FileText } from 'lucide-react-native';

type Nav = StackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { login, resetPassword } = useAuth();
  const { colors } = useTheme();
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
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ flexGrow: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Header */}
      <View style={{ backgroundColor: colors.primaryDark, paddingTop: 60, paddingBottom: 40, paddingHorizontal: 24 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 44, height: 44, borderRadius: 11, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }}>
            <FileText size={22} color="#fff" />
          </View>
          <Text style={{ fontSize: 26, fontWeight: '700', color: '#fff', fontFamily: 'Ubuntu_700Bold' }}>Welcome back</Text>
        </View>
        <Text style={{ color: '#a5d8e0', marginTop: 8, fontFamily: 'Ubuntu_300Light' }}>Sign in to continue building your career</Text>
      </View>

      {/* Form */}
      <View style={{ padding: 24, gap: 16 }}>
        <View>
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textDark, fontFamily: 'Ubuntu_500Medium', marginBottom: 6 }}>Email Address</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={colors.textLight}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{ backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: colors.textDark, fontFamily: 'Ubuntu_300Light' }}
          />
        </View>

        <View>
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textDark, fontFamily: 'Ubuntu_500Medium', marginBottom: 6 }}>Password</Text>
          <View style={{ position: 'relative' }}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={colors.textLight}
              secureTextEntry={!showPassword}
              style={{ backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, paddingRight: 48, fontSize: 15, color: colors.textDark, fontFamily: 'Ubuntu_300Light' }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: 14 }}>
              {showPassword ? <EyeOff size={20} color={colors.textLight} /> : <Eye size={20} color={colors.textLight} />}
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleForgotPassword} style={{ alignSelf: 'flex-end', marginTop: 6 }}>
            <Text style={{ color: colors.primary, fontSize: 13, fontFamily: 'Ubuntu_500Medium' }}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={{ backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', fontFamily: 'Ubuntu_700Bold' }}>Sign In</Text>}
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4, marginTop: 8 }}>
          <Text style={{ color: colors.textLight, fontFamily: 'Ubuntu_300Light' }}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={{ color: colors.primary, fontFamily: 'Ubuntu_500Medium' }}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
