import React, { useState } from 'react';
import CVBuilder from './components/CVBuilder';
import { CVData, PersonalInfo, Experience, Education, Skill, Certification, Project } from './types/cv.types';

const initialCVData: CVData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: ''
  },
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: []
};

function App() {
  const [cvData, setCVData] = useState<CVData>(initialCVData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <CVBuilder cvData={cvData} setCVData={setCVData} />
    </div>
  );
}

export default App;
