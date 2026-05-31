import { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Users, FileText, Shield, FolderOpen, Settings, ArrowLeft } from 'lucide-react-native';
import {
  Box,
  Card,
  Center,
  HStack,
  Heading,
  Pressable,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from '../../components/ui';
import { GradientHeader } from '../../components/ui/GradientHeader';

const ACTION_CARDS = [
  { icon: FileText, label: 'Create Resume', description: 'Start building your professional resume', color: '#017A8C', nav: { screen: 'Main', params: { screen: 'CV Builder' } } },
  { icon: FolderOpen, label: 'My Resumes', description: 'View and manage all your saved resumes', color: '#6366f1', nav: { screen: 'Main', params: { screen: 'Home' } } },
  { icon: Settings, label: 'Settings', description: 'Manage your account preferences', color: '#f59e0b', nav: { screen: 'Profile' } },
] as const;

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const [stats, setStats] = useState({ totalUsers: 0, totalCVs: 0, adminUsers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersSnap, cvsSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'cvs')),
        ]);
        const adminCount = usersSnap.docs.filter((d) => d.data().role === 'admin').length;
        setStats({ totalUsers: usersSnap.size, totalCVs: cvsSnap.size, adminUsers: adminCount });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats.totalUsers, color: '#017A8C' },
    { icon: FileText, label: 'Total CVs', value: stats.totalCVs, color: '#6366f1' },
    { icon: Shield, label: 'Admins', value: stats.adminUsers, color: '#f59e0b' },
  ];

  return (
    <ScrollView className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar barStyle="light-content" backgroundColor="#015C6A" />

      <GradientHeader style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 24 }}>
        <HStack space={10} className="items-center">
          <Pressable onPress={() => navigation.goBack()} className="mr-1">
            <ArrowLeft size={22} color="#fff" />
          </Pressable>
          <Shield size={24} color="#fff" />
          <Heading size="lg" className="text-white tracking-tight">
            Admin Dashboard
          </Heading>
        </HStack>
      </GradientHeader>

      <Box className="p-4">
        {loading ? (
          <Center className="pt-10">
            <Spinner />
          </Center>
        ) : (
          <HStack className="flex-wrap gap-3">
            {statCards.map(({ icon: Icon, label, value, color }) => (
              <Card key={label} className="min-w-[140px] flex-1 rounded-2xl">
                <LinearGradient
                  colors={[`${color}33`, `${color}11`]}
                  style={{ width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}
                >
                  <Icon size={20} color={color} />
                </LinearGradient>
                <Text className="font-[Inter_700Bold] text-3xl font-bold text-text-dark-light dark:text-text-dark-dark">
                  {value}
                </Text>
                <Text className="mt-1 text-xs text-text-light-light dark:text-text-light-dark">{label}</Text>
              </Card>
            ))}
          </HStack>
        )}

        <Text className="mb-3 mt-6 font-[Inter_600SemiBold] text-[13px] uppercase tracking-widest text-text-light-light dark:text-text-light-dark">
          Quick Actions
        </Text>
        <VStack space={10}>
          {ACTION_CARDS.map(({ icon: Icon, label, description, color, nav }) => (
            <Pressable key={label} onPress={() => navigation.navigate(nav.screen as any, (nav as any).params)}>
              <Card className="rounded-2xl">
                <HStack space={14} className="items-center">
                  <LinearGradient
                    colors={[`${color}33`, `${color}11`]}
                    style={{ width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Icon size={22} color={color} />
                  </LinearGradient>
                  <VStack className="flex-1">
                    <Text className="font-[Inter_600SemiBold] text-[14px] text-text-dark-light dark:text-text-dark-dark">
                      {label}
                    </Text>
                    <Text className="text-xs text-text-light-light dark:text-text-light-dark">
                      {description}
                    </Text>
                  </VStack>
                </HStack>
              </Card>
            </Pressable>
          ))}
        </VStack>
      </Box>
    </ScrollView>
  );
}
