import { View, Text } from 'react-native';
import type { CVData } from '../../types/cv.types';

interface Props { data: CVData }

export default function CVTemplate3({ data }: Props) {
  const SectionTitle = ({ children }: { children: string }) => (
    <View style={{ marginTop: 22, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: '#111', paddingBottom: 4 }}>
      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: '#111', letterSpacing: 2, textTransform: 'uppercase' }}>{children}</Text>
    </View>
  );

  return (
    <View style={{ padding: 26, backgroundColor: '#fff' }}>
      <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 34, color: '#0a0a0a', letterSpacing: -1 }}>{data.header.fullName || 'Full Name'}</Text>
      <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: '#444', marginTop: 2 }}>{data.header.specialization}</Text>
      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#777', marginTop: 6 }}>
        {[data.header.email, data.header.phone, data.header.address].filter(Boolean).join('   ·   ')}
      </Text>

      {data.abstract ? (
        <>
          <SectionTitle>About</SectionTitle>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#222', lineHeight: 19 }}>{data.abstract}</Text>
        </>
      ) : null}

      {data.skills.length ? (
        <>
          <SectionTitle>Stack</SectionTitle>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#222', lineHeight: 19 }}>
            {data.skills.join('  /  ')}
          </Text>
        </>
      ) : null}

      {data.career.length ? (
        <>
          <SectionTitle>Work</SectionTitle>
          {data.career.map((j, i) => (
            <View key={i} style={{ marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#0a0a0a', flex: 1 }}>
                  {j.workSpecialization} ({j.jobType})
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#777' }}>
                  {j.startDate} – {j.isPresent ? 'Present' : j.endDate}
                </Text>
              </View>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#555', marginTop: 1 }}>
                {j.companyName}{j.location ? `, ${j.location}` : ''}
              </Text>

              {j.summarization ? (
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#333', lineHeight: 17, marginTop: 4 }}>{j.summarization}</Text>
              ) : null}

              {j.projects.length ? (
                <View style={{ marginTop: 8 }}>
                  <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: '#222', marginBottom: 4 }}>Projects:</Text>
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
          <SectionTitle>Projects</SectionTitle>
          {data.personalProjects.map((p, i) => (
            <View key={i} style={{ marginBottom: 12, paddingLeft: 8 }}>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#0a0a0a' }}>• {p.title}</Text>
              <View style={{ paddingLeft: 12 }}>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#333', lineHeight: 16 }}>
                  <Text style={{ fontFamily: 'Inter_600SemiBold' }}>Description: </Text>{p.description}
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#777', lineHeight: 16 }}>
                  <Text style={{ fontFamily: 'Inter_600SemiBold', color: '#333' }}>Technologies: </Text>{p.technologies}
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

      {(data.educationEntries?.length ?? 0) > 0 ? (
        <>
          <SectionTitle>Education</SectionTitle>
          {data.educationEntries!.map((e, i) => (
            <View key={i} style={{ marginBottom: 10 }}>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#0a0a0a' }}>{e.degree}</Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#444' }}>
                {e.institution}{e.location ? `, ${e.location}` : ''}
              </Text>
              {e.graduationYear ? (
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#777' }}>{e.graduationYear}</Text>
              ) : null}
            </View>
          ))}
        </>
      ) : data.education ? (
        <>
          <SectionTitle>Education</SectionTitle>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#333' }}>{data.education}</Text>
        </>
      ) : null}

      {data.certifications ? (
        <>
          <SectionTitle>Certifications</SectionTitle>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#333' }}>{data.certifications}</Text>
        </>
      ) : null}
    </View>
  );
}
