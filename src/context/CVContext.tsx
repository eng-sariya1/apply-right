import { createContext, useContext, useState, ReactNode } from 'react';
import type { CVData } from '../types/cv.types';

interface CVContextType {
  cvData: CVData;
  setCvData: (data: CVData) => void;
}

const defaultCVData: CVData = {
  header: {
    fullName: '',
    specialization: '',
    email: '',
    phone: '',
    links: []
  },
  abstract: '',
  skills: [],
  career: [],
  personalProjects: [],
  education: '',
  sectionTitleColor: '017A8C'
};

const CVContext = createContext<CVContextType | undefined>(undefined);

export const CVProvider = ({ children }: { children: ReactNode }) => {
  const [cvData, setCvData] = useState<CVData>(defaultCVData);

  return (
    <CVContext.Provider value={{ cvData, setCvData }}>
      {children}
    </CVContext.Provider>
  );
};

export const useCVContext = () => {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error('useCVContext must be used within a CVProvider');
  }
  return context;
};
