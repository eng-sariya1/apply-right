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
    sectionTitleColor: '1e3a8a'
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
      sectionTitleColor: '1e3a8a'
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className={`${sidebarVisible ? 'pr-[42%]' : ''} transition-all duration-400`}>
        <div className="container mx-auto px-4">
          {!sidebarVisible && (
            <>
              <div className="no-print mb-12">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4 leading-tight tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', textAlign: 'left', marginLeft: '2rem' }}>
                  Let AI craft your perfect CV — fast, modern, and ready to impress
                </h1>
                <p className="text-slate-50 text-lg max-w-4xl leading-relaxed mb-8" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 500, textAlign: 'left', marginLeft: '2rem' }}>
                  Build a stunning, professional CV powered by the Gemini AI model and optimized with ATS technology — designed to help you stand out and land your dream job
                </p>
              </div>

              <div className="no-print flex justify-center mb-6 gap-3">
                <Button
                  label="Open Form"
                  icon="pi pi-pencil"
                  onClick={() => setSidebarVisible(true)}
                  size="large"
                  className="glass-btn-base glass-btn-primary glass-btn-lg"
                  data-cy="open-form-button"
                />
                <Button
                  label="Print / Save as PDF"
                  icon="pi pi-download"
                  onClick={() => window.print()}
                  severity="secondary"
                  size="large"
                  className="glass-btn-base glass-btn-secondary glass-btn-lg"
                />
                <Button
                  label="Reset CV"
                  icon="pi pi-refresh"
                  onClick={handleReset}
                  severity="danger"
                  outlined
                  size="large"
                  className="glass-btn-base glass-btn-danger glass-btn-lg"
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