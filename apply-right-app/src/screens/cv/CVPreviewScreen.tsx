import { ScrollView, View, Text, StatusBar } from 'react-native';
import { useCVContext } from '../../context/CVContext';
import { useTheme } from '../../context/ThemeContext';

export default function CVPreviewScreen() {
  const { cvData } = useCVContext();
  const { colors } = useTheme();
  const accentColor = `#${cvData.sectionTitleColor || '017A8C'}`;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={{ backgroundColor: accentColor, padding: 24 }}>
        <Text style={{ fontSize: 26, fontWeight: '700', color: '#fff', fontFamily: 'Ubuntu_700Bold' }}>
          {cvData.header.fullName || 'Full Name'}
        </Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', fontFamily: 'Ubuntu_300Light', marginTop: 4 }}>
          {cvData.header.specialization}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
          {cvData.header.email ? <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontFamily: 'Ubuntu_300Light' }}>{cvData.header.email}</Text> : null}
          {cvData.header.phone ? <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontFamily: 'Ubuntu_300Light' }}>{cvData.header.phone}</Text> : null}
        </View>
      </View>

      <View style={{ padding: 20 }}>
        {/* Summary */}
        {cvData.abstract ? (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: accentColor, fontFamily: 'Ubuntu_700Bold', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Summary</Text>
            <View style={{ height: 2, backgroundColor: accentColor, marginBottom: 8, width: 40 }} />
            <Text style={{ fontSize: 13, color: '#333', lineHeight: 20, fontFamily: 'Ubuntu_300Light' }}>{cvData.abstract}</Text>
          </View>
        ) : null}

        {/* Skills */}
        {cvData.skills.length > 0 ? (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: accentColor, fontFamily: 'Ubuntu_700Bold', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Skills</Text>
            <View style={{ height: 2, backgroundColor: accentColor, marginBottom: 8, width: 40 }} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {cvData.skills.map((skill, i) => (
                <View key={i} style={{ backgroundColor: `${accentColor}15`, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text style={{ fontSize: 12, color: accentColor, fontFamily: 'Ubuntu_500Medium' }}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Career */}
        {cvData.career.length > 0 ? (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: accentColor, fontFamily: 'Ubuntu_700Bold', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Experience</Text>
            <View style={{ height: 2, backgroundColor: accentColor, marginBottom: 8, width: 40 }} />
            {cvData.career.map((job, i) => (
              <View key={i} style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1a1a1a', fontFamily: 'Ubuntu_500Medium' }}>{job.workSpecialization}</Text>
                <Text style={{ fontSize: 13, color: accentColor, fontFamily: 'Ubuntu_500Medium' }}>{job.companyName}</Text>
                <Text style={{ fontSize: 12, color: '#666', fontFamily: 'Ubuntu_300Light', marginTop: 2 }}>
                  {job.startDate} – {job.isPresent ? 'Present' : job.endDate} {job.location ? `| ${job.location}` : ''}
                </Text>
                {job.summarization ? <Text style={{ fontSize: 12, color: '#444', lineHeight: 18, fontFamily: 'Ubuntu_300Light', marginTop: 6 }}>{job.summarization}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* Projects */}
        {cvData.personalProjects.length > 0 ? (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: accentColor, fontFamily: 'Ubuntu_700Bold', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Projects</Text>
            <View style={{ height: 2, backgroundColor: accentColor, marginBottom: 8, width: 40 }} />
            {cvData.personalProjects.map((proj, i) => (
              <View key={i} style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1a1a1a', fontFamily: 'Ubuntu_500Medium' }}>{proj.title}</Text>
                <Text style={{ fontSize: 12, color: accentColor, fontFamily: 'Ubuntu_300Light' }}>{proj.technologies}</Text>
                <Text style={{ fontSize: 12, color: '#444', lineHeight: 18, fontFamily: 'Ubuntu_300Light', marginTop: 4 }}>{proj.description}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Education */}
        {cvData.education ? (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: accentColor, fontFamily: 'Ubuntu_700Bold', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Education</Text>
            <View style={{ height: 2, backgroundColor: accentColor, marginBottom: 8, width: 40 }} />
            <Text style={{ fontSize: 13, color: '#444', lineHeight: 18, fontFamily: 'Ubuntu_300Light' }}>{cvData.education}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
