import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Sun, Moon, LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const { currentUser, logout, updateDisplayName, changePassword } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [saving, setSaving] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);

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
    } catch (err: any) {
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
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Header */}
      <View style={{ backgroundColor: colors.primaryDark, paddingTop: 56, paddingBottom: 32, paddingHorizontal: 20, alignItems: 'center' }}>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 28, fontWeight: '700', color: '#fff', fontFamily: 'Ubuntu_700Bold' }}>
            {(currentUser?.displayName || currentUser?.email || 'U')[0].toUpperCase()}
          </Text>
        </View>
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff', fontFamily: 'Ubuntu_700Bold' }}>
          {currentUser?.displayName || 'User'}
        </Text>
        <Text style={{ fontSize: 14, color: '#a5d8e0', fontFamily: 'Ubuntu_300Light', marginTop: 4 }}>
          {currentUser?.email}
        </Text>
      </View>

      <View style={{ padding: 16, gap: 16 }}>
        {/* Display Name */}
        <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <User size={18} color={colors.primary} />
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textDark, fontFamily: 'Ubuntu_500Medium' }}>Display Name</Text>
          </View>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Your full name"
            placeholderTextColor={colors.textLight}
            style={{ backgroundColor: colors.background, borderWidth: 1.5, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: colors.textDark, fontFamily: 'Ubuntu_300Light', marginBottom: 12 }}
          />
          <TouchableOpacity
            onPress={handleSaveName}
            disabled={saving}
            style={{ backgroundColor: colors.primary, borderRadius: 8, paddingVertical: 11, alignItems: 'center', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? <ActivityIndicator color="#fff" size="small" /> : <Text style={{ color: '#fff', fontFamily: 'Ubuntu_700Bold', fontSize: 14 }}>Update Name</Text>}
          </TouchableOpacity>
        </View>

        {/* Change Password */}
        <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Lock size={18} color={colors.primary} />
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textDark, fontFamily: 'Ubuntu_500Medium' }}>Change Password</Text>
          </View>
          <TextInput
            value={currentPwd}
            onChangeText={setCurrentPwd}
            placeholder="Current password"
            placeholderTextColor={colors.textLight}
            secureTextEntry
            style={{ backgroundColor: colors.background, borderWidth: 1.5, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: colors.textDark, fontFamily: 'Ubuntu_300Light', marginBottom: 10 }}
          />
          <TextInput
            value={newPwd}
            onChangeText={setNewPwd}
            placeholder="New password (min. 6 chars)"
            placeholderTextColor={colors.textLight}
            secureTextEntry
            style={{ backgroundColor: colors.background, borderWidth: 1.5, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: colors.textDark, fontFamily: 'Ubuntu_300Light', marginBottom: 12 }}
          />
          <TouchableOpacity
            onPress={handleChangePassword}
            disabled={changingPwd}
            style={{ backgroundColor: colors.primary, borderRadius: 8, paddingVertical: 11, alignItems: 'center', opacity: changingPwd ? 0.7 : 1 }}
          >
            {changingPwd ? <ActivityIndicator color="#fff" size="small" /> : <Text style={{ color: '#fff', fontFamily: 'Ubuntu_700Bold', fontSize: 14 }}>Change Password</Text>}
          </TouchableOpacity>
        </View>

        {/* Theme Toggle */}
        <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {theme === 'dark' ? <Moon size={18} color={colors.primary} /> : <Sun size={18} color={colors.primary} />}
              <View>
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textDark, fontFamily: 'Ubuntu_500Medium' }}>
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textLight, fontFamily: 'Ubuntu_300Light' }}>Tap to toggle theme</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={toggleTheme}
              style={{ width: 50, height: 28, borderRadius: 14, backgroundColor: theme === 'dark' ? colors.primary : colors.border, justifyContent: 'center', paddingHorizontal: 3 }}
            >
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', alignSelf: theme === 'dark' ? 'flex-end' : 'flex-start' }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Account info */}
        <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Mail size={18} color={colors.primary} />
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textDark, fontFamily: 'Ubuntu_500Medium' }}>Account Info</Text>
          </View>
          <Text style={{ fontSize: 13, color: colors.textLight, fontFamily: 'Ubuntu_300Light' }}>Email: {currentUser?.email}</Text>
          <Text style={{ fontSize: 13, color: colors.textLight, fontFamily: 'Ubuntu_300Light', marginTop: 4 }}>
            Email verified: {currentUser?.emailVerified ? 'Yes' : 'No'}
          </Text>
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderColor: '#ef4444', borderRadius: 12, paddingVertical: 14, marginTop: 4 }}
        >
          <LogOut size={18} color="#ef4444" />
          <Text style={{ color: '#ef4444', fontFamily: 'Ubuntu_700Bold', fontSize: 15 }}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </View>
    </ScrollView>
  );
}
