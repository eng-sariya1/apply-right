import { useState } from 'react';
import "primereact/resources/themes/lara-dark-amber/theme.css";
import "primeicons/primeicons.css";
import './App.css';
import CVForm from './components/CVForm';
import CVDisplay from './components/CVDisplay';
import { Button } from 'primereact/button';
import type { CVData } from './types/cv.types';

function App() {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleFormSubmit = (data: CVData) => {
    setCvData(data);
  };

  const handleReset = () => {
    setCvData(null);
  };

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
          {cvData && (
            <>
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
            </>
          )}
        </div>

        {cvData ? (
          <CVDisplay data={cvData} />
        ) : (
          <div className="text-center py-24 text-yellow-600">
            <i className="pi pi-file text-8xl mb-6 block"></i>
            <h2 className="text-3xl font-bold mb-3">No CV Created Yet</h2>
            <p className="text-xl mb-6">Click "Open Form" to start building your CV</p>
          </div>
        )}

        <CVForm
          visible={sidebarVisible}
          onHide={() => setSidebarVisible(false)}
          onSubmit={handleFormSubmit}
          initialData={cvData || undefined}
        />
      </div>
    </div>
  );
}

export default App;