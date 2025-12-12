import { useCallback, useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, RefreshCw, FileSearch, Edit3 } from 'lucide-react';
import { Dialog } from 'primereact/dialog';
import { useReactToPrint } from 'react-to-print';
import CVFormInline from '../components/CVFormInline';
import CVDisplay from '../components/CVDisplay';
import CVPaginatedPreview from '../components/CVPaginatedPreview';
import type { CVData } from '../types/cv.types';
import { useCVContext } from '../context/CVContext';
import '../styles/cv-builder.css';
import '../styles/cv.css';

export default function CVBuilder() {
  const navigate = useNavigate();
  const { cvData, setCvData } = useCVContext();
  const [showModal, setShowModal] = useState(false);
  const cvDisplayRef = useRef<HTMLDivElement>(null);

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
    if (cvData.header?.fullName && cvData.header?.email && cvData.header?.phone && cvData.header?.specialization) {
      progress += weights.personalDetails;
    }

    // Abstract
    if (cvData.abstract && cvData.abstract.length > 20) {
      progress += weights.abstract;
    }

    // Skills
    if (cvData.skills && cvData.skills.length >= 3) {
      progress += weights.skills;
    }

    // Career
    if (cvData.career && cvData.career.length > 0) {
      progress += weights.career;
    }

    // Projects
    if (cvData.personalProjects && cvData.personalProjects.length > 0) {
      progress += weights.projects;
    }

    // Education
    if (cvData.education && cvData.education.length > 10) {
      progress += weights.education;
    }

    return progress;
  }, [cvData]);

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

  // Use react-to-print for PDF generation with contentRef
  const handlePrint = useReactToPrint({
    contentRef: cvDisplayRef,
    documentTitle: cvData.header.fullName
      ? `${cvData.header.fullName.replace(/\s+/g, '_')}_CV`
      : 'CV',
  });

  const handleSavePDF = useCallback(() => {
    if (!cvDisplayRef.current) {
      alert('CV content not available. Please try again.');
      return;
    }
    handlePrint();
  }, [handlePrint]);

  const handleDownloadPDF = useCallback(() => {
    if (!cvDisplayRef.current) {
      alert('CV content not available. Please try again.');
      return;
    }
    handlePrint();
  }, [handlePrint]);


  return (
    <div className="min-h-screen bg-[#FAF7F0] relative overflow-hidden no-print">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none no-print">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-r from-[#017A8C]/10 via-transparent to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-gradient-to-l from-[#017A8C]/10 via-transparent to-transparent blur-3xl rounded-full" />
      </div>

      {/* Sticky Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="sticky top-0 z-50 backdrop-blur-lg bg-white/90 border-b border-[#017A8C]/20 shadow-sm no-print"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#017A8C] tracking-tight">Nuivo</h1>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#017A8C] hover:bg-[#015C6A] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 whitespace-nowrap sm:self-start"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content - Resume.io Style Layout */}
      <div className="px-10 py-6 no-print">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Form Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-1/2 no-print"
          >
            <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20 max-h-[calc(100vh-180px)] overflow-y-auto overflow-x-hidden custom-scrollbar no-print relative">
              <div className="px-6 py-6 w-full">
                {/* Progress Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="sticky top-0 z-50 bg-white/80 backdrop-blur-md rounded-xl shadow-md shadow-[#017A8C]/15 p-3 border border-[#017A8C]/10 mb-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-[#017A8C] whitespace-nowrap">
                      {completionProgress}%
                    </span>
                    <div className="flex-1">
                      <div className="h-2 bg-[#FAF7F0] rounded-full overflow-hidden border border-[#C6DEE4]/30">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${completionProgress}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-[#017A8C] to-[#019baf] rounded-full shadow-sm"
                        />
                      </div>
                      <p className="text-xs text-[#88B7C4] mt-1">
                        Complete all sections to reach 100%
                      </p>
                    </div>
                  </div>
                </motion.div>

                <CVFormInline
                  onSubmit={handleFormSubmit}
                  initialData={cvData}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 px-6 pb-6 pt-6 border-t border-[#017A8C]/10 w-full">
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
                    onClick={handleSavePDF}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#017A8C] to-[#019baf] hover:from-[#015C6A] hover:to-[#017A8C] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Download className="w-4 h-4" />
                    Save as PDF
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - A4 Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full lg:w-1/2 flex flex-col no-print"
          >
            <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20 p-6 no-print">
              {/* Header with Title and Button */}
              <div className="w-full mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 no-print">
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

              {/* A4 Paginated Preview */}
              <CVPaginatedPreview data={cvData} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Full CV Preview Dialog */}
      <Dialog
        header={
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#02343F] mb-2">
              Your Professional CV Preview
            </h2>
            <p className="text-base text-[#88B7C4]">
              Review it before saving or sharing!
            </p>
          </div>
        }
        visible={showModal}
        onHide={() => setShowModal(false)}
        style={{ width: '80vw', height:'90vh' }}
        modal
        dismissableMask
        draggable={false}
        className="cv-preview-dialog"
        contentClassName="p-6"
      >
        {/* A4 CV Preview Container */}
        <div className="flex justify-center mb-6">
          <div
            className="bg-white rounded-lg shadow-xl border border-gray-200 p-8"
            style={{
              width: '80vw',
              maxWidth: '100%',
              // aspectRatio: '1 / 1.414'
            }}
          >
            <CVDisplay data={cvData} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownloadPDF}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-[#017A8C] hover:bg-[#015C6A] text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
          >
            <Download className="w-5 h-5" />
            Download as PDF
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(false)}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-transparent text-[#017A8C] font-semibold rounded-lg border-2 border-[#017A8C] hover:bg-[#FAF7F0]/50 transition-all duration-300"
          >
            <Edit3 className="w-5 h-5" />
            Edit Again
          </motion.button>
        </div>
      </Dialog>

      {/* Hidden CV Display for PDF Generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div
          ref={cvDisplayRef}
          className="cv-container"
          style={{
            transform: 'scale(1)',
            transformOrigin: 'top left',
            boxShadow: 'none'
          }}
        >
          <CVDisplay data={cvData} />
        </div>
      </div>
    </div>
  );
}
