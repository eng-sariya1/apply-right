import { useState } from 'react';
import { Alert, Platform, StatusBar, useColorScheme, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Sun, Moon, LogOut, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Box,
  Button,
  ButtonText,
  Card,
  Center,
  HStack,
  Heading,
  Input,
  InputField,
  Pressable,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from '../../components/ui';
import { GradientHeader } from '../../components/ui/GradientHeader';

const LOGOUT_SHADOW = Platform.select({
  ios: { shadowColor: '#dc2626', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6 },
  android: { elevation: 3 },
  default: {},
});

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout, updateDisplayName, changePassword, sendVerificationEmail, reloadAndRefresh } = useAuth();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const isGoogleUser = ((currentUser?.providerData as any[]) || []).some((p: any) => p?.providerId === 'google.com');
  const [verifying, setVerifying] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [saving, setSaving] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);

  const handleSendVerification = async () => {
    try {
      await sendVerificationEmail();
      Alert.alert('Email sent', 'Check your inbox and click the verification link, then tap "I\'ve verified".');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not send verification email');
    }
  };

  const handleCheckVerified = async () => {
    setVerifying(true);
    try {
      const ok = await reloadAndRefresh();
      Alert.alert(
        ok ? 'Verified' : 'Not yet',
        ok ? 'Your email is now verified. You can save CVs.' : 'We could not confirm verification. Make sure you clicked the link in your email, then try again.',
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleSaveName = async () => {
    if (!displayName.trim()) { Alert.alert('Error', 'Name cannot be empty'); return; }
    setSaving(true);
    try {
      await updateDisplayName(displayName.trim());
      Alert.alert('Success', 'Display name updated');
    } catch (err: any) {
      Alert.alert('Error', err.message === 'name-taken' ? 'This name is already taken' : 'Failed to update name');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPwd || !newPwd) { Alert.alert('Error', 'Please fill in both password fields'); return; }
    if (newPwd.length < 6) { Alert.alert('Error', 'New password must be at least 6 characters'); return; }
    setChangingPwd(true);
    try {
      await changePassword(currentPwd, newPwd);
      Alert.alert('Success', 'Password changed successfully');
      setCurrentPwd('');
      setNewPwd('');
    } catch {
      Alert.alert('Error', 'Incorrect current password');
    } finally {
      setChangingPwd(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar barStyle="light-content" backgroundColor="#015C6A" />

      <GradientHeader style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 32 }}>
        <Pressable onPress={() => navigation.goBack()} style={{ marginBottom: 12 }}>
          <ArrowLeft size={22} color="#fff" />
        </Pressable>
        <View style={{ alignItems: 'center' }}>
        <LinearGradient
          colors={['#22d3ee', '#017A8C', '#015C6A']}
          style={{ width: 80, height: 80, borderRadius: 40, padding: 3, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}
        >
          <View style={{
            width: 74,
            height: 74,
            borderRadius: 37,
            backgroundColor: isDark ? '#1A2740' : '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 28, fontWeight: 'bold', color: '#017A8C' }}>
              {(currentUser?.displayName || currentUser?.email || 'U')[0].toUpperCase()}
            </Text>
          </View>
        </LinearGradient>
        <Heading size="lg" className="text-white tracking-tight">
          {currentUser?.displayName || 'User'}
        </Heading>
        <Text className="mt-1 text-sm text-[#a5d8e0]">{currentUser?.email}</Text>
        </View>
      </GradientHeader>

      <VStack space={16} className="p-4">
        <Card>
          <HStack space={8} className="mb-3 items-center">
            <User size={18} color="#017A8C" />
            <Text className="font-[Inter_500Medium] text-base font-semibold text-text-dark-light dark:text-text-dark-dark">
              Display Name
            </Text>
          </HStack>
          <Input className="mb-3 bg-background-light dark:bg-background-dark">
            <InputField value={displayName} onChangeText={setDisplayName} placeholder="Your full name" />
          </Input>
          <Button className="rounded-lg py-3" isLoading={saving} onPress={handleSaveName}>
            <ButtonText className="text-sm">Update Name</ButtonText>
          </Button>
        </Card>

        {isGoogleUser ? (
          <Card>
            <HStack space={8} className="items-center">
              <Lock size={18} color="#017A8C" />
              <Text className="flex-1 font-[Inter_400Regular] text-sm text-text-light-light dark:text-text-light-dark">
                Signed in with Google — password is managed by your Google account.
              </Text>
            </HStack>
          </Card>
        ) : (
        <Card>
          <HStack space={8} className="mb-3 items-center">
            <Lock size={18} color="#017A8C" />
            <Text className="font-[Inter_500Medium] text-base font-semibold text-text-dark-light dark:text-text-dark-dark">
              Change Password
            </Text>
          </HStack>
          <Input className="mb-2.5 bg-background-light dark:bg-background-dark">
            <InputField value={currentPwd} onChangeText={setCurrentPwd} placeholder="Current password" secureTextEntry />
          </Input>
          <Input className="mb-3 bg-background-light dark:bg-background-dark">
            <InputField value={newPwd} onChangeText={setNewPwd} placeholder="New password (min. 6 chars)" secureTextEntry />
          </Input>
          <Button className="rounded-lg py-3" isLoading={changingPwd} onPress={handleChangePassword}>
            <ButtonText className="text-sm">Change Password</ButtonText>
          </Button>
        </Card>
        )}

        <Card>
          <HStack className="items-center justify-between">
            <HStack space={8} className="items-center">
              {theme === 'dark' ? <Moon size={18} color="#017A8C" /> : <Sun size={18} color="#017A8C" />}
              <Box>
                <Text className="font-[Inter_500Medium] text-base font-semibold text-text-dark-light dark:text-text-dark-dark">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </Text>
                <Text className="text-xs text-text-light-light dark:text-text-light-dark">Tap to toggle theme</Text>
              </Box>
            </HStack>
            <Pressable
              onPress={toggleTheme}
              style={{ height: 28, width: 50, justifyContent: 'center', borderRadius: 14, paddingHorizontal: 3, overflow: 'hidden' }}
            >
              {theme === 'dark' ? (
                <LinearGradient
                  colors={['#015C6A', '#019baf']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
                />
              ) : (
                <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: '#D8EBF0', borderRadius: 14 }} />
              )}
              <View style={{ height: 22, width: 22, borderRadius: 11, backgroundColor: '#fff', alignSelf: theme === 'dark' ? 'flex-end' : 'flex-start' }} />
            </Pressable>
          </HStack>
        </Card>

        <Card>
          <HStack space={8} className="mb-2.5 items-center">
            <Mail size={18} color="#017A8C" />
            <Text className="font-[Inter_500Medium] text-base font-semibold text-text-dark-light dark:text-text-dark-dark">
              Account Info
            </Text>
          </HStack>
          <Text className="text-sm text-text-light-light dark:text-text-light-dark">Email: {currentUser?.email}</Text>
          <Text className="mt-1 text-sm text-text-light-light dark:text-text-light-dark">
            Email verified: {currentUser?.emailVerified ? 'Yes' : 'No'}
          </Text>
          {!currentUser?.emailVerified && (
            <HStack space={8} className="mt-3">
              <Button className="flex-1 rounded-lg py-2.5" onPress={handleSendVerification}>
                <ButtonText className="text-sm font-[Inter_500Medium] font-medium">Send verification</ButtonText>
              </Button>
              <Button variant="outline" className="flex-1 rounded-lg py-2.5" isLoading={verifying} onPress={handleCheckVerified}>
                <ButtonText variant="outline" className="text-sm font-[Inter_500Medium] font-medium">
                  I've verified
                </ButtonText>
              </Button>
            </HStack>
          )}
        </Card>

        <Pressable
          onPress={handleLogout}
          className="mt-1 flex-row items-center justify-center gap-2 rounded-xl border-2 border-danger-light py-3.5"
          style={LOGOUT_SHADOW}
        >
          <LogOut size={18} color="#dc2626" />
          <Text className="font-[Inter_700Bold] text-[15px] font-bold text-danger-light dark:text-danger-dark">Sign Out</Text>
        </Pressable>

        <Box className="h-6" />
      </VStack>
    </ScrollView>
  );
}
