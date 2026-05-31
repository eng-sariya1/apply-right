import { View, Text } from 'react-native';
import type { CVData } from '../../types/cv.types';

interface Props { data: CVData }

export default function CVTemplate1({ data }: Props) {
  const accent = `#${data.sectionTitleColor || '017A8C'}`;

  const SectionTitle = ({ children }: { children: string }) => (
    <View style={{ marginTop: 18, marginBottom: 8, borderBottomWidth: 2, borderBottomColor: accent, paddingBottom: 4 }}>
      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, letterSpacing: 1.5, color: accent, textTransform: 'uppercase' }}>{children}</Text>
    </View>
  );

  return (
    <View style={{ padding: 24, backgroundColor: '#fff' }}>
      <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 26, color: '#0a0a0a', letterSpacing: -0.5 }}>{data.header.fullName || 'Full Name'}</Text>
      <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: accent, marginTop: 2 }}>{data.header.specialization}</Text>
      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#666', marginTop: 4 }}>
        {[data.header.email, data.header.phone, data.header.address].filter(Boolean).join('  •  ')}
      </Text>

      {data.abstract ? (
        <>
          <SectionTitle>Abstract</SectionTitle>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#222', lineHeight: 18 }}>{data.abstract}</Text>
        </>
      ) : null}

      {data.skills.length ? (
        <>
          <SectionTitle>Skills</SectionTitle>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {data.skills.map((s, i) => (
              <View key={i} style={{ backgroundColor: `${accent}22`, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 4 }}>
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: accent }}>{s}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}

      {data.career.length ? (
        <>
          <SectionTitle>Career</SectionTitle>
          {data.career.map((j, i) => (
            <View key={i} style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', gap: 24 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#333' }}>
                    <Text style={{ fontFamily: 'Inter_600SemiBold' }}>Period: </Text>
                    {j.startDate} – {j.isPresent ? 'Present' : j.endDate}
                  </Text>
                  {j.location ? (
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#333', marginTop: 2 }}>
                      <Text style={{ fontFamily: 'Inter_600SemiBold' }}>Location: </Text>
                      {j.location}
                    </Text>
                  ) : null}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#333' }}>
                    <Text style={{ fontFamily: 'Inter_600SemiBold' }}>Company: </Text>
                    {j.companyName}
                  </Text>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#333', marginTop: 2 }}>
                    <Text style={{ fontFamily: 'Inter_600SemiBold' }}>Position: </Text>
                    {j.workSpecialization} ({j.jobType})
                  </Text>
                </View>
              </View>

              {j.summarization ? (
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#333', lineHeight: 17, marginTop: 8, opacity: 0.8 }}>{j.summarization}</Text>
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

              {i < data.career.length - 1 ? (
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#0003', marginTop: 12, marginHorizontal: 24 }} />
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

      {data.additionalInfo ? (
        <>
          <SectionTitle>Additional Info</SectionTitle>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#333' }}>{data.additionalInfo}</Text>
        </>
      ) : null}
    </View>
  );
}
