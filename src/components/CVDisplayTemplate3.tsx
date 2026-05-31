import type { CVData } from '../types/cv.types';
import '../styles/cv.css';
import { Skeleton } from 'primereact/skeleton';

interface CVDisplayProps {
  data: CVData;
}

export default function CVDisplayTemplate3({ data }: CVDisplayProps) {
  const themeColor = data.sectionTitleColor ? `#${data.sectionTitleColor}` : '#111111';

  const contactParts = [
    data.header.address,
    data.header.email,
    data.header.phone,
    ...data.header.links.map(l => l.url || l.name),
  ].filter(Boolean);

  // Group skills into rows of 3 per bullet
  const skillGroups: string[] = [];
  for (let i = 0; i < data.skills.length; i += 3) {
    skillGroups.push(data.skills.slice(i, i + 3).join(', '));
  }

  const hasStructuredEdu = data.educationEntries && data.educationEntries.length > 0;
  const hasLegacyEdu = data.education && data.education.trim();

  return (
    <div className="cv-container cv-t3 printable-cv">
      {/* HEADER */}
      <div className="cv-t3-header">
        <h1 className="cv-t3-name">
          {data.header.fullName || <Skeleton width="14rem" height="2.2rem" />}
        </h1>
        {data.header.specialization && (
          <div className="cv-t3-specialization">{data.header.specialization}</div>
        )}
        <p className="cv-t3-contact">
          {contactParts.length > 0
            ? contactParts.join(' | ')
            : <Skeleton width="20rem" height="0.9rem" />}
        </p>
      </div>

      {/* PROFESSIONAL SUMMARY */}
      {data.abstract && (
        <div className="cv-t3-section">
          <h3 className="cv-t3-section-title" style={{ color: themeColor }}>Professional Summary</h3>
          <hr className="cv-t3-divider" style={{ borderColor: themeColor }} />
          <p className="cv-t3-summary-text">{data.abstract}</p>
        </div>
      )}

      {/* WORK EXPERIENCE */}
      {data.career.length > 0 && (
        <div className="cv-t3-section">
          <h3 className="cv-t3-section-title" style={{ color: themeColor }}>Work Experience</h3>
          <hr className="cv-t3-divider" style={{ borderColor: themeColor }} />
          {data.career.map((job, i) => {
            const dateRange = job.startDate
              ? `${job.startDate} \u2013 ${job.isPresent ? 'Present' : (job.endDate || '')}`
              : '';
            const companyLocation = [job.companyName, job.location].filter(Boolean).join(', ');
            const bulletLines = job.summarization
              ? job.summarization.split('\n').filter(line => line.trim())
              : [];

            return (
              <div key={i} className="cv-t3-job cv-section">
                <span className="cv-t3-job-title">
                  {job.workSpecialization || <Skeleton width="10rem" height="0.9rem" />}
                </span>
                <div className="cv-t3-job-meta">
                  <span className="cv-t3-job-company">{companyLocation}</span>
                  {dateRange && <span className="cv-t3-job-dates">{dateRange}</span>}
                </div>
                {bulletLines.length > 0 && (
                  <ul className="cv-t3-bullets">
                    {bulletLines.map((line, j) => (
                      <li key={j}>{line.replace(/^[-•·]\s*/, '')}</li>
                    ))}
                  </ul>
                )}
                {job.projects.length > 0 && (
                  <ul className="cv-t3-bullets" style={{ marginTop: '0.3rem' }}>
                    {job.projects.map((proj, j) => (
                      <li key={j}>
                        <strong>{proj.name}</strong>
                        {proj.description ? ` — ${proj.description}` : ''}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* EDUCATION */}
      {(hasStructuredEdu || hasLegacyEdu) && (
        <div className="cv-t3-section">
          <h3 className="cv-t3-section-title" style={{ color: themeColor }}>Education</h3>
          <hr className="cv-t3-divider" style={{ borderColor: themeColor }} />
          {hasStructuredEdu
            ? data.educationEntries!.map((edu, i) => (
                <div key={i} className="cv-t3-edu-entry cv-section">
                  <span className="cv-t3-edu-degree">{edu.degree}</span>
                  <div className="cv-t3-edu-meta">
                    <span className="cv-t3-edu-institution">
                      {[edu.institution, edu.location].filter(Boolean).join(', ')}
                    </span>
                    {edu.graduationYear && (
                      <span className="cv-t3-edu-grad">Graduated: {edu.graduationYear}</span>
                    )}
                  </div>
                </div>
              ))
            : <p className="cv-t3-summary-text">{data.education}</p>
          }
        </div>
      )}

      {/* SKILLS */}
      {data.skills.length > 0 && (
        <div className="cv-t3-section">
          <h3 className="cv-t3-section-title" style={{ color: themeColor }}>Skills</h3>
          <hr className="cv-t3-divider" style={{ borderColor: themeColor }} />
          <ul className="cv-t3-bullets">
            {skillGroups.map((group, i) => (
              <li key={i}>{group}</li>
            ))}
          </ul>
        </div>
      )}

      {/* CERTIFICATIONS */}
      {data.certifications && data.certifications.trim() && (
        <div className="cv-t3-section">
          <h3 className="cv-t3-section-title" style={{ color: themeColor }}>Certifications</h3>
          <hr className="cv-t3-divider" style={{ borderColor: themeColor }} />
          <ul className="cv-t3-bullets">
            {data.certifications
              .split('\n')
              .filter(line => line.trim())
              .map((line, i) => (
                <li key={i}>{line}</li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
