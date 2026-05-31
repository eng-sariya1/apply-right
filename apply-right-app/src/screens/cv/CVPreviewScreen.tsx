import { useState } from 'react';
import { Alert, Modal, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCVContext } from '../../context/CVContext';
import { Download, Maximize2, X, ArrowLeft } from 'lucide-react-native';
import type { TemplateId } from '../../types/cv.types';
import CVTemplate1 from '../../components/cv/CVTemplate1';
import CVTemplate2 from '../../components/cv/CVTemplate2';
import CVTemplate3 from '../../components/cv/CVTemplate3';
import { exportCvPdf } from '../../utils/exportCvPdf';
import { Box, HStack, Heading, Pressable, ScrollView, Spinner, Text } from '../../components/ui';
import { GradientHeader } from '../../components/ui/GradientHeader';

const templates: { id: TemplateId; label: string }[] = [
  { id: 'template1', label: 'Classic' },
  { id: 'template2', label: 'Professional' },
  { id: 'template3', label: 'Modern' },
];

function RenderTemplate({ tid, data }: { tid: TemplateId; data: any }) {
  if (tid === 'template2') return <CVTemplate2 data={data} />;
  if (tid === 'template3') return <CVTemplate3 data={data} />;
  return <CVTemplate1 data={data} />;
}

export default function CVPreviewScreen() {
  const navigation = useNavigation();
  const { cvData, setCvData } = useCVContext();
  const [fullscreen, setFullscreen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const selected = (cvData.templateId || 'template1') as TemplateId;

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportCvPdf(cvData, selected);
    } catch (err: any) {
      Alert.alert('Export failed', err?.message || 'Could not generate PDF');
    } finally {
      setExporting(false);
    }
  };

  const switchTemplate = (id: TemplateId) => setCvData({ ...cvData, templateId: id });

  return (
    <Box className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar barStyle="light-content" backgroundColor="#015C6A" />
      <GradientHeader style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 }}>
        <HStack className="items-center justify-between">
          <HStack space={12} className="items-center">
            <Pressable onPress={() => navigation.goBack()} className="mr-2">
              <ArrowLeft size={22} color="#fff" />
            </Pressable>
            <Heading size="lg" className="font-[Inter_700Bold] tracking-tight text-white">
              CV Preview
            </Heading>
          </HStack>
          <Pressable onPress={handleExport} disabled={exporting} className={`flex-row items-center gap-1.5 rounded-xl bg-white/20 px-3 py-2 ${exporting ? 'opacity-60' : ''}`}>
            {exporting ? <Spinner size="small" color="#fff" /> : <Download size={16} color="#fff" />}
            <Text className="font-[Inter_600SemiBold] text-[13px] text-white">PDF</Text>
          </Pressable>
        </HStack>
      </GradientHeader>

      <Box className="border-b border-border-light bg-surface-light px-3 py-2.5 dark:border-border-dark dark:bg-surface-dark">
        <HStack className="items-center justify-between">
          <HStack space={6}>
            {templates.map((t) => (
              <Pressable
                key={t.id}
                onPress={() => switchTemplate(t.id)}
                className={`rounded-full px-3 py-1.5 ${selected === t.id ? 'bg-primary' : 'border border-border-light dark:border-border-dark'}`}
              >
                <Text className={`font-[Inter_500Medium] text-[12px] ${selected === t.id ? 'text-white' : 'text-text-light-light dark:text-text-light-dark'}`}>
                  {t.label}
                </Text>
              </Pressable>
            ))}
          </HStack>
          <Pressable onPress={() => setFullscreen(true)} className="rounded-lg p-2">
            <Maximize2 size={18} color="#017A8C" />
          </Pressable>
        </HStack>
      </Box>

      <ScrollView className="flex-1 bg-[#eef2f5]" contentContainerClassName="p-4">
        <Box
          className="overflow-hidden rounded-md bg-white"
          style={{ elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}
        >
          <RenderTemplate tid={selected} data={cvData} />
        </Box>
        <Text className="mt-3 text-center font-[Inter_400Regular] text-[11px] text-text-light-light dark:text-text-light-dark">
          Tap fullscreen for a closer look
        </Text>
      </ScrollView>

      <Modal visible={fullscreen} animationType="slide" onRequestClose={() => setFullscreen(false)}>
        <Box className="flex-1 bg-[#1a1a1a]">
          <HStack className="items-center justify-between bg-[#0a0a0a] px-4 py-3">
            <Text className="font-[Inter_600SemiBold] text-base text-white">CV Preview</Text>
            <Pressable onPress={() => setFullscreen(false)} className="p-1">
              <X size={22} color="#fff" />
            </Pressable>
          </HStack>
          <ScrollView className="flex-1" contentContainerClassName="p-4">
            <Box className="overflow-hidden rounded bg-white">
              <RenderTemplate tid={selected} data={cvData} />
            </Box>
          </ScrollView>
          <Pressable
            onPress={handleExport}
            disabled={exporting}
            className={`flex-row items-center justify-center gap-2 bg-primary py-4 ${exporting ? 'opacity-60' : ''}`}
          >
            {exporting ? <Spinner size="small" color="#fff" /> : <Download size={18} color="#fff" />}
            <Text className="font-[Inter_700Bold] text-[15px] text-white">Export as PDF</Text>
          </Pressable>
        </Box>
      </Modal>
    </Box>
  );
}
