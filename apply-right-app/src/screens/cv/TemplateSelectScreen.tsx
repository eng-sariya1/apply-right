import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CVBuilderStackParamList } from '../../navigation/CVBuilderStack';
import { useTheme } from '../../context/ThemeContext';
import { useCVContext } from '../../context/CVContext';
import { Check } from 'lucide-react-native';
import type { TemplateId } from '../../types/cv.types';

type Nav = StackNavigationProp<CVBuilderStackParamList, 'TemplateSelect'>;

const templates: { id: TemplateId; name: string; desc: string; color: string }[] = [
  { id: 'template1', name: 'Classic', desc: 'Clean traditional layout with customizable accent colors. Perfect for most industries.', color: '#017A8C' },
  { id: 'template2', name: 'Professional', desc: 'Corporate design with photo support and structured sections. Ideal for business roles.', color: '#0f4c81' },
  { id: 'template3', name: 'Modern', desc: 'Minimal black-and-white design with a bold typographic style. Great for tech and creative fields.', color: '#1a1a2e' },
];

export default function TemplateSelectScreen() {
  const navigation = useNavigation<Nav>();
  const { colors } = useTheme();
  const { cvData, setCvData } = useCVContext();
  const selected = cvData.templateId || 'template1';

  const handleSelect = (id: TemplateId) => {
    setCvData({ ...cvData, templateId: id });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 13, color: colors.textLight, fontFamily: 'Ubuntu_300Light', marginBottom: 16 }}>
          Choose a template to get started. You can switch it later.
        </Text>

        {templates.map((template) => {
          const isSelected = selected === template.id;
          return (
            <TouchableOpacity
              key={template.id}
              onPress={() => handleSelect(template.id)}
              style={{ backgroundColor: colors.surface, borderRadius: 16, marginBottom: 16, borderWidth: 2, borderColor: isSelected ? template.color : colors.border, overflow: 'hidden' }}
            >
              {/* Template color bar */}
              <View style={{ height: 6, backgroundColor: template.color }} />

              <View style={{ padding: 16, flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <Text style={{ fontSize: 17, fontWeight: '700', color: colors.textDark, fontFamily: 'Ubuntu_700Bold' }}>{template.name}</Text>
                    {isSelected && (
                      <View style={{ backgroundColor: template.color, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 }}>
                        <Text style={{ fontSize: 11, color: '#fff', fontFamily: 'Ubuntu_500Medium' }}>Selected</Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ fontSize: 13, color: colors.textLight, fontFamily: 'Ubuntu_300Light', lineHeight: 18 }}>{template.desc}</Text>
                </View>
                {isSelected && (
                  <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: template.color, justifyContent: 'center', alignItems: 'center', marginLeft: 12 }}>
                    <Check size={16} color="#fff" />
                  </View>
                )}
              </View>

              {/* Mock CV preview bars */}
              <View style={{ paddingHorizontal: 16, paddingBottom: 14 }}>
                <View style={{ height: 8, backgroundColor: `${template.color}20`, borderRadius: 4, marginBottom: 6, width: '60%' }} />
                <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 3, marginBottom: 4, width: '90%' }} />
                <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 3, marginBottom: 4, width: '75%' }} />
                <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 3, width: '50%' }} />
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          onPress={() => navigation.navigate('CVBuilder', { templateId: selected })}
          style={{ backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8 }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', fontFamily: 'Ubuntu_700Bold' }}>Continue with {templates.find((t) => t.id === selected)?.name}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
