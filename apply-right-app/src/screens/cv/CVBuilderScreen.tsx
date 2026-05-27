import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useCVContext } from '../../context/CVContext';
import { useTheme } from '../../context/ThemeContext';
import { useGeminiCVParser } from '../../hooks/useGeminiCVParser';
import { getCompletionProgress } from '../../utils/cvCompletion';
import { ChevronDown, ChevronUp, Save, Eye, Upload, Plus, Trash2 } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import type { Career, PersonalProject } from '../../types/cv.types';

const NETLIFY_BASE = 'https://apply-right.netlify.app';

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const { colors } = useTheme();
  return (
    <View style={{ backgroundColor: colors.surface, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
      <TouchableOpacity onPress={() => setOpen(!open)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textDark, fontFamily: 'Ubuntu_500Medium' }}>{title}</Text>
        {open ? <ChevronUp size={20} color={colors.textLight} /> : <ChevronDown size={20} color={colors.textLight} />}
      </TouchableOpacity>
      {open && <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>{children}</View>}
    </View>
  );
}

function Field({ label, value, onChange, multiline = false, placeholder = '' }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textLight, fontFamily: 'Ubuntu_500Medium', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder || label}
        placeholderTextColor={colors.textLight}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        style={{ backgroundColor: colors.background, borderWidth: 1.5, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: colors.textDark, fontFamily: 'Ubuntu_300Light', minHeight: multiline ? 80 : undefined, textAlignVertical: multiline ? 'top' : 'center' }}
      />
    </View>
  );
}

export default function CVBuilderScreen() {
  const navigation = useNavigation<any>();
  const { currentUser } = useAuth();
  const { cvData, setCvData } = useCVContext();
  const { colors } = useTheme();
  const { parseCV, isLoading: parsingCV } = useGeminiCVParser();
  const [saving, setSaving] = useState(false);

  const completion = getCompletionProgress(cvData);

  const update = (path: string, value: any) => {
    const parts = path.split('.');
    const newData = JSON.parse(JSON.stringify(cvData));
    let obj: any = newData;
    for (let i = 0; i < parts.length - 1; i++) {
      obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
    setCvData(newData);
  };

  const handleUploadCV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] });
      if (result.canceled) return;
      const file = result.assets[0];
      const content = await FileSystem.readAsStringAsync(file.uri, { encoding: FileSystem.EncodingType.Base64 });
      Alert.alert('Parsing CV', 'AI is extracting your information...');
      const parsed = await parseCV(content);
      setCvData({ ...parsed, templateId: cvData.templateId });
      Alert.alert('Success', 'CV parsed successfully!');
    } catch (err: any) {
      Alert.alert('Error', 'Could not parse CV. Please fill in the form manually.');
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
      const cvId = `${currentUser.uid}_${Date.now()}`;
      await setDoc(doc(db, 'cvs', cvId), {
        userId: currentUser.uid,
        name: cvData.header.fullName || 'My CV',
        cvData,
        updatedAt: new Date().toISOString(),
      });
      Alert.alert('Saved', 'Your CV has been saved successfully!');
    } catch (err) {
      Alert.alert('Error', 'Failed to save CV');
    } finally {
      setSaving(false);
    }
  };

  const addCareer = () => {
    const newCareer: Career = { startDate: '', endDate: null, isPresent: false, location: '', companyName: '', workSpecialization: '', jobType: 'Full time', summarization: '', projects: [] };
    setCvData({ ...cvData, career: [...cvData.career, newCareer] });
  };

  const removeCareer = (idx: number) => {
    setCvData({ ...cvData, career: cvData.career.filter((_, i) => i !== idx) });
  };

  const addProject = () => {
    const newProject: PersonalProject = { title: '', description: '', technologies: '', keyFeatures: [] };
    setCvData({ ...cvData, personalProjects: [...cvData.personalProjects, newProject] });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Completion bar */}
      <View style={{ backgroundColor: colors.surface, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={{ fontSize: 12, color: colors.textLight, fontFamily: 'Ubuntu_300Light' }}>Completion</Text>
          <Text style={{ fontSize: 12, color: completion >= 85 ? '#22c55e' : colors.primary, fontFamily: 'Ubuntu_500Medium' }}>{completion}%</Text>
        </View>
        <View style={{ height: 4, backgroundColor: colors.border, borderRadius: 2 }}>
          <View style={{ width: `${completion}%` as any, height: 4, backgroundColor: completion >= 85 ? '#22c55e' : colors.primary, borderRadius: 2 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>

        {/* Upload button */}
        <TouchableOpacity
          onPress={handleUploadCV}
          disabled={parsingCV}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderColor: colors.primary, borderRadius: 10, paddingVertical: 12, marginBottom: 16, opacity: parsingCV ? 0.7 : 1 }}
        >
          {parsingCV ? <ActivityIndicator size="small" color={colors.primary} /> : <Upload size={18} color={colors.primary} />}
          <Text style={{ color: colors.primary, fontFamily: 'Ubuntu_500Medium', fontSize: 14 }}>
            {parsingCV ? 'Parsing CV...' : 'Upload & Auto-fill from CV'}
          </Text>
        </TouchableOpacity>

        {/* Personal Details */}
        <Section title="Personal Details" defaultOpen>
          <Field label="Full Name" value={cvData.header.fullName} onChange={(v) => update('header.fullName', v)} />
          <Field label="Specialization" value={cvData.header.specialization} onChange={(v) => update('header.specialization', v)} placeholder="e.g. Frontend Developer" />
          <Field label="Email" value={cvData.header.email} onChange={(v) => update('header.email', v)} />
          <Field label="Phone" value={cvData.header.phone} onChange={(v) => update('header.phone', v)} />
        </Section>

        {/* Summary */}
        <Section title="Professional Summary">
          <Field label="Summary" value={cvData.abstract} onChange={(v) => update('abstract', v)} multiline placeholder="Write a compelling professional summary..." />
        </Section>

        {/* Skills */}
        <Section title="Skills">
          <Field label="Skills (comma separated)" value={cvData.skills.join(', ')} onChange={(v) => setCvData({ ...cvData, skills: v.split(',').map((s) => s.trim()).filter(Boolean) })} multiline placeholder="React, TypeScript, Node.js..." />
          <Text style={{ fontSize: 11, color: colors.textLight, fontFamily: 'Ubuntu_300Light' }}>{cvData.skills.length} skills added</Text>
        </Section>

        {/* Career History */}
        <Section title={`Career History (${cvData.career.length})`}>
          {cvData.career.map((job, idx) => (
            <View key={idx} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textDark, fontFamily: 'Ubuntu_500Medium' }}>Job #{idx + 1}</Text>
                <TouchableOpacity onPress={() => removeCareer(idx)}><Trash2 size={16} color={colors.error} /></TouchableOpacity>
              </View>
              <Field label="Company" value={job.companyName} onChange={(v) => { const c = [...cvData.career]; c[idx] = { ...c[idx], companyName: v }; setCvData({ ...cvData, career: c }); }} />
              <Field label="Position" value={job.workSpecialization} onChange={(v) => { const c = [...cvData.career]; c[idx] = { ...c[idx], workSpecialization: v }; setCvData({ ...cvData, career: c }); }} />
              <Field label="Start Date" value={job.startDate} onChange={(v) => { const c = [...cvData.career]; c[idx] = { ...c[idx], startDate: v }; setCvData({ ...cvData, career: c }); }} placeholder="Jan 2022" />
              <Field label="End Date (leave blank if current)" value={job.endDate || ''} onChange={(v) => { const c = [...cvData.career]; c[idx] = { ...c[idx], endDate: v || null, isPresent: !v }; setCvData({ ...cvData, career: c }); }} placeholder="Dec 2023" />
              <Field label="Description" value={job.summarization} onChange={(v) => { const c = [...cvData.career]; c[idx] = { ...c[idx], summarization: v }; setCvData({ ...cvData, career: c }); }} multiline />
            </View>
          ))}
          <TouchableOpacity onPress={addCareer} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10 }}>
            <Plus size={18} color={colors.primary} />
            <Text style={{ color: colors.primary, fontFamily: 'Ubuntu_500Medium', fontSize: 14 }}>Add Job</Text>
          </TouchableOpacity>
        </Section>

        {/* Personal Projects */}
        <Section title={`Personal Projects (${cvData.personalProjects.length})`}>
          {cvData.personalProjects.map((proj, idx) => (
            <View key={idx} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textDark, fontFamily: 'Ubuntu_500Medium' }}>Project #{idx + 1}</Text>
                <TouchableOpacity onPress={() => setCvData({ ...cvData, personalProjects: cvData.personalProjects.filter((_, i) => i !== idx) })}><Trash2 size={16} color={colors.error} /></TouchableOpacity>
              </View>
              <Field label="Title" value={proj.title} onChange={(v) => { const p = [...cvData.personalProjects]; p[idx] = { ...p[idx], title: v }; setCvData({ ...cvData, personalProjects: p }); }} />
              <Field label="Technologies" value={proj.technologies} onChange={(v) => { const p = [...cvData.personalProjects]; p[idx] = { ...p[idx], technologies: v }; setCvData({ ...cvData, personalProjects: p }); }} />
              <Field label="Description" value={proj.description} onChange={(v) => { const p = [...cvData.personalProjects]; p[idx] = { ...p[idx], description: v }; setCvData({ ...cvData, personalProjects: p }); }} multiline />
            </View>
          ))}
          <TouchableOpacity onPress={addProject} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10 }}>
            <Plus size={18} color={colors.primary} />
            <Text style={{ color: colors.primary, fontFamily: 'Ubuntu_500Medium', fontSize: 14 }}>Add Project</Text>
          </TouchableOpacity>
        </Section>

        {/* Education */}
        <Section title="Education">
          <Field label="Education" value={cvData.education} onChange={(v) => update('education', v)} multiline placeholder="Bachelor's in Computer Science, XYZ University (2020-2024)" />
        </Section>

        {/* Additional Info */}
        <Section title="Additional Info & Certifications">
          <Field label="Additional Information" value={cvData.additionalInfo || ''} onChange={(v) => update('additionalInfo', v)} multiline placeholder="Certifications, languages, interests..." />
        </Section>
      </ScrollView>

      {/* Bottom actions */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: 'row', padding: 12, gap: 10 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('CVPreview')}
          style={{ flex: 1, borderWidth: 1.5, borderColor: colors.primary, borderRadius: 10, paddingVertical: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          <Eye size={18} color={colors.primary} />
          <Text style={{ color: colors.primary, fontFamily: 'Ubuntu_700Bold', fontSize: 14 }}>Preview</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={{ flex: 1, backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: saving ? 0.7 : 1 }}
        >
          {saving ? <ActivityIndicator size="small" color="#fff" /> : <Save size={18} color="#fff" />}
          <Text style={{ color: '#fff', fontFamily: 'Ubuntu_700Bold', fontSize: 14 }}>{saving ? 'Saving...' : 'Save CV'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
