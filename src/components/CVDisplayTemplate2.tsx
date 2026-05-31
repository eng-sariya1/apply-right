import type { CVData } from '../types/cv.types';
import '../styles/cv.css';
import { Skeleton } from 'primereact/skeleton';

interface CVDisplayProps {
  data: CVData;
}

export default function CVDisplayTemplate2({ data }: CVDisplayProps) {
  const themeColor = data.sectionTitleColor ? `#${data.sectionTitleColor}` : '#017A8C';

  const contactParts = [
    data.header.address,
    data.header.phone,
    data.header.email,
    ...data.header.links.map(l => l.url || l.name),
  ].filter(Boolean);

  return (
    <div className="cv-container cv-t2 printable-cv">
      {/* HEADER */}
      <div className="cv-t2-header">
        <div className="cv-t2-header-text">
          <h1 className="cv-t2-name" style={{ color: themeColor }}>
            {data.header.fullName || <Skeleton width="14rem" height="2rem" />}
          </h1>
          <div className="cv-t2-specialization">
            {data.header.specialization || <Skeleton width="10rem" height="1.1rem" />}
          </div>
          <p className="cv-t2-contact">
            {contactParts.length > 0
              ? contactParts.join(' | ')
              : <Skeleton width="18rem" height="0.9rem" />}
          </p>
        </div>
        {data.header.photoUrl && (
          <div className="cv-t2-photo">
            <img src={data.header.photoUrl} alt="Profile" />
          </div>
        )}
      </div>

      {/* SUMMARY */}
      {data.abstract && (
        <div className="cv-t2-section">
          <hr className="cv-t2-divider" style={{ borderColor: themeColor }} />
          <h3 className="cv-t2-section-title" style={{ color: themeColor }}>SUMMARY</h3>
          <hr className="cv-t2-divider" style={{ borderColor: themeColor }} />
          <p className="cv-t2-summary-text">{data.abstract}</p>
        </div>
      )}

      {/* PROFESSIONAL EXPERIENCE */}
      {data.career.length > 0 && (
        <div className="cv-t2-section">
          <hr className="cv-t2-divider" style={{ borderColor: themeColor }} />
          <h3 className="cv-t2-section-title" style={{ color: themeColor }}>PROFESSIONAL EXPERIENCE</h3>
          <hr className="cv-t2-divider" style={{ borderColor: themeColor }} />
          {data.career.map((job, i) => {
            const dateRange = job.startDate
              ? `${job.startDate} \u2014 ${job.isPresent ? 'Present' : (job.endDate || '')}`
              : '';
            const jobHeading = [job.companyName, job.workSpecialization]
              .filter(Boolean)
              .join(', ');

            const bulletLines = job.summarization
              ? job.summarization.split('\n').filter(line => line.trim())
              : [];

            return (
              <div key={i} className="cv-t2-job cv-section">
                <div className="cv-t2-job-header">
                  <span className="cv-t2-job-title">
                    {jobHeading || <Skeleton width="12rem" height="0.9rem" />}
                  </span>
                  {dateRange && (
                    <span className="cv-t2-job-dates">{dateRange}</span>
                  )}
                </div>
                {job.location && (
                  <div className="cv-t2-job-location">{job.location}</div>
                )}
                {bulletLines.length > 0 && (
                  <ul className="cv-t2-bullets">
                    {bulletLines.map((line, j) => (
                      <li key={j}>{line.replace(/^[-•·]\s*/, '')}</li>
                    ))}
                  </ul>
                )}
                {job.projects.length > 0 && (
                  <ul className="cv-t2-bullets" style={{ marginTop: '0.3rem' }}>
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
      {data.education && (
        <div className="cv-t2-section">
          <hr className="cv-t2-divider" style={{ borderColor: themeColor }} />
          <h3 className="cv-t2-section-title" style={{ color: themeColor }}>EDUCATION</h3>
          <hr className="cv-t2-divider" style={{ borderColor: themeColor }} />
          <p className="cv-t2-education-text">{data.education}</p>
        </div>
      )}

      {/* TECHNICAL SKILLS */}
      {data.skills.length > 0 && (
        <div className="cv-t2-section">
          <hr className="cv-t2-divider" style={{ borderColor: themeColor }} />
          <h3 className="cv-t2-section-title" style={{ color: themeColor }}>TECHNICAL SKILLS</h3>
          <hr className="cv-t2-divider" style={{ borderColor: themeColor }} />
          <ul className="cv-t2-skills-grid">
            {data.skills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ADDITIONAL INFORMATION */}
      {data.additionalInfo && data.additionalInfo.trim() && (
        <div className="cv-t2-section">
          <hr className="cv-t2-divider" style={{ borderColor: themeColor }} />
          <h3 className="cv-t2-section-title" style={{ color: themeColor }}>ADDITIONAL INFORMATION</h3>
          <hr className="cv-t2-divider" style={{ borderColor: themeColor }} />
          <ul className="cv-t2-bullets">
            {data.additionalInfo
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
