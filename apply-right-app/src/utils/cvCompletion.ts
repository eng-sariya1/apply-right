import type { CVData } from '../types/cv.types';

const weights = {
  personalDetails: 20,
  abstract: 15,
  skills: 15,
  career: 25,
  projects: 15,
  education: 10,
};

export function getCompletionProgress(cvData: CVData): number {
  const isTemplate2 = cvData.templateId === 'template2';
  const isTemplate3 = cvData.templateId === 'template3';

  let progress = 0;

  if (cvData.header?.fullName && cvData.header?.email && cvData.header?.phone && cvData.header?.specialization) {
    progress += weights.personalDetails;
  }
  if (cvData.abstract && cvData.abstract.length > 20) {
    progress += weights.abstract;
  }
  if (cvData.skills && cvData.skills.length >= 3) {
    progress += weights.skills;
  }
  if (cvData.career && cvData.career.length > 0) {
    progress += weights.career;
  }
  if (isTemplate3) {
    if (cvData.certifications && cvData.certifications.length > 5) {
      progress += weights.projects;
    }
    if (cvData.educationEntries && cvData.educationEntries.length > 0) {
      progress += weights.education;
    }
  } else if (isTemplate2) {
    if (cvData.additionalInfo && cvData.additionalInfo.length > 5) {
      progress += weights.projects;
    }
    if (cvData.education && cvData.education.length > 10) {
      progress += weights.education;
    }
  } else {
    if (cvData.personalProjects && cvData.personalProjects.length > 0) {
      progress += weights.projects;
    }
    if (cvData.education && cvData.education.length > 10) {
      progress += weights.education;
    }
  }

  return progress;
}
