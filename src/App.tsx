import { useState, useCallback } from 'react';
import "primereact/resources/themes/lara-dark-cyan/theme.css";
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
    <div className="min-h-screen bg-slate-900 py-8">
      <div className={`${sidebarVisible ? 'pr-[42%]' : ''} transition-all duration-400`}>
        <div className="container mx-auto px-4">
          {!sidebarVisible && (
            <>
              <div className="no-print text-center mb-8">
                <h1 className="text-5xl font-bold text-sky-400 mb-2">CV Builder</h1>
                <p className="text-cyan-400 text-lg">Create your professional CV in minutes</p>
              </div>

              <div className="no-print flex justify-center mb-6 gap-3">
                <Button
                  label="Open Form"
                  icon="pi pi-pencil"
                  onClick={() => setSidebarVisible(true)}
                  size="large"
                  className="bg-blue-500 hover:bg-blue-600 border-0 text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-500/50"
                />
                <Button
                  label="Print / Save as PDF"
                  icon="pi pi-download"
                  onClick={() => window.print()}
                  severity="secondary"
                  size="large"
                  className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300"
                />
                <Button
                  label="Reset CV"
                  icon="pi pi-refresh"
                  onClick={handleReset}
                  severity="danger"
                  outlined
                  size="large"
                  className="transition-all duration-300"
                />
              </div>
            </>
          )}

          <div className={`cv-display-container ${sidebarVisible ? 'with-sidebar' : ''}`}>
            <CVDisplay data={cvData} />
          </div>
        </div>
      </div>

      <CVForm
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        onSubmit={handleFormSubmit}
        initialData={cvData}
      />
    </div>
  );
}

export default App;