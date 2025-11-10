import React, { useState, useEffect } from 'react';
import { CVData, FormStep, ATSScore } from '../types/cv.types';
import PersonalInfoForm from './forms/PersonalInfoForm';
import ExperienceForm from './forms/ExperienceForm';
import EducationForm from './forms/EducationForm';
import SkillsForm from './forms/SkillsForm';
import CertificationsForm from './forms/CertificationsForm';
import ProjectsForm from './forms/ProjectsForm';
import CVPreview from './CVPreview';
import ATSScoreCard from './ATSScoreCard';
import apiService from '../services/api.service';
import { FileText, Briefcase, GraduationCap, Award, Code, CheckCircle } from 'lucide-react';

interface CVBuilderProps {
  cvData: CVData;
  setCVData: React.Dispatch<React.SetStateAction<CVData>>;
}

const steps: { id: FormStep; label: string; icon: any }[] = [
  { id: 'personal', label: 'Personal Info', icon: FileText },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Award },
  { id: 'certifications', label: 'Certifications', icon: CheckCircle },
  { id: 'projects', label: 'Projects', icon: Code }
];

const CVBuilder: React.FC<CVBuilderProps> = ({ cvData, setCVData }) => {
  const [currentStep, setCurrentStep] = useState<FormStep>('personal');
  const [atsScore, setAtsScore] = useState<ATSScore | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    analyzeATS();
  }, [cvData]);

  const analyzeATS = async () => {
    setIsAnalyzing(true);
    try {
      const result = await apiService.analyzeATS(cvData);
      setAtsScore(result.score);
    } catch (error) {
      console.error('Error analyzing ATS:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep);

  const goToNextStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal':
        return <PersonalInfoForm cvData={cvData} setCVData={setCVData} />;
      case 'experience':
        return <ExperienceForm cvData={cvData} setCVData={setCVData} />;
      case 'education':
        return <EducationForm cvData={cvData} setCVData={setCVData} />;
      case 'skills':
        return <SkillsForm cvData={cvData} setCVData={setCVData} />;
      case 'certifications':
        return <CertificationsForm cvData={cvData} setCVData={setCVData} />;
      case 'projects':
        return <ProjectsForm cvData={cvData} setCVData={setCVData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ApplyRight CV Builder
          </h1>
          <p className="text-lg text-gray-600">
            Create an ATS-optimized CV with AI-powered suggestions
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = getCurrentStepIndex() > index;
              
              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex flex-col items-center space-y-2 transition-all ${
                      isActive ? 'scale-110' : 'scale-100'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <Icon size={24} />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isActive ? 'text-blue-600' : 'text-gray-600'
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {steps.find(s => s.id === currentStep)?.label}
              </h2>
              
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  onClick={goToPreviousStep}
                  disabled={getCurrentStepIndex() === 0}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={goToNextStep}
                  disabled={getCurrentStepIndex() === steps.length - 1}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Preview and ATS Score Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* ATS Score Card */}
            {atsScore && (
              <ATSScoreCard score={atsScore} isAnalyzing={isAnalyzing} />
            )}

            {/* Preview Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Preview</h3>
              <CVPreview cvData={cvData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;
