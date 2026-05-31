import { useState, useEffect, useMemo } from 'react';
import { Alert, StatusBar, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { Users, UserX, UserCheck, Search, ArrowUpDown, Shield, ShieldOff, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react-native';
import {
  Box,
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
import { Badge } from '../../components/ui/Badge';

interface UserRecord {
  id: string;
  email: string;
  displayName: string;
  role: string;
  status: string;
  createdAt: string;
  cvCount: number;
}

type SortKey = 'displayName' | 'email' | 'role' | 'cvCount';
type RoleFilter = 'all' | 'admin' | 'user';
const PAGE_SIZE = 10;

export default function UsersScreen() {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('displayName');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersSnap, cvsSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'cvs')),
        ]);
        const cvCounts = new Map<string, number>();
        cvsSnap.docs.forEach((d) => {
          const list = (d.data().cvList as any[]) || [];
          cvCounts.set(d.id, list.length);
        });
        setUsers(
          usersSnap.docs.map((d) => ({
            id: d.id,
            email: d.data().email || '',
            displayName: d.data().displayName || '',
            role: d.data().role || 'user',
            status: d.data().status || 'active',
            createdAt: d.data().createdAt || '',
            cvCount: cvCounts.get(d.id) || 0,
          })),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let arr = users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (!term) return true;
      return u.displayName.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
    });
    arr = [...arr].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') return sortAsc ? av - bv : bv - av;
      const as = String(av).toLowerCase();
      const bs = String(bv).toLowerCase();
      return sortAsc ? as.localeCompare(bs) : bs.localeCompare(as);
    });
    return arr;
  }, [users, search, roleFilter, sortKey, sortAsc]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSort = (k: SortKey) => {
    if (k === sortKey) setSortAsc(!sortAsc);
    else { setSortKey(k); setSortAsc(true); }
  };

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

  const toggleRole = async (user: UserRecord) => {
    if (user.id === currentUser?.uid) {
      Alert.alert('Blocked', 'You cannot change your own role.');
      return;
    }
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    Alert.alert('Change role', `Make this user ${newRole}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          await updateDoc(doc(db, 'users', user.id), { role: newRole });
          setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, role: newRole } : u));
        },
      },
    ]);
  };

  const SortHeader = ({ label, k }: { label: string; k: SortKey }) => (
    <Pressable onPress={() => toggleSort(k)} className="flex-row items-center gap-1">
      <Text className="font-[Inter_600SemiBold] text-[10px] uppercase tracking-wide text-text-light-light dark:text-text-light-dark">
        {label}{sortKey === k ? (sortAsc ? ' ↑' : ' ↓') : ''}
      </Text>
      <ArrowUpDown size={10} color="#88B7C4" />
    </Pressable>
  );

  return (
    <Box className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar barStyle="light-content" backgroundColor="#015C6A" />
      <GradientHeader style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 24 }}>
        <HStack space={10} className="items-center">
          <Pressable onPress={() => navigation.goBack()} className="mr-1">
            <ArrowLeft size={22} color="#fff" />
          </Pressable>
          <Users size={24} color="#fff" />
          <Heading size="lg" className="font-[Inter_700Bold] tracking-tight text-white">
            Manage Users
          </Heading>
        </HStack>
        <Text className="mt-1 font-[Inter_400Regular] text-[13px] text-[#a5d8e0]">
          {filtered.length} of {users.length} users
        </Text>
      </GradientHeader>

      <Box className="px-4 pt-4">
        <Input className="mb-3 bg-surface-light dark:bg-surface-dark">
          <Box className="px-3"><Search size={16} color="#88B7C4" /></Box>
          <InputField
            value={search}
            onChangeText={(v) => { setSearch(v); setPage(0); }}
            placeholder="Search by name or email"
            className="font-[Inter_400Regular] text-sm"
          />
        </Input>

        <HStack space={6} className="mb-3 flex-wrap">
          {(['all', 'admin', 'user'] as RoleFilter[]).map((r) => (
            <Pressable
              key={r}
              onPress={() => { setRoleFilter(r); setPage(0); }}
              className="overflow-hidden rounded-full"
            >
              {roleFilter === r ? (
                <LinearGradient
                  colors={['#015C6A', '#019baf']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                >
                  <Text className="font-[Inter_600SemiBold] text-[11px] uppercase text-white">{r}</Text>
                </LinearGradient>
              ) : (
                <View style={{ paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#D8EBF0', borderRadius: 20 }}>
                  <Text className="font-[Inter_500Medium] text-[11px] uppercase text-text-light-light dark:text-text-light-dark">{r}</Text>
                </View>
              )}
            </Pressable>
          ))}
        </HStack>

        <HStack space={12} className="mb-2 px-1">
          <SortHeader label="Name" k="displayName" />
          <SortHeader label="Email" k="email" />
          <SortHeader label="Role" k="role" />
          <SortHeader label="CVs" k="cvCount" />
        </HStack>
      </Box>

      {loading ? (
        <Center className="flex-1"><Spinner /></Center>
      ) : (
        <ScrollView contentContainerClassName="px-4 pb-32">
          {paged.map((item) => {
            const isSelf = item.id === currentUser?.uid;
            return (
              <Card key={item.id} className="mb-2.5 rounded-xl p-3.5">
                <HStack className="items-start justify-between">
                  <VStack className="flex-1">
                    <HStack space={6} className="items-center">
                      <Text className="font-[Inter_600SemiBold] text-sm text-text-dark-light dark:text-text-dark-dark">
                        {item.displayName || 'Unknown'}
                      </Text>
                      {isSelf && <Text className="font-[Inter_500Medium] text-[10px] text-primary">(you)</Text>}
                    </HStack>
                    <Text className="mt-0.5 font-[Inter_400Regular] text-xs text-text-light-light dark:text-text-light-dark">{item.email}</Text>
                    <HStack space={6} className="mt-1.5 items-center">
                      <Badge variant={item.role === 'admin' ? 'warning' : 'primary'} label={item.role} size="sm" />
                      <Badge variant={item.status === 'active' ? 'success' : 'danger'} label={item.status} size="sm" />
                      <Badge variant="info" label={`${item.cvCount} CV${item.cvCount === 1 ? '' : 's'}`} size="sm" />
                    </HStack>
                  </VStack>
                  <HStack space={2}>
                    <Pressable className="p-2" onPress={() => toggleRole(item)} disabled={isSelf}>
                      {item.role === 'admin'
                        ? <ShieldOff size={18} color={isSelf ? '#aaa' : '#d97706'} />
                        : <Shield size={18} color={isSelf ? '#aaa' : '#017A8C'} />}
                    </Pressable>
                    <Pressable className="p-2" onPress={() => toggleStatus(item)}>
                      {item.status === 'active'
                        ? <UserX size={18} color="#ef4444" />
                        : <UserCheck size={18} color="#22c55e" />}
                    </Pressable>
                  </HStack>
                </HStack>
              </Card>
            );
          })}

          {filtered.length === 0 && (
            <Center className="py-10">
              <Text className="font-[Inter_400Regular] text-sm text-text-light-light dark:text-text-light-dark">No users match your filter</Text>
            </Center>
          )}

          {pageCount > 1 && (
            <HStack className="mt-2 items-center justify-center gap-3">
              <Pressable disabled={page === 0} onPress={() => setPage((p) => Math.max(0, p - 1))} className={`rounded-md border border-border-light p-2 dark:border-border-dark ${page === 0 ? 'opacity-40' : ''}`}>
                <ChevronLeft size={16} color="#017A8C" />
              </Pressable>
              <Text className="font-[Inter_500Medium] text-[12px] text-text-light-light dark:text-text-light-dark">
                Page {page + 1} of {pageCount}
              </Text>
              <Pressable disabled={page >= pageCount - 1} onPress={() => setPage((p) => Math.min(pageCount - 1, p + 1))} className={`rounded-md border border-border-light p-2 dark:border-border-dark ${page >= pageCount - 1 ? 'opacity-40' : ''}`}>
                <ChevronRight size={16} color="#017A8C" />
              </Pressable>
            </HStack>
          )}
        </ScrollView>
      )}
    </Box>
  );
}
