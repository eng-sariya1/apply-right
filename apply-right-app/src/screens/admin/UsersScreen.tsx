import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StatusBar, ActivityIndicator } from 'react-native';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useTheme } from '../../context/ThemeContext';
import { Users, Shield, UserX, UserCheck } from 'lucide-react-native';

interface UserRecord {
  id: string;
  email: string;
  displayName: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function UsersScreen() {
  const { colors } = useTheme();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, 'users'));
        const userList = snap.docs.map((d) => ({
          id: d.id,
          email: d.data().email || '',
          displayName: d.data().displayName || '',
          role: d.data().role || 'user',
          status: d.data().status || 'active',
          createdAt: d.data().createdAt || '',
        }));
        setUsers(userList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const toggleStatus = async (user: UserRecord) => {
    const newStatus = user.status === 'active' ? 'blocked' : 'active';
    Alert.alert(`${newStatus === 'blocked' ? 'Block' : 'Unblock'} User`, `Are you sure?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          await updateDoc(doc(db, 'users', user.id), { status: newStatus });
          setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, status: newStatus } : u));
        },
      },
    ]);
  };

  const renderUser = ({ item }: { item: UserRecord }) => (
    <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textDark, fontFamily: 'Ubuntu_500Medium' }}>{item.displayName || 'Unknown'}</Text>
          <Text style={{ fontSize: 12, color: colors.textLight, fontFamily: 'Ubuntu_300Light', marginTop: 2 }}>{item.email}</Text>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
            <View style={{ backgroundColor: item.role === 'admin' ? '#fef3c7' : `${colors.primary}15`, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
              <Text style={{ fontSize: 11, color: item.role === 'admin' ? '#d97706' : colors.primary, fontFamily: 'Ubuntu_500Medium' }}>{item.role}</Text>
            </View>
            <View style={{ backgroundColor: item.status === 'active' ? '#dcfce7' : '#fef2f2', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
              <Text style={{ fontSize: 11, color: item.status === 'active' ? '#16a34a' : '#ef4444', fontFamily: 'Ubuntu_500Medium' }}>{item.status}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => toggleStatus(item)} style={{ padding: 8 }}>
          {item.status === 'active' ? <UserX size={20} color="#ef4444" /> : <UserCheck size={20} color="#22c55e" />}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <View style={{ backgroundColor: colors.primaryDark, paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Users size={24} color="#fff" />
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#fff', fontFamily: 'Ubuntu_700Bold' }}>Manage Users</Text>
        </View>
        <Text style={{ color: '#a5d8e0', marginTop: 4, fontFamily: 'Ubuntu_300Light', fontSize: 13 }}>{users.length} registered users</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderUser}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
}
