import { useState, useCallback } from 'react';
import "primereact/resources/themes/lara-dark-amber/theme.css";
import "primeicons/primeicons.css";
import './App.css';
import CVForm from './components/CVForm';
import CVDisplay from './components/CVDisplay';
import { Button } from 'primereact/button';
import type { CVData } from './types/cv.types';

function App() {
  const [cvData, setCvData] = useState<CVData>({
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
    sectionTitleColor: '000000'
  });
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleFormSubmit = useCallback((data: CVData) => {
    setCvData(data);
  }, []);

  const handleReset = useCallback(() => {
    setCvData({
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
      sectionTitleColor: '000000'
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-yellow-500 mb-2">CV Builder</h1>
          <p className="text-yellow-600 text-lg">Create your professional CV in minutes</p>
        </div>

        <div className="flex justify-center mb-6 gap-3">
          <Button
            label="Open Form"
            icon="pi pi-pencil"
            onClick={() => setSidebarVisible(true)}
            size="large"
          />
          <Button
            label="Print / Save as PDF"
            icon="pi pi-download"
            onClick={() => window.print()}
            severity="secondary"
            size="large"
          />
          <Button
            label="Reset CV"
            icon="pi pi-refresh"
            onClick={handleReset}
            severity="danger"
            outlined
            size="large"
          />
        </div>

        <CVDisplay data={cvData} />

        <CVForm
          visible={sidebarVisible}
          onHide={() => setSidebarVisible(false)}
          onSubmit={handleFormSubmit}
          initialData={cvData}
        />
      </div>
    </div>
  );
}

export default App;