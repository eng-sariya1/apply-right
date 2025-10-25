import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { CVData } from '../types/cv.types';

interface CVPDFDocumentProps {
  data: CVData;
}

const createStyles = (themeColor: string) => StyleSheet.create({
  page: {
    padding: '48 80',
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    paddingBottom: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: `#${themeColor}`,
    marginBottom: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  headerTitleText: {
    fontWeight: 'bold',
    color: `#${themeColor}`,
  },
  headerSeparator: {
    fontWeight: 'bold',
    color: `#${themeColor}`,
    marginHorizontal: 5,
  },
  headerInfo: {
    flexDirection: 'column',
    gap: 7,
  },
  headerInfoItem: {
    fontSize: 10,
    color: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    fontSize: 10,
    color: '#000',
    marginRight: 5,
  },
  link: {
    color: '#000',
    textDecoration: 'none',
  },
  section: {
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'normal',
    color: `#${themeColor}`,
    marginBottom: 12,
    borderBottom: '2px solid rgba(0, 0, 0, 0.49)',
    paddingBottom: 4,
  },
  text: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#000',
    textAlign: 'left',
  },
  skillsContainer: {
    flexDirection: 'row',
    gap: 80,
    paddingLeft: 30,
  },
  skillColumn: {
    flexDirection: 'column',
    gap: 4,
  },
  skill: {
    fontSize: 10,
    color: '#000',
    marginBottom: 2,
  },
  careerItem: {
    marginBottom: 24,
  },
  careerHeaderRow: {
    flexDirection: 'row',
    gap: 80,
    marginBottom: 8,
  },
  careerLeftColumn: {
    flexDirection: 'column',
    gap: 5,
  },
  careerRightColumn: {
    flexDirection: 'column',
    gap: 5,
  },
  careerLabel: {
    fontWeight: 'bold',
    color: '#000',
  },
  careerText: {
    fontSize: 10,
    color: '#000',
  },
  careerSummarization: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#000',
    opacity: 0.8,
    marginTop: 12,
    marginBottom: 12,
  },
  projectsLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  mainCareerList: {
    marginLeft: 20,
  },
  careerProjectTitle: {
    fontSize: 10,
    color: '#000',
    marginTop: 16,
    marginBottom: 10,
  },
  careerList: {
    marginLeft: 20,
    marginTop: 5,
  },
  careerListItem: {
    fontSize: 10,
    color: '#000',
    marginBottom: 5,
    flexDirection: 'row',
  },
  careerListLabel: {
    fontWeight: 'bold',
    color: '#000',
  },
  careerListText: {
    fontSize: 10,
    color: '#000',
    opacity: 0.8,
  },
  secondCareerList: {
    marginLeft: 20,
    marginTop: 5,
  },
  secondCareerListItem: {
    fontSize: 10,
    color: '#000',
    opacity: 0.8,
    marginBottom: 3,
  },
  separator: {
    borderBottom: '1px solid #000',
    opacity: 0.6,
    marginTop: 20,
    width: '80%',
    alignSelf: 'center',
  },
  personalProjectItem: {
    marginBottom: 16,
  },
  personalProjectTitle: {
    fontSize: 10,
    marginTop: 16,
    marginBottom: 10,
  },
});

export default function CVPDFDocument({ data }: CVPDFDocumentProps) {
  const themeColor = data.sectionTitleColor || '017A8C';
  const styles = createStyles(themeColor);

  // Helper function to chunk skills into columns of 5
  const getSkillColumns = () => {
    const columns = [];
    for (let i = 0; i < data.skills.length; i += 5) {
      columns.push(data.skills.slice(i, i + 5));
    }
    return columns;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <Text style={styles.headerTitleText}>{data.header.fullName}</Text>
            <Text style={styles.headerSeparator}> | </Text>
            <Text style={styles.headerTitleText}>{data.header.specialization}</Text>
          </View>
          <View style={styles.headerInfo}>
            {data.header.email && (
              <View style={styles.headerInfoItem}>
                <Text style={styles.headerIcon}>✉</Text>
                <Link src={`mailto:${data.header.email}`} style={styles.link}>
                  {data.header.email}
                </Link>
              </View>
            )}
            {data.header.phone && (
              <View style={styles.headerInfoItem}>
                <Text style={styles.headerIcon}>☎</Text>
                <Link src={`tel:${data.header.phone}`} style={styles.link}>
                  {data.header.phone}
                </Link>
              </View>
            )}
            {data.header.links.map((link, index) => (
              <View key={index} style={styles.headerInfoItem}>
                <Text style={styles.headerIcon}>🔗</Text>
                <Link src={link.url} style={styles.link}>
                  {link.name}
                </Link>
              </View>
            ))}
          </View>
        </View>

        {/* Abstract */}
        {data.abstract && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Abstract</Text>
            <Text style={styles.text}>{data.abstract}</Text>
          </View>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsContainer}>
              {getSkillColumns().map((column, colIndex) => (
                <View key={colIndex} style={styles.skillColumn}>
                  {column.map((skill, index) => (
                    <Text key={index} style={styles.skill}>
                      • {skill}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Career */}
        {data.career.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Career</Text>
            {data.career.map((career, careerIndex) => (
              <View key={careerIndex} style={styles.careerItem}>
                {/* Two-column header layout */}
                <View style={styles.careerHeaderRow}>
                  {/* Left Column - Period and Location */}
                  <View style={styles.careerLeftColumn}>
                    <Text style={styles.careerText}>
                      <Text style={styles.careerLabel}>Period: </Text>
                      {career.startDate} - {career.isPresent ? 'Present' : career.endDate}
                    </Text>
                    <Text style={styles.careerText}>
                      <Text style={styles.careerLabel}>Location: </Text>
                      {career.location}
                    </Text>
                  </View>

                  {/* Right Column - Company and Position */}
                  <View style={styles.careerRightColumn}>
                    <Text style={styles.careerText}>
                      <Text style={styles.careerLabel}>Company: </Text>
                      {career.companyName}
                    </Text>
                    <Text style={styles.careerText}>
                      <Text style={styles.careerLabel}>Position: </Text>
                      {career.workSpecialization} ({career.jobType})
                    </Text>
                  </View>
                </View>

                {/* Summarization */}
                {career.summarization && (
                  <Text style={styles.careerSummarization}>{career.summarization}</Text>
                )}

                {/* Projects */}
                {career.projects.length > 0 && (
                  <View>
                    <Text style={styles.projectsLabel}>Projects:</Text>
                    <View style={styles.mainCareerList}>
                      {career.projects.map((project, projectIndex) => (
                        <View key={projectIndex}>
                          <Text style={styles.careerProjectTitle}>
                            {projectIndex + 1}. <Text style={styles.careerLabel}>Name: </Text>{project.name}
                          </Text>
                          <View style={styles.careerList}>
                            <Text style={styles.careerListItem}>
                              <Text style={styles.careerListLabel}>• Description: </Text>
                              <Text style={styles.careerListText}>{project.description}</Text>
                            </Text>
                            <Text style={styles.careerListItem}>
                              <Text style={styles.careerListLabel}>• Technologies: </Text>
                              <Text style={styles.careerListText}>{project.technologies}</Text>
                            </Text>
                            {project.keyContributions.length > 0 && (
                              <View>
                                <Text style={styles.careerListItem}>
                                  <Text style={styles.careerListLabel}>• Key Contributions:</Text>
                                </Text>
                                <View style={styles.secondCareerList}>
                                  {project.keyContributions.map((contrib, contribIndex) => (
                                    <Text key={contribIndex} style={styles.secondCareerListItem}>
                                      • {contrib}
                                    </Text>
                                  ))}
                                </View>
                              </View>
                            )}
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Separator between career items */}
                {careerIndex < data.career.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </View>
        )}

        {/* Personal Projects */}
        {data.personalProjects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Projects</Text>
            <View style={styles.mainCareerList}>
              {data.personalProjects.map((project, projectIndex) => (
                <View key={projectIndex} style={styles.personalProjectItem}>
                  <Text style={styles.personalProjectTitle}>
                    {projectIndex + 1}. <Text style={styles.careerLabel}>Title: </Text>{project.title}
                  </Text>
                  <View style={styles.careerList}>
                    <Text style={styles.careerListItem}>
                      <Text style={styles.careerListLabel}>• Description: </Text>
                      <Text style={styles.careerListText}>{project.description}</Text>
                    </Text>
                    <Text style={styles.careerListItem}>
                      <Text style={styles.careerListLabel}>• Technologies: </Text>
                      <Text style={styles.careerListText}>{project.technologies}</Text>
                    </Text>
                    {project.keyFeatures.length > 0 && (
                      <View>
                        <Text style={styles.careerListItem}>
                          <Text style={styles.careerListLabel}>• Key Features:</Text>
                        </Text>
                        <View style={styles.secondCareerList}>
                          {project.keyFeatures.map((feature, featureIndex) => (
                            <Text key={featureIndex} style={styles.secondCareerListItem}>
                              • {feature}
                            </Text>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Education */}
        {data.education && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            <Text style={styles.text}>{data.education}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
