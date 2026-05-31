import type { CVData, Career } from '../types/cv.types';

const BASE_URL = 'https://www.linkedin.com/jobs/search/';

export function getYearsOfExperience(career: Career[] | undefined): number | null {
  if (!career || career.length === 0) return null;
  let totalMs = 0;
  for (const job of career) {
    const start = job.startDate ? new Date(job.startDate) : null;
    const end = job.isPresent
      ? new Date()
      : job.endDate
        ? new Date(job.endDate)
        : null;
    if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) continue;
    const diff = end.getTime() - start.getTime();
    if (diff > 0) totalMs += diff;
  }
  if (totalMs === 0) return null;
  return totalMs / (1000 * 60 * 60 * 24 * 365.25);
}

export function mapExperienceLevel(years: number | null): string | null {
  if (years == null) return null;
  if (years < 2) return '2';
  if (years < 5) return '3';
  if (years < 10) return '4';
  return '5';
}

export function buildLinkedInJobsUrl(cvData: CVData): string | null {
  const specialization = cvData.header?.specialization?.trim() || '';
  const skills = (cvData.skills || []).map((s) => s.trim()).filter(Boolean);
  const keywordsRaw = specialization || skills[0] || '';
  if (!keywordsRaw) return null;

  const params: string[] = [`keywords=${encodeURIComponent(keywordsRaw)}`];
  const location = cvData.header?.address?.trim();
  if (location) params.push(`location=${encodeURIComponent(location)}`);
  const fE = mapExperienceLevel(getYearsOfExperience(cvData.career));
  if (fE) params.push(`f_E=${fE}`);

  return `${BASE_URL}?${params.join('&')}`;
}
