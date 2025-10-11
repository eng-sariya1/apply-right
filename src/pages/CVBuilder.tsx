import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import CVFormInline from '../components/CVFormInline';
import CVDisplay from '../components/CVDisplay';
import type { CVData } from '../types/cv.types';
import '../styles/cv-builder.css';

export default function CVBuilder() {
  const navigate = useNavigate();
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
    sectionTitleColor: '017A8C'
  });

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
      sectionTitleColor: '017A8C'
    });
  }, []);

  // Calculate completion progress
  const completionProgress = useMemo(() => {
    let progress = 0;
    const weights = {
      personalDetails: 20,
      abstract: 15,
      skills: 15,
      career: 25,
      projects: 15,
      education: 10
    };

    // Personal Details
    if (cvData.header.fullName && cvData.header.email && cvData.header.phone && cvData.header.specialization) {
      progress += weights.personalDetails;
    }

    // Abstract
    if (cvData.abstract && cvData.abstract.length > 20) {
      progress += weights.abstract;
    }

    // Skills
    if (cvData.skills.length >= 3) {
      progress += weights.skills;
    }

    // Career
    if (cvData.career.length > 0) {
      progress += weights.career;
    }

    // Projects
    if (cvData.personalProjects.length > 0) {
      progress += weights.projects;
    }

    // Education
    if (cvData.education && cvData.education.length > 10) {
      progress += weights.education;
    }

    return progress;
  }, [cvData]);

  return (
    <div className="min-h-screen bg-[#FAF7F0] relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-r from-[#017A8C]/10 via-transparent to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-gradient-to-l from-[#017A8C]/10 via-transparent to-transparent blur-3xl rounded-full" />
      </div>

      {/* Sticky Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="sticky top-0 z-50 backdrop-blur-lg bg-white/90 border-b border-[#017A8C]/20 shadow-sm"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#017A8C] tracking-tight">Nuivo</h1>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-white/70 hover:bg-white text-[#017A8C] font-medium rounded-lg border border-[#017A8C]/20 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </motion.button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 pb-4">
          <div className="container mx-auto">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-[#88B7C4] whitespace-nowrap">
                {completionProgress}% Complete
              </span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionProgress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-[#017A8C] to-[#03A4BD] rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content - Two Column Layout */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:sticky lg:top-32 lg:h-fit"
          >
            <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20 p-6 max-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
              <CVFormInline
                onSubmit={handleFormSubmit}
                initialData={cvData}
              />

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-[#017A8C]/10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-[#FAF7F0] text-[#88B7C4] font-semibold rounded-lg border border-[#017A8C]/20 transition-all duration-300"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#017A8C] to-[#019baf] hover:from-[#015C6A] hover:to-[#017A8C] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Download className="w-4 h-4" />
                  Save as PDF
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Live Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <div className="lg:sticky lg:top-32">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-[#017A8C] mb-2">Live Preview</h2>
                <p className="text-sm text-[#88B7C4]">Your changes appear here in real-time</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20 p-8 overflow-hidden">
                <div className="transform scale-90 origin-top-left" style={{ width: '111%' }}>
                  <CVDisplay data={cvData} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
