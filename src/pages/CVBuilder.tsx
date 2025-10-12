import { useCallback, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, RefreshCw, FileSearch, X, Edit3 } from 'lucide-react';
import CVFormInline from '../components/CVFormInline';
import CVDisplay from '../components/CVDisplay';
import type { CVData } from '../types/cv.types';
import { useCVContext } from '../context/CVContext';
import '../styles/cv-builder.css';

export default function CVBuilder() {
  const navigate = useNavigate();
  const { cvData, setCvData } = useCVContext();
  const [showModal, setShowModal] = useState(false);

  // Disable background scrolling when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const handleFormSubmit = useCallback((data: CVData) => {
    setCvData(data);
  }, [setCvData]);

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
  }, [setCvData]);

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
              <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-[#017A8C]/10">
                <div className="flex gap-3">
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
              {/* Header with Title and Button */}
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-[#017A8C] mb-1">Live Preview</h2>
                  <p className="text-sm text-[#88B7C4]">Your changes appear here in real-time</p>
                </div>

                {/* View Full CV Button */}
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(1, 122, 140, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[#017A8C] hover:bg-[#015C6A] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 whitespace-nowrap sm:self-start"
                >
                  <FileSearch className="w-4 h-4" />
                  View Full CV
                </motion.button>
              </div>

              <div
                className="cv-preview-wrapper bg-white rounded-xl shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20 p-8"
                style={{ overflow: 'visible', maxHeight: 'none', height: 'auto' }}
              >
                <CVDisplay data={cvData} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Full CV Preview Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              style={{ overflow: 'hidden' }}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 overflow-hidden">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white hover:bg-gray-100 rounded-full shadow-md transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>

                {/* Modal Content */}
                <div className="p-8">
                  {/* Motivational Text */}
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[#02343F] mb-3">
                      Here's your professional CV preview
                    </h2>
                    <p className="text-lg text-[#88B7C4]">
                      Review it before saving or sharing!
                    </p>
                  </div>

                  {/* A4 CV Preview Container */}
                  <div className="flex justify-center mb-8">
                    <div
                      className="bg-white rounded-lg shadow-xl border border-gray-200 p-8"
                      style={{
                        width: '21cm',
                        maxWidth: '100%',
                        aspectRatio: '1 / 1.414'
                      }}
                    >
                      <CVDisplay data={cvData} />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                  >
                    <motion.button
                      whileHover={{ scale: 1.03, boxShadow: '0 10px 30px rgba(1, 122, 140, 0.3)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.print()}
                      className="flex items-center justify-center gap-2 px-8 py-3 bg-[#017A8C] hover:bg-[#015C6A] text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
                    >
                      <Download className="w-5 h-5" />
                      Download as PDF
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03, backgroundColor: 'rgba(250, 247, 240, 0.5)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowModal(false)}
                      className="flex items-center justify-center gap-2 px-8 py-3 bg-transparent text-[#017A8C] font-semibold rounded-lg border-2 border-[#017A8C] transition-all duration-300"
                    >
                      <Edit3 className="w-5 h-5" />
                      Edit Again
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
