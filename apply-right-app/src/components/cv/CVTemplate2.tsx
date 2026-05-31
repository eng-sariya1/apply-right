import { View, Text, Image } from 'react-native';
import type { CVData } from '../../types/cv.types';

interface Props { data: CVData }

export default function CVTemplate2({ data }: Props) {
  const accent = `#${data.sectionTitleColor || '0f4c81'}`;

  const SectionTitle = ({ children }: { children: string }) => (
    <View style={{ marginTop: 18, marginBottom: 8, backgroundColor: `${accent}10`, paddingVertical: 5, paddingHorizontal: 10, borderLeftWidth: 3, borderLeftColor: accent }}>
      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: accent, letterSpacing: 1.4, textTransform: 'uppercase' }}>{children}</Text>
    </View>
  );

  return (
    <View style={{ backgroundColor: '#fff' }}>
      <View style={{ backgroundColor: accent, padding: 22, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 26, color: '#fff', letterSpacing: -0.5 }}>{data.header.fullName || 'Full Name'}</Text>
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: '#fff', opacity: 0.95, marginTop: 2 }}>{data.header.specialization}</Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#fff', opacity: 0.85, marginTop: 6 }}>
            {[data.header.email, data.header.phone, data.header.address].filter(Boolean).join('  •  ')}
          </Text>
        </View>
        {data.header.photoUrl ? (
          <Image
            source={{ uri: data.header.photoUrl }}
            style={{ width: 72, height: 72, borderRadius: 36, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' }}
          />
        ) : null}
      </View>

      <View style={{ padding: 22 }}>
        {data.abstract ? (
          <>
            <SectionTitle>Profile</SectionTitle>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#222', lineHeight: 18 }}>{data.abstract}</Text>
          </>
        ) : null}

        {data.skills.length ? (
          <>
            <SectionTitle>Core Skills</SectionTitle>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {data.skills.map((s, i) => (
                <View key={i} style={{ backgroundColor: `${accent}1F`, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 4 }}>
                  <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: accent }}>{s}</Text>
                </View>
              ))}
            </View>
          </>
        ) : null}

        {data.career.length ? (
          <>
            <SectionTitle>Professional Experience</SectionTitle>
            {data.career.map((j, i) => (
              <View key={i} style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                  <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#0a0a0a', flex: 1 }}>{j.workSpecialization} ({j.jobType})</Text>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#666' }}>{j.startDate} – {j.isPresent ? 'Present' : j.endDate}</Text>
                </View>
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: accent, marginTop: 1 }}>
                  {j.companyName}{j.location ? ` · ${j.location}` : ''}
                </Text>

                {j.summarization ? (
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#333', lineHeight: 17, marginTop: 6, opacity: 0.8 }}>{j.summarization}</Text>
                ) : null}

                {j.projects.length ? (
                  <View style={{ marginTop: 8 }}>
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#0a0a0a', marginBottom: 4 }}>Projects:</Text>
                    {j.projects.map((p, pi) => (
                      <View key={pi} style={{ marginBottom: 8, paddingLeft: 8 }}>
                        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: '#0a0a0a' }}>• {p.name}</Text>
                        <View style={{ paddingLeft: 12 }}>
                          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#333', lineHeight: 16 }}>
                            <Text style={{ fontFamily: 'Inter_600SemiBold' }}>Description: </Text>{p.description}
                          </Text>
                          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#333', lineHeight: 16 }}>
                            <Text style={{ fontFamily: 'Inter_600SemiBold' }}>Technologies: </Text>{p.technologies}
                          </Text>
                          {p.keyContributions.length ? (
                            <View style={{ marginTop: 2 }}>
                              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: '#333' }}>Key Contributions:</Text>
                              {p.keyContributions.map((c, ci) => (
                                <Text key={ci} style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#333', lineHeight: 16, paddingLeft: 8 }}>• {c}</Text>
                              ))}
                            </View>
                          ) : null}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            ))}
          </>
        ) : null}

        {data.personalProjects.length ? (
          <>
            <SectionTitle>Personal Projects</SectionTitle>
            {data.personalProjects.map((p, i) => (
              <View key={i} style={{ marginBottom: 12, paddingLeft: 8 }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#0a0a0a' }}>• {p.title}</Text>
                <View style={{ paddingLeft: 12 }}>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#333', lineHeight: 16 }}>
                    <Text style={{ fontFamily: 'Inter_600SemiBold' }}>Description: </Text>{p.description}
                  </Text>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#333', lineHeight: 16 }}>
                    <Text style={{ fontFamily: 'Inter_600SemiBold' }}>Technologies: </Text>{p.technologies}
                  </Text>
                  {p.keyFeatures.length ? (
                    <View style={{ marginTop: 2 }}>
                      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: '#333' }}>Key Features:</Text>
                      {p.keyFeatures.map((f, fi) => (
                        <Text key={fi} style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#333', lineHeight: 16, paddingLeft: 8 }}>• {f}</Text>
                      ))}
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
          </>
        ) : null}

        {data.education ? (
          <>
            <SectionTitle>Education</SectionTitle>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#333' }}>{data.education}</Text>
          </>
        ) : null}
      </View>
    </View>
  );
}
