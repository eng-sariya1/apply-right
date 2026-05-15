export interface CVHeader {
  fullName: string;
  specialization: string;
  email: string;
  phone: string;
  links: Link[];
  address?: string;
  photoUrl?: string;
}

export interface Link {
  name: string;
  url: string;
  icon?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string;
  keyContributions: string[];
}

export interface Career {
  startDate: string;
  endDate: string | null;
  isPresent: boolean;
  location: string;
  companyName: string;
  workSpecialization: string;
  jobType: 'Full time' | 'Part time' | 'Contract' | 'Freelance';
  summarization: string;
  projects: Project[];
}

export interface PersonalProject {
  title: string;
  description: string;
  technologies: string;
  keyFeatures: string[];
}

export interface EducationEntry {
  degree: string;
  institution: string;
  location: string;
  graduationYear: string;
}

export type TemplateId = 'template1' | 'template2' | 'template3';

export interface CVData {
  header: CVHeader;
  abstract: string;
  skills: string[];
  career: Career[];
  personalProjects: PersonalProject[];
  education: string;
  sectionTitleColor?: string;
  templateId?: TemplateId;
  additionalInfo?: string;
  certifications?: string;
  educationEntries?: EducationEntry[];
}

export interface ATSAnalysisResult {
  matchPercentage: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  keywordMatches: {
    matched: string[];
    missing: string[];
  };
}

export type SuggestionType = 'keyword' | 'phrasing' | 'skill' | 'summary';
export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface OptimizationSuggestion {
  id: string;
  type: SuggestionType;
  section: string; // e.g., 'abstract', 'career[0].summarization', 'skills'
  title: string; // Brief description of the change
  original: string;
  suggested: string;
  confidence: ConfidenceLevel;
  reason: string; // Why this change is recommended
  approved?: boolean; // User approval status
}

export interface CVOptimizationResult {
  suggestions: OptimizationSuggestion[];
  summary: {
    totalSuggestions: number;
    keywordSuggestions: number;
    phrasingSuggestions: number;
    skillSuggestions: number;
    highConfidenceCount: number;
  };
}
