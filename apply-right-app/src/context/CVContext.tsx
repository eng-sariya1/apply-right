import { createContext, useContext, useState, type ReactNode } from 'react';
import type { CVData, ATSAnalysisResult } from '../types/cv.types';

interface CVContextType {
  cvData: CVData;
  setCvData: (data: CVData) => void;
  atsResult: ATSAnalysisResult | null;
  setAtsResult: (result: ATSAnalysisResult | null) => void;
}

const defaultCVData: CVData = {
  header: {
    fullName: '',
    specialization: '',
    email: '',
    phone: '',
    links: [],
  },
  abstract: '',
  skills: [],
  career: [],
  personalProjects: [],
  education: '',
  sectionTitleColor: '017A8C',
  templateId: 'template1',
  additionalInfo: '',
};

const CVContext = createContext<CVContextType | undefined>(undefined);

export const CVProvider = ({ children }: { children: ReactNode }) => {
  const [cvData, setCvData] = useState<CVData>(defaultCVData);
  const [atsResult, setAtsResult] = useState<ATSAnalysisResult | null>(null);

  return (
    <CVContext.Provider value={{ cvData, setCvData, atsResult, setAtsResult }}>
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
