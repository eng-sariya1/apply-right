import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useTheme } from '../../context/ThemeContext';
import { Users, FileText, Shield } from 'lucide-react-native';

export default function DashboardScreen() {
  const { colors } = useTheme();
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
    { icon: Users, label: 'Total Users', value: stats.totalUsers, color: colors.primary },
    { icon: FileText, label: 'Total CVs', value: stats.totalCVs, color: '#6366f1' },
    { icon: Shield, label: 'Admins', value: stats.adminUsers, color: '#f59e0b' },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <View style={{ backgroundColor: colors.primaryDark, paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Shield size={24} color="#fff" />
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#fff', fontFamily: 'Ubuntu_700Bold' }}>Admin Dashboard</Text>
        </View>
      </View>

      <View style={{ padding: 16 }}>
        {loading ? (
          <View style={{ paddingTop: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {statCards.map(({ icon: Icon, label, value, color }) => (
              <View key={label} style={{ flex: 1, minWidth: 140, backgroundColor: colors.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border }}>
                <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: `${color}15`, justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
                  <Icon size={20} color={color} />
                </View>
                <Text style={{ fontSize: 28, fontWeight: '700', color: colors.textDark, fontFamily: 'Ubuntu_700Bold' }}>{value}</Text>
                <Text style={{ fontSize: 12, color: colors.textLight, fontFamily: 'Ubuntu_300Light', marginTop: 4 }}>{label}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
