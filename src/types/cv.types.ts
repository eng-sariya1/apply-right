export interface CVHeader {
  fullName: string;
  specialization: string;
  email: string;
  phone: string;
  links: Link[];
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

export interface CVData {
  header: CVHeader;
  abstract: string;
  skills: string[];
  career: Career[];
  personalProjects: PersonalProject[];
  education: string;
  sectionTitleColor?: string;
}
