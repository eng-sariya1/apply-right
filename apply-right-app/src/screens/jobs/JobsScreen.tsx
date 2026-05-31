import { Linking, StatusBar, View } from 'react-native';
import { useCVContext } from '../../context/CVContext';
import { getCompletionProgress } from '../../utils/cvCompletion';
import { buildLinkedInJobsUrl } from '../../utils/linkedinJobs';
import { Briefcase, ExternalLink, Lock, Search } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Box,
  Card,
  Center,
  HStack,
  Heading,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from '../../components/ui';
import { GradientHeader } from '../../components/ui/GradientHeader';
import { Badge } from '../../components/ui/Badge';

const LINKEDIN_BASE = 'https://www.linkedin.com/jobs/search/?keywords=';

export default function JobsScreen() {
  const { cvData, atsResult } = useCVContext();

  const completion = getCompletionProgress(cvData);
  const hasATS = atsResult !== null;
  const isUnlocked = completion >= 85 && hasATS;

  const skills = cvData.skills.slice(0, 5);
  const specialization = cvData.header.specialization;
  const searchTerms = specialization ? [specialization, ...skills] : skills;
  const combinedUrl = buildLinkedInJobsUrl(cvData);

  const handleSearch = (term: string) => Linking.openURL(`${LINKEDIN_BASE}${encodeURIComponent(term)}`);
  const handleCombinedSearch = () => combinedUrl && Linking.openURL(combinedUrl);

  return (
    <ScrollView className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar barStyle="light-content" backgroundColor="#015C6A" />

      <GradientHeader style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 24 }}>
        <HStack space={10} className="items-center">
          <Briefcase size={24} color="#fff" />
          <Heading size="lg" className="text-white">
            Job Suggestions
          </Heading>
        </HStack>
        <Text className="mt-1.5 text-[13px] text-[#a5d8e0]">
          LinkedIn job matches based on your CV profile
        </Text>
      </GradientHeader>

      <Box className="p-4">
        {!isUnlocked ? (
          <Card className="items-center p-6">
            <LinearGradient
              colors={['#E6F4F7', '#C8E8F0']}
              style={{ width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}
            >
              <Lock size={28} color="#017A8C" />
            </LinearGradient>
            <Heading size="md" className="mb-2 text-center tracking-tight">
              Unlock Job Suggestions
            </Heading>
            <Text className="mb-5 text-center text-sm leading-5 text-text-light-light dark:text-text-light-dark">
              Complete the requirements below to access personalized job suggestions:
            </Text>

            {[
              { label: `CV Completion: ${completion}%`, done: completion >= 85, req: '85% required' },
              { label: 'ATS Analysis', done: hasATS, req: 'Complete ATS analysis first' },
            ].map(({ label, done, req }) => (
              <HStack key={label} space={10} className="mb-3 w-full items-center">
                <View style={{ marginTop: 2 }}>
                  <Badge variant={done ? 'success' : 'danger'} label={done ? '✓' : '✗'} size="sm" />
                </View>
                <VStack>
                  <Text
                    className={`font-[Inter_500Medium] text-sm ${done ? 'text-success-light dark:text-success-dark' : 'text-text-dark-light dark:text-text-dark-dark'}`}
                  >
                    {label}
                  </Text>
                  {!done && (
                    <Text className="text-[11px] text-text-light-light dark:text-text-light-dark">{req}</Text>
                  )}
                </VStack>
              </HStack>
            ))}
          </Card>
        ) : (
          <VStack>
            <Text className="mb-1 font-[Inter_600SemiBold] text-[15px] tracking-tight text-text-dark-light dark:text-text-dark-dark">
              Suggested Searches
            </Text>
            <Text className="mb-4 text-[13px] text-text-light-light dark:text-text-light-dark">
              Based on your CV — tap to search on LinkedIn
            </Text>

            {combinedUrl && (
              <Pressable onPress={handleCombinedSearch} className="mb-3 overflow-hidden rounded-2xl">
                <LinearGradient
                  colors={['#015C6A', '#019baf']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 }}
                >
                  <Search size={18} color="#fff" />
                  <Text className="font-[Inter_700Bold] text-sm text-white">
                    Smart search (matches your profile)
                  </Text>
                </LinearGradient>
              </Pressable>
            )}

            {searchTerms.map((term, i) => (
              <Pressable
                key={i}
                onPress={() => handleSearch(term)}
                className="mb-2.5 flex-row items-center justify-between rounded-xl border border-border-light bg-card-light p-4 dark:border-border-dark dark:bg-card-dark"
                style={{ borderLeftWidth: 3, borderLeftColor: '#019baf' }}
              >
                <HStack space={12} className="flex-1 items-center">
                  <Center className="h-9 w-9 rounded-lg bg-primary/10">
                    <Briefcase size={18} color="#017A8C" />
                  </Center>
                  <Text
                    numberOfLines={1}
                    className="flex-1 font-[Inter_500Medium] text-sm text-text-dark-light dark:text-text-dark-dark"
                  >
                    {term}
                  </Text>
                </HStack>
                <ExternalLink size={16} color="#6B9EA8" />
              </Pressable>
            ))}

            <Box className="mt-2 rounded-xl bg-primary/10 p-3.5" style={{ borderLeftWidth: 3, borderLeftColor: '#017A8C' }}>
              <Text className="mb-1 font-[Inter_600SemiBold] text-[13px] text-primary">Pro tip</Text>
              <Text className="text-xs leading-[18px] text-text-light-light dark:text-text-light-dark">
                Your ATS score was {atsResult?.matchPercentage}%. Jobs matching your profile are shown based on your skills and specialization.
              </Text>
            </Box>
          </VStack>
        )}
      </Box>
    </ScrollView>
  );
}
