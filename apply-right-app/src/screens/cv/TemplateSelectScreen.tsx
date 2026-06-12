import { Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CVBuilderStackParamList } from '../../navigation/CVBuilderStack';
import { useCVContext } from '../../context/CVContext';
import { Check, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { TemplateId } from '../../types/cv.types';
import {
  Box,
  Button,
  ButtonText,
  Center,
  HStack,
  Heading,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from '../../components/ui';
import { GradientHeader } from '../../components/ui/GradientHeader';
import { colors } from '../../theme/colors';

type Nav = StackNavigationProp<CVBuilderStackParamList, 'TemplateSelect'>;

const templates: { id: TemplateId; name: string; desc: string; color: string; colorLight: string; features: string[] }[] = [
  { id: 'template1', name: 'Classic', desc: 'Clean traditional layout with customizable accent colors.', color: '#017A8C', colorLight: '#22d3ee', features: ['Customizable accent color', 'ATS-friendly structure', 'Compact section headers'] },
  { id: 'template2', name: 'Professional', desc: 'Corporate banner header with structured sections.', color: '#0f4c81', colorLight: '#3b82f6', features: ['Bold banner header', 'Two-tone sections', 'Best for business roles'] },
  { id: 'template3', name: 'Modern', desc: 'Minimal monochrome with bold typographic style.', color: '#1a1a2e', colorLight: '#6366f1', features: ['Editorial typography', 'Minimal monochrome', 'Great for tech & creative'] },
];

function getSelectedShadow(color: string) {
  return Platform.select({
    ios: { shadowColor: color, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 12 },
    android: { elevation: 6 },
    default: {},
  });
}

export default function TemplateSelectScreen() {
  const navigation = useNavigation<Nav>();
  const { cvData, setCvData } = useCVContext();
  const selected = cvData.templateId || 'template1';

  const handleSelect = (id: TemplateId) => setCvData({ ...cvData, templateId: id });

  return (
    <Box className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar barStyle="light-content" backgroundColor={colors.light.statusBar} />
      <GradientHeader style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20 }}>
        <HStack space={12} className="items-center">
          <Pressable onPress={() => navigation.goBack()} className="mr-2">
            <ArrowLeft size={22} color="#fff" />
          </Pressable>
          <Heading size="lg" className="font-[Inter_700Bold] tracking-tight text-white">
            Choose Template
          </Heading>
        </HStack>
        <Text className="mt-1 font-[Inter_400Regular] text-[13px] text-[#a5d8e0]">
          Pick a style to get started
        </Text>
      </GradientHeader>

      <ScrollView className="flex-1" contentContainerClassName="p-5">
        <Text className="mb-4 text-[13px] text-text-light-light dark:text-text-light-dark">
          Choose a template to get started. You can switch it later.
        </Text>

        {templates.map((template) => {
          const isSelected = selected === template.id;
          return (
            <Pressable
              key={template.id}
              onPress={() => handleSelect(template.id)}
              className="mb-4 overflow-hidden rounded-2xl border-2 bg-card-light dark:bg-card-dark"
              style={[
                { borderColor: isSelected ? template.color : '#D8EBF0' },
                isSelected ? getSelectedShadow(template.color) : undefined,
              ]}
            >
              <LinearGradient
                colors={[template.color, template.colorLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 6 }}
              />

              <HStack className="items-start p-4">
                <VStack className="flex-1">
                  <HStack space={8} className="mb-1.5 items-center">
                    <Text className="font-[Inter_700Bold] text-[17px] tracking-tight text-text-dark-light dark:text-text-dark-dark">
                      {template.name}
                    </Text>
                    {isSelected && (
                      <Box className="rounded-xl px-2 py-0.5" style={{ backgroundColor: template.color }}>
                        <Text className="font-[Inter_600SemiBold] text-[11px] text-white">Selected</Text>
                      </Box>
                    )}
                  </HStack>
                  <Text className="text-[13px] leading-[18px] text-text-light-light dark:text-text-light-dark">
                    {template.desc}
                  </Text>
                </VStack>
                {isSelected && (
                  <Center className="ml-3 h-7 w-7 rounded-full" style={{ backgroundColor: template.color }}>
                    <Check size={16} color="#fff" />
                  </Center>
                )}
              </HStack>

              <Box className="px-4 pb-4">
                {template.features.map((f, i) => (
                  <HStack key={i} space={6} className="mb-1.5 items-center">
                    <Box className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: template.color }} />
                    <Text className="font-[Inter_400Regular] text-[12px] text-text-light-light dark:text-text-light-dark">{f}</Text>
                  </HStack>
                ))}
              </Box>
            </Pressable>
          );
        })}

        <Button className="mt-2" onPress={() => navigation.navigate('CVBuilder', { templateId: selected })}>
          <ButtonText>Continue with {templates.find((t) => t.id === selected)?.name}</ButtonText>
        </Button>
      </ScrollView>
    </Box>
  );
}
