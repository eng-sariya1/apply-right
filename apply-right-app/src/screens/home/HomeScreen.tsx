import { useState, useEffect, useCallback } from 'react';
import { Alert, Platform, RefreshControl, StatusBar, View } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useCVContext } from '../../context/CVContext';
import { Plus, FileText, Menu, Trash2, Edit3 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { CVData } from '../../types/cv.types';
import { getCompletionProgress } from '../../utils/cvCompletion';
import {
  Box,
  Card,
  Center,
  FlatList,
  HStack,
  Heading,
  Pressable,
  Spinner,
  Text,
  VStack,
} from '../../components/ui';
import { GradientHeader } from '../../components/ui/GradientHeader';
import { Badge } from '../../components/ui/Badge';
import { brand, colors } from '../../theme/colors';

interface SavedCV extends CVData {
  id: string;
  savedAt: string;
}

const templateLabels: Record<string, string> = {
  template1: 'Classic',
  template2: 'Professional',
  template3: 'Modern',
};

const FAB_SHADOW = Platform.select({
  ios: { shadowColor: brand.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12 },
  android: { elevation: 10 },
  default: {},
});

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { currentUser } = useAuth();
  const { setCvData } = useCVContext();
  const [savedCVs, setSavedCVs] = useState<SavedCV[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCVs = useCallback(async () => {
    if (!currentUser) return;
    try {
      const snap = await getDoc(doc(db, 'cvs', currentUser.uid));
      const list: SavedCV[] = snap.exists() ? (snap.data().cvList || []) : [];
      setSavedCVs(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUser]);

  useEffect(() => { fetchCVs(); }, [fetchCVs]);

  const handleDelete = (id: string, name: string) => {
    if (!currentUser) return;
    Alert.alert('Delete CV', `Are you sure you want to delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const updated = savedCVs.filter((cv) => cv.id !== id);
            await setDoc(doc(db, 'cvs', currentUser.uid), { cvList: updated });
            setSavedCVs(updated);
          } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to delete CV');
          }
        },
      },
    ]);
  };

  const handleEdit = (cv: SavedCV) => {
    const { id, savedAt, ...cvData } = cv;
    setCvData(cvData);
    navigation.navigate('CV Builder', { screen: 'CVBuilder', params: { cvId: id } });
  };

  const renderCV = ({ item }: { item: SavedCV }) => {
    const completion = getCompletionProgress(item);
    const template = templateLabels[item.templateId || 'template1'] || 'Classic';
    const name = item.header?.fullName || 'Untitled CV';
    const barColors: [string, string] = completion >= 85
      ? ['#16a34a', '#4ade80']
      : ['#015C6A', '#22d3ee'];

    return (
      <Card className="mb-3">
        <HStack className="items-start justify-between">
          <HStack space={10} className="flex-1 items-center">
            <Center className="h-10 w-10 rounded-xl bg-primary/10">
              <FileText size={20} color={colors.light.primary} />
            </Center>
            <VStack className="flex-1">
              <Text
                numberOfLines={1}
                className="font-[Inter_600SemiBold] text-[15px] tracking-tight text-text-dark-light dark:text-text-dark-dark"
              >
                {name}
              </Text>
              <View style={{ marginTop: 4 }}>
                <Badge variant="neutral" label={template} size="sm" />
              </View>
            </VStack>
          </HStack>
          <HStack space={8}>
            <Pressable className="p-1.5" onPress={() => handleEdit(item)}>
              <Edit3 size={18} color={colors.light.primary} />
            </Pressable>
            <Pressable className="p-1.5" onPress={() => handleDelete(item.id, name)}>
              <Trash2 size={18} color="#dc2626" />
            </Pressable>
          </HStack>
        </HStack>

        <Box className="mt-3">
          <HStack className="mb-1.5 justify-between">
            <Text className="text-[11px] uppercase tracking-widest text-text-light-light dark:text-text-light-dark">Completion</Text>
            <Text className="font-[Inter_600SemiBold] text-[11px] text-primary">{completion}%</Text>
          </HStack>
          <Box className="h-1.5 rounded-full bg-border-light dark:bg-border-dark overflow-hidden">
            <LinearGradient
              colors={barColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ height: 6, borderRadius: 3, width: `${completion}%` }}
            />
          </Box>
        </Box>
      </Card>
    );
  };

  return (
    <Box className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar barStyle="light-content" backgroundColor={colors.light.statusBar} />

      <GradientHeader style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 24 }}>
        <HStack className="items-end justify-between">
          <VStack>
            <Text className="text-[11px] uppercase tracking-widest text-[#a5d8e0]">Welcome back,</Text>
            <Heading size="xl" className="text-white">
              {currentUser?.displayName?.split(' ')[0] || 'User'}
            </Heading>
          </VStack>
          <Pressable className="p-1" onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Menu size={26} color="#fff" />
          </Pressable>
        </HStack>
      </GradientHeader>

      {loading ? (
        <Center className="flex-1">
          <Spinner />
        </Center>
      ) : (
        <FlatList
          data={savedCVs}
          keyExtractor={(item) => item.id}
          renderItem={renderCV}
          contentContainerClassName="p-4 pb-32"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); fetchCVs(); }}
              tintColor="#017A8C"
            />
          }
          ListEmptyComponent={
            <VStack className="items-center px-8 pt-16">
              <LinearGradient
                colors={['#017A8C', '#015C6A']}
                style={{ width: 88, height: 88, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}
              >
                <FileText size={40} color="#fff" />
              </LinearGradient>
              <Heading size="lg" className="mb-2 text-center">
                No CVs yet
              </Heading>
              <Text className="mb-4 text-center text-sm leading-6 text-text-light-light dark:text-text-light-dark">
                Build your first professional CV in minutes with our AI-powered builder
              </Text>
              <Text className="text-[11px] uppercase tracking-widest text-text-light-light dark:text-text-light-dark">
                Tap + to get started
              </Text>
            </VStack>
          }
          ListHeaderComponent={
            savedCVs.length > 0 ? (
              <Text className="mb-3 font-[Inter_600SemiBold] text-[15px] tracking-tight text-text-dark-light dark:text-text-dark-dark">
                Your CVs ({savedCVs.length})
              </Text>
            ) : null
          }
        />
      )}

      <Pressable
        onPress={() => navigation.navigate('CV Builder', { screen: 'TemplateSelect' })}
        style={[{ position: 'absolute', bottom: 100, right: 20 }, FAB_SHADOW]}
      >
        <LinearGradient
          colors={['#017A8C', '#019baf']}
          style={{ width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' }}
        >
          <Plus size={26} color="#fff" />
        </LinearGradient>
      </Pressable>
    </Box>
  );
}
