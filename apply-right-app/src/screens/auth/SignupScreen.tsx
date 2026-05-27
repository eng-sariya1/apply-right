import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StatusBar, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../navigation/AuthStack';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react-native';

type Nav = StackNavigationProp<AuthStackParamList, 'Signup'>;

export default function SignupScreen() {
  const navigation = useNavigation<Nav>();
  const { signup } = useAuth();
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ flexGrow: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <View style={{ backgroundColor: colors.primaryDark, paddingTop: 60, paddingBottom: 40, paddingHorizontal: 24 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 26, fontWeight: '700', color: '#fff', fontFamily: 'Ubuntu_700Bold' }}>Create Account</Text>
        <Text style={{ color: '#a5d8e0', marginTop: 8, fontFamily: 'Ubuntu_300Light' }}>Start building your professional CV today</Text>
      </View>

      <View style={{ padding: 24, gap: 16 }}>
        {[
          { label: 'Full Name', value: name, onChange: setName, placeholder: 'John Doe', type: 'default' },
          { label: 'Email Address', value: email, onChange: setEmail, placeholder: 'you@example.com', type: 'email-address' },
        ].map(({ label, value, onChange, placeholder, type }) => (
          <View key={label}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textDark, fontFamily: 'Ubuntu_500Medium', marginBottom: 6 }}>{label}</Text>
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder={placeholder}
              placeholderTextColor={colors.textLight}
              keyboardType={type as any}
              autoCapitalize={type === 'default' ? 'words' : 'none'}
              style={{ backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: colors.textDark, fontFamily: 'Ubuntu_300Light' }}
            />
          </View>
        ))}

        <View>
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textDark, fontFamily: 'Ubuntu_500Medium', marginBottom: 6 }}>Password</Text>
          <View style={{ position: 'relative' }}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="At least 6 characters"
              placeholderTextColor={colors.textLight}
              secureTextEntry={!showPassword}
              style={{ backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, paddingRight: 48, fontSize: 15, color: colors.textDark, fontFamily: 'Ubuntu_300Light' }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: 14 }}>
              {showPassword ? <EyeOff size={20} color={colors.textLight} /> : <Eye size={20} color={colors.textLight} />}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSignup}
          disabled={loading}
          style={{ backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', fontFamily: 'Ubuntu_700Bold' }}>Create Account</Text>}
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4, marginTop: 8 }}>
          <Text style={{ color: colors.textLight, fontFamily: 'Ubuntu_300Light' }}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: colors.primary, fontFamily: 'Ubuntu_500Medium' }}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
