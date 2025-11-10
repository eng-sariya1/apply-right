export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'language' | 'other';
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  startDate: string;
  endDate: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
}

export interface ATSScore {
  overall: number;
  keywordMatch: number;
  formatCompatibility: number;
  sectionCompleteness: number;
  contactInfo: number;
  fileFormat: number;
  lengthScore: number;
  suggestions: string[];
  missingKeywords: string[];
  strengths: string[];
}

export interface AIImprovement {
  original: string;
  improved: string;
  explanation: string;
}

export type CVTemplate = 'modern' | 'classic' | 'minimal' | 'professional';

export type FormStep = 'personal' | 'experience' | 'education' | 'skills' | 'certifications' | 'projects' | 'review';
