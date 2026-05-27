import { View, Text, TouchableOpacity, Image, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../navigation/AuthStack';
import { useTheme } from '../../context/ThemeContext';
import { CheckCircle2, FileText, BarChart2 } from 'lucide-react-native';

type Nav = StackNavigationProp<AuthStackParamList, 'Landing'>;

const features = [
  { icon: FileText, title: 'Smart CV Builder', desc: 'Build professional CVs with 3 beautiful templates' },
  { icon: BarChart2, title: 'ATS Optimizer', desc: 'AI-powered analysis to beat applicant tracking systems' },
  { icon: CheckCircle2, title: 'Job Matching', desc: 'Get job suggestions tailored to your profile' },
];

export default function LandingScreen() {
  const navigation = useNavigation<Nav>();
  const { colors } = useTheme();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Hero */}
      <View style={{ backgroundColor: colors.primaryDark, paddingTop: 80, paddingBottom: 60, paddingHorizontal: 24, alignItems: 'center' }}>
        <View style={{ width: 72, height: 72, borderRadius: 18, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
          <FileText size={36} color="#fff" />
        </View>
        <Text style={{ fontSize: 32, fontWeight: '700', color: '#fff', fontFamily: 'Ubuntu_700Bold', textAlign: 'center', marginBottom: 12 }}>
          Apply Right
        </Text>
        <Text style={{ fontSize: 16, color: '#a5d8e0', textAlign: 'center', fontFamily: 'Ubuntu_300Light', lineHeight: 24 }}>
          Build a standout CV and land your dream job with AI-powered tools
        </Text>
      </View>

      {/* Features */}
      <View style={{ padding: 24 }}>
        {features.map(({ icon: Icon, title, desc }) => (
          <View key={title} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24 }}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: `${colors.primary}20`, justifyContent: 'center', alignItems: 'center', marginRight: 16 }}>
              <Icon size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textDark, fontFamily: 'Ubuntu_500Medium', marginBottom: 4 }}>{title}</Text>
              <Text style={{ fontSize: 14, color: colors.textLight, fontFamily: 'Ubuntu_300Light', lineHeight: 20 }}>{desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* CTA Buttons */}
      <View style={{ padding: 24, paddingTop: 8, gap: 12 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Signup')}
          style={{ backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center' }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', fontFamily: 'Ubuntu_700Bold' }}>Get Started — It's Free</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={{ borderWidth: 2, borderColor: colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}
        >
          <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '700', fontFamily: 'Ubuntu_700Bold' }}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}
