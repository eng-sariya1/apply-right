import { useState, useEffect } from 'react';
import { Alert, Image, Platform, StatusBar } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useCVContext } from '../../context/CVContext';
import { useGeminiCVParser } from '../../hooks/useGeminiCVParser';
import { getCompletionProgress } from '../../utils/cvCompletion';
import { exportCvPdf } from '../../utils/exportCvPdf';
import { ChevronDown, ChevronUp, Save, Eye, Upload, Plus, Trash2, Download, RotateCcw, ArrowLeft, Sparkles } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import type { Career, EducationEntry, PersonalProject, TemplateId } from '../../types/cv.types';
import { useGemini } from '../../hooks/useGemini';
import { useGeminiCareer } from '../../hooks/useGeminiCareer';
import { useGeminiEducation } from '../../hooks/useGeminiEducation';
import { useGeminiProjects } from '../../hooks/useGeminiProjects';
import type { CVBuilderStackParamList } from '../../navigation/CVBuilderStack';
import {
  Box,
  Card,
  HStack,
  Heading,
  Input,
  InputField,
  Pressable,
  ScrollView,
  Spinner,
  Text,
} from '../../components/ui';
import type { ReactNode } from 'react';
import { Badge } from '../../components/ui/Badge';
import { GradientHeader } from '../../components/ui/GradientHeader';

const TOOLBAR_SHADOW = Platform.select({
  ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  android: { elevation: 8 },
  default: {},
});

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunk = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
  }
  // @ts-ignore - btoa is available in React Native's global scope
  return global.btoa(binary);
}

const TEMPLATES: { id: TemplateId; label: string; color: string }[] = [
  { id: 'template1', label: 'Classic', color: '#017A8C' },
  { id: 'template2', label: 'Professional', color: '#0f4c81' },
  { id: 'template3', label: 'Modern', color: '#1a1a2e' },
];

const EMPTY_CV = {
  header: { fullName: '', specialization: '', email: '', phone: '', links: [], address: '' },
  abstract: '',
  skills: [],
  career: [],
  personalProjects: [],
  education: '',
  templateId: 'template1' as TemplateId,
  sectionTitleColor: '017A8C',
};

function Section({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="mb-3 overflow-hidden rounded-2xl p-0">
      <Pressable
        onPress={() => setOpen(!open)}
        className="flex-row items-center justify-between p-4"
      >
        <Text className="font-[Inter_600SemiBold] text-[15px] tracking-tight text-text-dark-light dark:text-text-dark-dark">
          {title}
        </Text>
        {open ? <ChevronUp size={20} color="#88B7C4" /> : <ChevronDown size={20} color="#88B7C4" />}
      </Pressable>
      {open && <Box className="px-4 pb-4">{children}</Box>}
    </Card>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  placeholder = '',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <Box className="mb-3">
      <Text className="mb-1 font-[Inter_500Medium] text-[11px] uppercase tracking-wide text-text-light-light dark:text-text-light-dark">
        {label}
      </Text>
      <Input className={`bg-background-light dark:bg-background-dark ${multiline ? 'items-start' : ''}`}>
        <InputField
          value={value}
          onChangeText={onChange}
          placeholder={placeholder || label}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          textAlignVertical={multiline ? 'top' : 'center'}
          className={multiline ? 'min-h-[80px] font-[Inter_400Regular] text-sm' : 'font-[Inter_400Regular] text-sm'}
        />
      </Input>
    </Box>
  );
}

type BuilderRoute = RouteProp<CVBuilderStackParamList, 'CVBuilder'>;

export default function CVBuilderScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<BuilderRoute>();
  const insets = useSafeAreaInsets();
  const { currentUser } = useAuth();
  const { cvData, setCvData } = useCVContext();
  const { parseCV, isLoading: parsingCV } = useGeminiCVParser();
  const { improveText: improveAbstract } = useGemini();
  const { improveText: improveCareer } = useGeminiCareer();
  const { improveText: improveEducation } = useGeminiEducation();
  const { improveText: improveProject } = useGeminiProjects();
  const [improvingField, setImprovingField] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [activeCvId, setActiveCvId] = useState<string | null>(route.params?.cvId || null);

  useEffect(() => {
    if (route.params?.templateId && (route.params.templateId as TemplateId) !== cvData.templateId) {
      setCvData({ ...cvData, templateId: route.params.templateId as TemplateId });
    }
    if (route.params?.cvId) setActiveCvId(route.params.cvId);
  }, [route.params?.templateId, route.params?.cvId]);

  const completion = getCompletionProgress(cvData);

  const update = (path: string, value: any) => {
    const parts = path.split('.');
    const newData = JSON.parse(JSON.stringify(cvData));
    let obj: any = newData;
    for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
    obj[parts[parts.length - 1]] = value;
    setCvData(newData);
  };

  const setTemplate = (id: TemplateId) => setCvData({ ...cvData, templateId: id });

  const handleReset = () => {
    Alert.alert('Reset CV', 'This will clear all fields. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          setCvData({ ...EMPTY_CV, templateId: cvData.templateId || 'template1' } as any);
          setActiveCvId(null);
        },
      },
    ]);
  };

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      base64: true,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0].base64) {
      const mime = result.assets[0].mimeType || 'image/jpeg';
      update('header.photoUrl', `data:${mime};base64,${result.assets[0].base64}`);
    }
  };

  const handleUploadCV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
      if (result.canceled) return;
      const file = result.assets[0];
      const mimeType = file.mimeType || 'application/pdf';
      if (mimeType !== 'application/pdf') {
        Alert.alert('Unsupported', 'Please upload a PDF file.');
        return;
      }
      const response = await fetch(file.uri);
      const arrayBuffer = await response.arrayBuffer();
      const base64 = arrayBufferToBase64(arrayBuffer);
      Alert.alert('Parsing CV', 'AI is extracting your information...');
      const parsed = await parseCV({ base64, mimeType });
      setCvData({ ...parsed, templateId: cvData.templateId });
      Alert.alert('Success', 'CV parsed successfully!');
    } catch (err: any) {
      console.error('CV parse error:', err);
      Alert.alert('Error', err?.message || 'Could not parse CV. Please fill in the form manually.');
    }
  };

  const handleSave = async () => {
    if (!currentUser) return;
    if (!cvData.header.fullName) {
      Alert.alert('Required', 'Please enter your full name');
      return;
    }
    setSaving(true);
    try {
      const userCvsRef = doc(db, 'cvs', currentUser.uid);
      const snap = await getDoc(userCvsRef);
      const currentList: any[] = snap.exists() ? (snap.data().cvList || []) : [];
      const stamped = { ...cvData, savedAt: new Date().toISOString() };
      let nextList: any[];
      let newId = activeCvId;
      if (activeCvId) {
        const idx = currentList.findIndex((c) => c.id === activeCvId);
        if (idx >= 0) {
          nextList = [...currentList];
          nextList[idx] = { ...stamped, id: activeCvId };
        } else {
          nextList = [...currentList, { ...stamped, id: activeCvId }];
        }
      } else {
        newId = `${currentUser.uid}_${Date.now()}`;
        nextList = [...currentList, { ...stamped, id: newId }];
      }
      await setDoc(userCvsRef, { cvList: nextList });
      setActiveCvId(newId);
      Alert.alert('Saved', activeCvId ? 'Your CV has been updated.' : 'Your CV has been saved.');
    } catch {
      Alert.alert('Error', 'Failed to save CV');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportCvPdf(cvData, cvData.templateId || 'template1');
    } catch (err: any) {
      Alert.alert('Export failed', err?.message || 'Could not generate PDF');
    } finally {
      setExporting(false);
    }
  };

  const addCareer = () => {
    const newCareer: Career = {
      startDate: '', endDate: null, isPresent: false, location: '', companyName: '',
      workSpecialization: '', jobType: 'Full time', summarization: '', projects: [],
    };
    setCvData({ ...cvData, career: [...cvData.career, newCareer] });
  };

  const removeCareer = (idx: number) =>
    setCvData({ ...cvData, career: cvData.career.filter((_, i) => i !== idx) });

  const addProject = () => {
    const newProject: PersonalProject = { title: '', description: '', technologies: '', keyFeatures: [] };
    setCvData({ ...cvData, personalProjects: [...cvData.personalProjects, newProject] });
  };

  const addEducationEntry = () => {
    const entry: EducationEntry = { degree: '', institution: '', location: '', graduationYear: '' };
    setCvData({ ...cvData, educationEntries: [...(cvData.educationEntries || []), entry] });
  };

  const removeEducationEntry = (idx: number) =>
    setCvData({ ...cvData, educationEntries: (cvData.educationEntries || []).filter((_, i) => i !== idx) });

  const templateId = cvData.templateId || 'template1';

  const careerLabel = templateId === 'template2' ? 'Professional Experience' : templateId === 'template3' ? 'Work Experience' : 'Career History';
  const skillsLabel = templateId === 'template2' ? 'Technical Skills' : 'Skills';
  const summaryLabel = templateId === 'template1' ? 'Abstract' : templateId === 'template2' ? 'Summary' : 'Professional Summary';

  const handleImprove = async (
    fieldKey: string,
    text: string,
    improveText: (t: string) => Promise<string>,
    onSuccess: (improved: string) => void,
  ) => {
    if (!text.trim()) return;
    setImprovingField(fieldKey);
    try {
      const result = await improveText(text);
      onSuccess(result);
    } catch {
      Alert.alert('AI Error', 'Could not improve text. Please try again.');
    } finally {
      setImprovingField(null);
    }
  };

  return (
    <Box className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar barStyle="light-content" backgroundColor="#015C6A" />
      <GradientHeader style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 }}>
        <HStack space={12} className="items-center">
          <Pressable onPress={() => navigation.goBack()} className="mr-2">
            <ArrowLeft size={22} color="#fff" />
          </Pressable>
          <Heading size="lg" className="font-[Inter_700Bold] tracking-tight text-white">
            Build Your CV
          </Heading>
        </HStack>
      </GradientHeader>

      <Box className="border-b border-border-light bg-surface-light px-4 py-2.5 dark:border-border-dark dark:bg-surface-dark">
        <HStack className="mb-1.5 items-center justify-between">
          <HStack space={6} className="items-center">
            {activeCvId && (
              <Badge variant="primary" label="Editing" size="sm" />
            )}
            <Text className="font-[Inter_400Regular] text-[11px] uppercase tracking-widest text-text-light-light dark:text-text-light-dark">Completion</Text>
          </HStack>
          <Text className={`font-[Inter_600SemiBold] text-xs ${completion >= 85 ? 'text-success-light' : 'text-primary'}`}>
            {completion}%
          </Text>
        </HStack>
        <Box className="h-1.5 overflow-hidden rounded-full bg-border-light dark:bg-border-dark">
          <LinearGradient
            colors={completion >= 85 ? ['#16a34a', '#4ade80'] : ['#015C6A', '#22d3ee']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: 6, borderRadius: 3, width: `${completion}%` }}
          />
        </Box>

        <HStack space={6} className="mt-3 flex-wrap">
          {TEMPLATES.map((t) => {
            const isActive = (cvData.templateId || 'template1') === t.id;
            return (
              <Pressable
                key={t.id}
                onPress={() => setTemplate(t.id)}
                className={`rounded-full px-3 py-1 ${isActive ? '' : 'border border-border-light dark:border-border-dark'}`}
                style={isActive ? { backgroundColor: t.color } : undefined}
              >
                <Text className={`font-[Inter_500Medium] text-[11px] ${isActive ? 'text-white' : 'text-text-light-light dark:text-text-light-dark'}`}>
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </HStack>
      </Box>

      <ScrollView contentContainerClassName="p-4 pb-52">
        <HStack space={8} className="mb-4">
          <Pressable
            onPress={handleUploadCV}
            disabled={parsingCV}
            className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl border-2 border-primary py-3 ${parsingCV ? 'opacity-60' : ''}`}
          >
            {parsingCV ? <Spinner size="small" color="#017A8C" /> : <Upload size={18} color="#017A8C" />}
            <Text className="font-[Inter_500Medium] text-sm text-primary">
              {parsingCV ? 'Parsing...' : 'Upload PDF'}
            </Text>
          </Pressable>
          <Pressable
            onPress={handleReset}
            className="flex-row items-center justify-center gap-1.5 rounded-xl border-2 border-[#ef4444] px-3 py-3"
          >
            <RotateCcw size={16} color="#ef4444" />
            <Text className="font-[Inter_500Medium] text-sm text-[#ef4444]">Reset</Text>
          </Pressable>
        </HStack>

        {/* ── Personal Details ── */}
        <Section title="Personal Details" defaultOpen>
          <Field label="Full Name" value={cvData.header.fullName} onChange={(v) => update('header.fullName', v)} />
          <Field label="Specialization" value={cvData.header.specialization} onChange={(v) => update('header.specialization', v)} placeholder="e.g. Frontend Developer" />
          <Field label="Email" value={cvData.header.email} onChange={(v) => update('header.email', v)} />
          <Field label="Phone" value={cvData.header.phone} onChange={(v) => update('header.phone', v)} />
          {(templateId === 'template2' || templateId === 'template3') && (
            <Field label="Location" value={cvData.header.address || ''} onChange={(v) => update('header.address', v)} placeholder="City, Country" />
          )}
          {templateId === 'template2' && (
            <Box className="mb-3">
              <Text className="mb-1 font-[Inter_500Medium] text-[11px] uppercase tracking-wide text-text-light-light dark:text-text-light-dark">
                Profile Photo
              </Text>
              {cvData.header.photoUrl ? (
                <HStack space={10} className="items-center">
                  <Image
                    source={{ uri: cvData.header.photoUrl }}
                    style={{ width: 64, height: 64, borderRadius: 32 }}
                  />
                  <Box>
                    <Pressable onPress={handlePickPhoto} className="mb-1.5 rounded-lg border border-primary px-3 py-1.5">
                      <Text className="font-[Inter_500Medium] text-xs text-primary">Change Photo</Text>
                    </Pressable>
                    <Pressable onPress={() => update('header.photoUrl', '')} className="rounded-lg border border-[#ef4444] px-3 py-1.5">
                      <Text className="font-[Inter_500Medium] text-xs text-[#ef4444]">Remove</Text>
                    </Pressable>
                  </Box>
                </HStack>
              ) : (
                <Pressable
                  onPress={handlePickPhoto}
                  className="flex-row items-center gap-2 rounded-xl border-2 border-dashed border-primary py-3 px-4"
                >
                  <Plus size={18} color="#017A8C" />
                  <Text className="font-[Inter_500Medium] text-sm text-primary">Add Photo</Text>
                </Pressable>
              )}
            </Box>
          )}
        </Section>

        {/* ── Abstract / Summary ── */}
        <Section title={summaryLabel}>
          <Field label={summaryLabel} value={cvData.abstract} onChange={(v) => update('abstract', v)} multiline placeholder="Write a compelling professional summary..." />
          {cvData.abstract.trim() ? (
            <Pressable
              onPress={() => handleImprove('abstract', cvData.abstract, improveAbstract, (v) => update('abstract', v))}
              disabled={improvingField === 'abstract'}
              className="mb-1 self-end flex-row items-center gap-1 rounded-lg border border-primary px-3 py-1.5"
            >
              {improvingField === 'abstract' ? <Spinner size="small" color="#017A8C" /> : <Sparkles size={13} color="#017A8C" />}
              <Text className="font-[Inter_500Medium] text-xs text-primary">Improve with AI</Text>
            </Pressable>
          ) : null}
        </Section>

        {/* ── Skills (Classic only — before career) ── */}
        {templateId === 'template1' && (
          <Section title="Skills">
            <Field
              label="Skills (comma separated)"
              value={cvData.skills.join(', ')}
              onChange={(v) => setCvData({ ...cvData, skills: v.split(',').map((s) => s.trim()).filter(Boolean) })}
              multiline
              placeholder="React, TypeScript, Node.js..."
            />
            <Text className="font-[Inter_400Regular] text-[11px] text-text-light-light dark:text-text-light-dark">
              {cvData.skills.length} skills added
            </Text>
          </Section>
        )}

        {/* ── Career / Work Experience ── */}
        <Section title={`${careerLabel} (${cvData.career.length})`}>
          {cvData.career.map((job, idx) => (
            <Box key={idx} className="mb-3 rounded-xl border border-border-light p-3 dark:border-border-dark">
              <HStack className="mb-2 justify-between">
                <Text className="font-[Inter_600SemiBold] text-[13px] text-text-dark-light dark:text-text-dark-dark">
                  Job #{idx + 1}
                </Text>
                <Pressable onPress={() => removeCareer(idx)}>
                  <Trash2 size={16} color="#ef4444" />
                </Pressable>
              </HStack>
              <Field label="Company" value={job.companyName} onChange={(v) => { const c = [...cvData.career]; c[idx] = { ...c[idx], companyName: v }; setCvData({ ...cvData, career: c }); }} />
              <Field label={templateId === 'template3' ? 'Job Title' : 'Position'} value={job.workSpecialization} onChange={(v) => { const c = [...cvData.career]; c[idx] = { ...c[idx], workSpecialization: v }; setCvData({ ...cvData, career: c }); }} />
              <Field label="Location" value={job.location} onChange={(v) => { const c = [...cvData.career]; c[idx] = { ...c[idx], location: v }; setCvData({ ...cvData, career: c }); }} placeholder="City, Country" />
              <Field label="Start Date" value={job.startDate} onChange={(v) => { const c = [...cvData.career]; c[idx] = { ...c[idx], startDate: v }; setCvData({ ...cvData, career: c }); }} placeholder="Jan 2022" />
              <Field label="End Date (leave blank if current)" value={job.endDate || ''} onChange={(v) => { const c = [...cvData.career]; c[idx] = { ...c[idx], endDate: v || null, isPresent: !v }; setCvData({ ...cvData, career: c }); }} placeholder="Dec 2023" />
              <Field label={templateId === 'template3' ? 'Responsibilities & Achievements' : 'Description'} value={job.summarization} onChange={(v) => { const c = [...cvData.career]; c[idx] = { ...c[idx], summarization: v }; setCvData({ ...cvData, career: c }); }} multiline />
              {job.summarization.trim() ? (
                <Pressable
                  onPress={() => handleImprove(`career-${idx}`, job.summarization, improveCareer, (v) => { const c = [...cvData.career]; c[idx] = { ...c[idx], summarization: v }; setCvData({ ...cvData, career: c }); })}
                  disabled={improvingField === `career-${idx}`}
                  className="mb-1 self-end flex-row items-center gap-1 rounded-lg border border-primary px-3 py-1.5"
                >
                  {improvingField === `career-${idx}` ? <Spinner size="small" color="#017A8C" /> : <Sparkles size={13} color="#017A8C" />}
                  <Text className="font-[Inter_500Medium] text-xs text-primary">Improve with AI</Text>
                </Pressable>
              ) : null}
            </Box>
          ))}
          <Pressable onPress={addCareer} className="flex-row items-center gap-2 py-2.5">
            <Plus size={18} color="#017A8C" />
            <Text className="font-[Inter_500Medium] text-sm text-primary">Add Job</Text>
          </Pressable>
        </Section>

        {/* ── Personal Projects (Classic only) ── */}
        {templateId === 'template1' && (
          <Section title={`Personal Projects (${cvData.personalProjects.length})`}>
            {cvData.personalProjects.map((proj, idx) => (
              <Box key={idx} className="mb-3 rounded-xl border border-border-light p-3 dark:border-border-dark">
                <HStack className="mb-2 justify-between">
                  <Text className="font-[Inter_600SemiBold] text-[13px] text-text-dark-light dark:text-text-dark-dark">
                    Project #{idx + 1}
                  </Text>
                  <Pressable
                    onPress={() => setCvData({ ...cvData, personalProjects: cvData.personalProjects.filter((_, i) => i !== idx) })}
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </Pressable>
                </HStack>
                <Field label="Title" value={proj.title} onChange={(v) => { const p = [...cvData.personalProjects]; p[idx] = { ...p[idx], title: v }; setCvData({ ...cvData, personalProjects: p }); }} />
                <Field label="Technologies" value={proj.technologies} onChange={(v) => { const p = [...cvData.personalProjects]; p[idx] = { ...p[idx], technologies: v }; setCvData({ ...cvData, personalProjects: p }); }} />
                <Field label="Description" value={proj.description} onChange={(v) => { const p = [...cvData.personalProjects]; p[idx] = { ...p[idx], description: v }; setCvData({ ...cvData, personalProjects: p }); }} multiline />
                {proj.description.trim() ? (
                  <Pressable
                    onPress={() => handleImprove(`project-${idx}`, proj.description, improveProject, (v) => { const p = [...cvData.personalProjects]; p[idx] = { ...p[idx], description: v }; setCvData({ ...cvData, personalProjects: p }); })}
                    disabled={improvingField === `project-${idx}`}
                    className="mb-1 self-end flex-row items-center gap-1 rounded-lg border border-primary px-3 py-1.5"
                  >
                    {improvingField === `project-${idx}` ? <Spinner size="small" color="#017A8C" /> : <Sparkles size={13} color="#017A8C" />}
                    <Text className="font-[Inter_500Medium] text-xs text-primary">Improve with AI</Text>
                  </Pressable>
                ) : null}
                <Field
                  label="Key Features (comma separated)"
                  value={(proj.keyFeatures || []).join(', ')}
                  onChange={(v) => { const p = [...cvData.personalProjects]; p[idx] = { ...p[idx], keyFeatures: v.split(',').map((s) => s.trim()).filter(Boolean) }; setCvData({ ...cvData, personalProjects: p }); }}
                  multiline
                />
              </Box>
            ))}
            <Pressable onPress={addProject} className="flex-row items-center gap-2 py-2.5">
              <Plus size={18} color="#017A8C" />
              <Text className="font-[Inter_500Medium] text-sm text-primary">Add Project</Text>
            </Pressable>
          </Section>
        )}

        {/* ── Education ── */}
        {templateId === 'template3' ? (
          <Section title={`Education (${(cvData.educationEntries || []).length})`}>
            {(cvData.educationEntries || []).map((entry, idx) => (
              <Box key={idx} className="mb-3 rounded-xl border border-border-light p-3 dark:border-border-dark">
                <HStack className="mb-2 justify-between">
                  <Text className="font-[Inter_600SemiBold] text-[13px] text-text-dark-light dark:text-text-dark-dark">
                    Entry #{idx + 1}
                  </Text>
                  <Pressable onPress={() => removeEducationEntry(idx)}>
                    <Trash2 size={16} color="#ef4444" />
                  </Pressable>
                </HStack>
                <Field label="Degree / Program" value={entry.degree} onChange={(v) => { const e = [...(cvData.educationEntries || [])]; e[idx] = { ...e[idx], degree: v }; setCvData({ ...cvData, educationEntries: e }); }} placeholder="B.Sc. Computer Science" />
                <Field label="Institution" value={entry.institution} onChange={(v) => { const e = [...(cvData.educationEntries || [])]; e[idx] = { ...e[idx], institution: v }; setCvData({ ...cvData, educationEntries: e }); }} />
                <Field label="Location" value={entry.location} onChange={(v) => { const e = [...(cvData.educationEntries || [])]; e[idx] = { ...e[idx], location: v }; setCvData({ ...cvData, educationEntries: e }); }} placeholder="City, Country" />
                <Field label="Graduation Year" value={entry.graduationYear} onChange={(v) => { const e = [...(cvData.educationEntries || [])]; e[idx] = { ...e[idx], graduationYear: v }; setCvData({ ...cvData, educationEntries: e }); }} placeholder="2024" />
              </Box>
            ))}
            <Pressable onPress={addEducationEntry} className="flex-row items-center gap-2 py-2.5">
              <Plus size={18} color="#017A8C" />
              <Text className="font-[Inter_500Medium] text-sm text-primary">Add Education</Text>
            </Pressable>
          </Section>
        ) : (
          <Section title="Education">
            <Field label="Education" value={cvData.education} onChange={(v) => update('education', v)} multiline placeholder="Bachelor's in Computer Science, XYZ University (2020-2024)" />
            {cvData.education.trim() ? (
              <Pressable
                onPress={() => handleImprove('education', cvData.education, improveEducation, (v) => update('education', v))}
                disabled={improvingField === 'education'}
                className="mb-1 self-end flex-row items-center gap-1 rounded-lg border border-primary px-3 py-1.5"
              >
                {improvingField === 'education' ? <Spinner size="small" color="#017A8C" /> : <Sparkles size={13} color="#017A8C" />}
                <Text className="font-[Inter_500Medium] text-xs text-primary">Improve with AI</Text>
              </Pressable>
            ) : null}
          </Section>
        )}

        {/* ── Skills (Professional & Modern — after Education) ── */}
        {(templateId === 'template2' || templateId === 'template3') && (
          <Section title={skillsLabel}>
            <Field
              label="Skills (comma separated)"
              value={cvData.skills.join(', ')}
              onChange={(v) => setCvData({ ...cvData, skills: v.split(',').map((s) => s.trim()).filter(Boolean) })}
              multiline
              placeholder="React, TypeScript, Node.js..."
            />
            <Text className="font-[Inter_400Regular] text-[11px] text-text-light-light dark:text-text-light-dark">
              {cvData.skills.length} skills added
            </Text>
          </Section>
        )}

        {/* ── Additional Information (Professional only) ── */}
        {templateId === 'template2' && (
          <Section title="Additional Information">
            <Field
              label="Additional Information"
              value={cvData.additionalInfo || ''}
              onChange={(v) => update('additionalInfo', v)}
              multiline
              placeholder="Languages, certifications, interests..."
            />
          </Section>
        )}

        {/* ── Certifications (Modern only) ── */}
        {templateId === 'template3' && (
          <Section title="Certifications">
            <Field
              label="Certifications"
              value={cvData.certifications || ''}
              onChange={(v) => update('certifications', v)}
              multiline
              placeholder="AWS Certified Developer, Google Cloud Professional..."
            />
          </Section>
        )}
      </ScrollView>

      <HStack
        space={6}
        className="absolute left-0 right-0 border-t border-border-light bg-surface-light p-3 dark:border-border-dark dark:bg-surface-dark"
        style={[TOOLBAR_SHADOW, { bottom: insets.bottom + 92 }]}
      >
        <Pressable
          onPress={() => navigation.navigate('CVPreview')}
          className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl border-2 border-primary py-3"
        >
          <Eye size={16} color="#017A8C" />
          <Text className="font-[Inter_700Bold] text-[13px] text-primary">Preview</Text>
        </Pressable>
        <Pressable
          onPress={handleExport}
          disabled={exporting}
          className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-xl border-2 border-primary py-3 ${exporting ? 'opacity-60' : ''}`}
        >
          {exporting ? <Spinner size="small" color="#017A8C" /> : <Download size={16} color="#017A8C" />}
          <Text className="font-[Inter_700Bold] text-[13px] text-primary">PDF</Text>
        </Pressable>
        <Pressable
          onPress={handleSave}
          disabled={saving}
          className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-xl bg-primary py-3 ${saving ? 'opacity-60' : ''}`}
        >
          {saving ? <Spinner size="small" color="#fff" /> : <Save size={16} color="#fff" />}
          <Text className="font-[Inter_700Bold] text-[13px] text-white">{saving ? 'Saving...' : activeCvId ? 'Update' : 'Save'}</Text>
        </Pressable>
      </HStack>
    </Box>
  );
}
