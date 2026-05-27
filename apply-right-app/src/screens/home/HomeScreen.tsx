import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl, ActivityIndicator, StatusBar } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useCVContext } from '../../context/CVContext';
import { useTheme } from '../../context/ThemeContext';
import { Plus, FileText, Menu, Trash2, Edit3 } from 'lucide-react-native';
import type { CVData } from '../../types/cv.types';
import { getCompletionProgress } from '../../utils/cvCompletion';

interface SavedCV {
  id: string;
  name: string;
  updatedAt: string;
  cvData: CVData;
}

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { currentUser } = useAuth();
  const { setCvData } = useCVContext();
  const { colors } = useTheme();
  const [savedCVs, setSavedCVs] = useState<SavedCV[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCVs = useCallback(async () => {
    if (!currentUser) return;
    try {
      const q = query(collection(db, 'cvs'), where('userId', '==', currentUser.uid));
      const snap = await getDocs(q);
      const cvs: SavedCV[] = snap.docs.map((d) => ({
        id: d.id,
        name: d.data().name || 'Untitled CV',
        updatedAt: d.data().updatedAt || '',
        cvData: d.data().cvData as CVData,
      }));
      setSavedCVs(cvs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUser]);

  useEffect(() => { fetchCVs(); }, [fetchCVs]);

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete CV', `Are you sure you want to delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          await deleteDoc(doc(db, 'cvs', id));
          setSavedCVs((prev) => prev.filter((cv) => cv.id !== id));
        },
      },
    ]);
  };

  const handleEdit = (cv: SavedCV) => {
    setCvData(cv.cvData);
    navigation.navigate('CV Builder', { screen: 'CVBuilder', params: { cvId: cv.id } });
  };

  const renderCV = ({ item }: { item: SavedCV }) => {
    const completion = getCompletionProgress(item.cvData);
    const templateLabels: Record<string, string> = { template1: 'Classic', template2: 'Professional', template3: 'Modern' };
    const template = templateLabels[item.cvData.templateId || 'template1'] || 'Classic';

    return (
      <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
            <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: `${colors.primary}15`, justifyContent: 'center', alignItems: 'center' }}>
              <FileText size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textDark, fontFamily: 'Ubuntu_500Medium' }} numberOfLines={1}>{item.name}</Text>
              <Text style={{ fontSize: 12, color: colors.textLight, fontFamily: 'Ubuntu_300Light', marginTop: 2 }}>{template} template</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity onPress={() => handleEdit(item)} style={{ padding: 6 }}>
              <Edit3 size={18} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id, item.name)} style={{ padding: 6 }}>
              <Trash2 size={18} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Completion bar */}
        <View style={{ marginTop: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ fontSize: 11, color: colors.textLight, fontFamily: 'Ubuntu_300Light' }}>Completion</Text>
            <Text style={{ fontSize: 11, color: colors.primary, fontFamily: 'Ubuntu_500Medium' }}>{completion}%</Text>
          </View>
          <View style={{ height: 4, backgroundColor: colors.border, borderRadius: 2 }}>
            <View style={{ width: `${completion}%` as any, height: 4, backgroundColor: completion >= 85 ? '#22c55e' : colors.primary, borderRadius: 2 }} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Header */}
      <View style={{ backgroundColor: colors.primaryDark, paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <View>
          <Text style={{ fontSize: 13, color: '#a5d8e0', fontFamily: 'Ubuntu_300Light' }}>Welcome back,</Text>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#fff', fontFamily: 'Ubuntu_700Bold' }}>
            {currentUser?.displayName?.split(' ')[0] || 'User'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={{ padding: 4 }}>
          <Menu size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* CV List */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={savedCVs}
          keyExtractor={(item) => item.id}
          renderItem={renderCV}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchCVs(); }} tintColor={colors.primary} />}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingTop: 60 }}>
              <View style={{ width: 80, height: 80, borderRadius: 20, backgroundColor: `${colors.primary}15`, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                <FileText size={36} color={colors.primary} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textDark, fontFamily: 'Ubuntu_500Medium', marginBottom: 8 }}>No CVs yet</Text>
              <Text style={{ fontSize: 14, color: colors.textLight, textAlign: 'center', fontFamily: 'Ubuntu_300Light' }}>Tap the button below to create your first professional CV</Text>
            </View>
          }
          ListHeaderComponent={savedCVs.length > 0 ? (
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textDark, fontFamily: 'Ubuntu_500Medium', marginBottom: 12 }}>Your CVs ({savedCVs.length})</Text>
          ) : null}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        onPress={() => navigation.navigate('CV Builder', { screen: 'TemplateSelect' })}
        style={{ position: 'absolute', bottom: 24, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 8 }}
      >
        <Plus size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
