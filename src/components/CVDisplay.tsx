import type { CVData } from '../types/cv.types';
import '../styles/cv.css';

interface CVDisplayProps {
  data: CVData;
}

export default function CVDisplay({ data }: CVDisplayProps) {
  return (
    <div className="cv-container">
      <div className="total">
        <header>
          <h1>{data.header.fullName} | {data.header.specialization}</h1>
          <div>
            <ul className="headers">
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="headerIcon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                <a href={`mailto:${data.header.email}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#000' }}>
                  {data.header.email}
                </a>
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="headerIcon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                  />
                </svg>
                <a href={`tel:${data.header.phone}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#000' }}>
                  {data.header.phone}
                </a>
              </li>
              {data.header.links.map((link, index) => (
                <li key={index}>
                  {link.name.toLowerCase().includes('linkedin') ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="headerIcon" viewBox="0 0 512 512">
                      <path d="M444.17 32H70.28C49.85 32 32 46.7 32 66.89v374.72C32 461.91 49.85 480 70.28 480h373.78c20.54 0 35.94-18.21 35.94-38.39V66.89C480.12 46.7 464.6 32 444.17 32zm-273.3 373.43h-64.18V205.88h64.18zM141 175.54h-.46c-20.54 0-33.84-15.29-33.84-34.43 0-19.49 13.65-34.42 34.65-34.42s33.85 14.82 34.31 34.42c-.01 19.14-13.31 34.43-34.66 34.43zm264.43 229.89h-64.18V296.32c0-26.14-9.34-44-32.56-44-17.74 0-28.24 12-32.91 23.69-1.75 4.2-2.22 9.92-2.22 15.76v113.66h-64.18V205.88h64.18v27.77c9.34-13.3 23.93-32.44 57.88-32.44 42.13 0 74 27.77 74 87.64z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="headerIcon">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"/>
                    </svg>
                  )}
                  <a href={link.url} style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </header>

        {data.abstract && (
          <div className="profile">
            <div>
              <h2></h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p>{data.abstract}</p>
              </div>
            </div>
          </div>
        )}

        {data.skills.length > 0 && (
          <div className="skill">
            <div>
              <h2>Skills</h2>
            </div>
            <div>
              <ul className="skills">
                {Array.from({ length: Math.ceil(data.skills.length / 5) }).map((_, colIndex) => (
                  <div key={colIndex}>
                    {data.skills.slice(colIndex * 5, (colIndex + 1) * 5).map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </div>
                ))}
              </ul>
            </div>
          </div>
        )}

        {data.career.length > 0 && (
          <div className="career">
            <div>
              <h2>Career</h2>
            </div>

            {data.career.map((career, careerIndex) => (
              <div key={careerIndex}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '5rem', paddingTop: careerIndex === 0 ? '0rem' : '3rem' }}>
                  <div>
                    <p>
                      {career.startDate} - {career.isPresent ? 'Present' : career.endDate}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px' }}>
                      <p>{career.location}</p>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px' }}>
                      <p>{career.companyName}</p>
                    </div>
                    <p>{career.workSpecialization} ({career.jobType})</p>
                  </div>
                </div>
                <div>
                  <p style={{ paddingTop: '1rem', paddingBottom: '1rem', fontWeight: 'normal', filter: 'opacity(0.8)' }}>
                    {career.summarization}
                  </p>
                  {career.projects.length > 0 && (
                    <>
                      <p style={{ marginBottom: '-1rem' }}>Projects:</p>
                      <ul className="mainCareerList">
                        {career.projects.map((project, projectIndex) => (
                          <div key={projectIndex}>
                            <li className="careerTitle">{project.name}</li>
                            <ul className="careerList">
                              <li>
                                <b>Description:</b>
                                <label>{project.description}</label>
                              </li>
                              <li>
                                <b>Technologies:</b>
                                <label>{project.technologies}</label>
                              </li>
                              {project.keyContributions.length > 0 && (
                                <>
                                  <li><b>Key Contributions:</b></li>
                                  <ul className="secondCareerList">
                                    {project.keyContributions.map((contribution, contribIndex) => (
                                      <li key={contribIndex}>{contribution}</li>
                                    ))}
                                  </ul>
                                </>
                              )}
                            </ul>
                          </div>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
                {careerIndex < data.career.length - 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ border: '1px solid #000', filter: 'opacity(0.6)', marginTop: '2rem', width: '80%' }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {data.personalProjects.length > 0 && (
          <div className="career">
            <div>
              <h2>Personal Projects</h2>
            </div>
            <div>
              <ul className="mainCareerList">
                {data.personalProjects.map((project, projectIndex) => (
                  <div key={projectIndex}>
                    <li className="careerTitle">{project.title}</li>
                    <ul className="careerList">
                      <li>
                        <b>Description:</b>
                        <label>{project.description}</label>
                      </li>
                      <li>
                        <b>Technologies:</b>
                        <label>{project.technologies}</label>
                      </li>
                      {project.keyFeatures.length > 0 && (
                        <>
                          <li><b>Key Features:</b></li>
                          <ul className="secondCareerList">
                            {project.keyFeatures.map((feature, featureIndex) => (
                              <li key={featureIndex}>{feature}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </ul>
                  </div>
                ))}
              </ul>
            </div>
          </div>
        )}

        {data.education && (
          <div className="career">
            <div>
              <h2>Education</h2>
              <p style={{ whiteSpace: 'pre-wrap' }}>{data.education}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
