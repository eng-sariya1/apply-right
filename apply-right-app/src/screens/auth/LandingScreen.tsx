import { StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../navigation/AuthStack';
import { CheckCircle2, FileText, BarChart2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Box, Button, ButtonText, Center, HStack, Heading, ScrollView, Text, VStack } from '../../components/ui';
import { GradientHeader } from '../../components/ui/GradientHeader';

type Nav = StackNavigationProp<AuthStackParamList, 'Landing'>;

const features = [
  { icon: FileText, title: 'Smart CV Builder', desc: 'Build professional CVs with 3 beautiful templates' },
  { icon: BarChart2, title: 'ATS Optimizer', desc: 'AI-powered analysis to beat applicant tracking systems' },
  { icon: CheckCircle2, title: 'Job Matching', desc: 'Get job suggestions tailored to your profile' },
];

export default function LandingScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <ScrollView
      className="flex-1 bg-background-light dark:bg-background-dark"
      contentContainerClassName="grow"
    >
      <StatusBar barStyle="light-content" backgroundColor="#015C6A" />

      <GradientHeader style={{ alignItems: 'center', paddingHorizontal: 24, paddingTop: 80, paddingBottom: 56 }}>
        <LinearGradient
          colors={['#015C6A', '#019baf']}
          style={{ width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}
        >
          <FileText size={40} color="#fff" />
        </LinearGradient>
        <Heading size="2xl" className="mb-3 text-center text-white">
          Nuivo
        </Heading>
        <Text className="text-center text-base leading-6 text-[#a5d8e0]">
          Build a standout CV and land your dream job with AI-powered tools
        </Text>
      </GradientHeader>

      <VStack space={20} className="px-6 py-8">
        {features.map(({ icon: Icon, title, desc }) => (
          <HStack key={title} className="items-start">
            <Center className="mr-4 h-11 w-11 rounded-xl border border-border-light bg-card-light dark:border-border-dark dark:bg-card-dark">
              <Icon size={22} color="#017A8C" />
            </Center>
            <VStack className="flex-1">
              <Text className="mb-1 font-[Inter_600SemiBold] text-base text-text-dark-light dark:text-text-dark-dark tracking-tight">
                {title}
              </Text>
              <Text className="text-sm leading-5 text-text-light-light dark:text-text-light-dark">{desc}</Text>
            </VStack>
          </HStack>
        ))}
      </VStack>

      <VStack space={12} className="px-6 pb-10">
        <Button onPress={() => navigation.navigate('Signup')}>
          <ButtonText>Get Started — It's Free</ButtonText>
        </Button>
        <Button variant="outline" onPress={() => navigation.navigate('Login')}>
          <ButtonText variant="outline">Sign In</ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  );
}
