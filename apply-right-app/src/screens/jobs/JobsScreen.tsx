import { View, Text, ScrollView, TouchableOpacity, Linking, StatusBar } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useCVContext } from '../../context/CVContext';
import { getCompletionProgress } from '../../utils/cvCompletion';
import { Briefcase, ExternalLink, Lock } from 'lucide-react-native';

const LINKEDIN_BASE = 'https://www.linkedin.com/jobs/search/?keywords=';

export default function JobsScreen() {
  const { colors } = useTheme();
  const { cvData, atsResult } = useCVContext();

  const completion = getCompletionProgress(cvData);
  const hasATS = atsResult !== null;
  const isUnlocked = completion >= 85 && hasATS;

  const skills = cvData.skills.slice(0, 5);
  const specialization = cvData.header.specialization;

  const searchTerms = specialization ? [specialization, ...skills] : skills;

  const handleSearch = (term: string) => {
    const url = `${LINKEDIN_BASE}${encodeURIComponent(term)}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Header */}
      <View style={{ backgroundColor: colors.primaryDark, paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Briefcase size={24} color="#fff" />
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#fff', fontFamily: 'Ubuntu_700Bold' }}>Job Suggestions</Text>
        </View>
        <Text style={{ color: '#a5d8e0', marginTop: 6, fontFamily: 'Ubuntu_300Light', fontSize: 13 }}>
          LinkedIn job matches based on your CV profile
        </Text>
      </View>

      <View style={{ padding: 16 }}>
        {!isUnlocked ? (
          <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: colors.border }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: `${colors.primary}15`, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <Lock size={28} color={colors.primary} />
            </View>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textDark, fontFamily: 'Ubuntu_500Medium', marginBottom: 8, textAlign: 'center' }}>
              Unlock Job Suggestions
            </Text>
            <Text style={{ fontSize: 14, color: colors.textLight, textAlign: 'center', fontFamily: 'Ubuntu_300Light', lineHeight: 20, marginBottom: 20 }}>
              Complete the requirements below to access personalized job suggestions:
            </Text>

            {/* Requirements */}
            {[
              { label: `CV Completion: ${completion}%`, done: completion >= 85, req: '85% required' },
              { label: 'ATS Analysis', done: hasATS, req: 'Complete ATS analysis first' },
            ].map(({ label, done, req }) => (
              <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10, width: '100%' }}>
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: done ? '#dcfce7' : '#fef2f2', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12 }}>{done ? '✓' : '✗'}</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 14, color: done ? '#16a34a' : colors.textDark, fontFamily: 'Ubuntu_500Medium' }}>{label}</Text>
                  {!done && <Text style={{ fontSize: 11, color: colors.textLight, fontFamily: 'Ubuntu_300Light' }}>{req}</Text>}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View>
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textDark, fontFamily: 'Ubuntu_500Medium', marginBottom: 4 }}>
              Suggested Searches
            </Text>
            <Text style={{ fontSize: 13, color: colors.textLight, fontFamily: 'Ubuntu_300Light', marginBottom: 16 }}>
              Based on your CV — tap to search on LinkedIn
            </Text>

            {searchTerms.map((term, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => handleSearch(term)}
                style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                  <View style={{ width: 36, height: 36, borderRadius: 9, backgroundColor: `${colors.primary}15`, justifyContent: 'center', alignItems: 'center' }}>
                    <Briefcase size={18} color={colors.primary} />
                  </View>
                  <Text style={{ fontSize: 14, color: colors.textDark, fontFamily: 'Ubuntu_500Medium', flex: 1 }} numberOfLines={1}>{term}</Text>
                </View>
                <ExternalLink size={16} color={colors.textLight} />
              </TouchableOpacity>
            ))}

            <View style={{ backgroundColor: `${colors.primary}10`, borderRadius: 10, padding: 14, marginTop: 8 }}>
              <Text style={{ fontSize: 13, color: colors.primary, fontFamily: 'Ubuntu_500Medium', marginBottom: 4 }}>Pro tip</Text>
              <Text style={{ fontSize: 12, color: colors.textLight, fontFamily: 'Ubuntu_300Light', lineHeight: 18 }}>
                Your ATS score was {atsResult?.matchPercentage}%. Jobs matching your profile are shown based on your skills and specialization.
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
