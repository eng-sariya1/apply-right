import { useCallback, useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, RefreshCw, FileSearch, Edit3, Save, Plus, Trash2, FileText, ChevronDown, ChevronUp, Home, ChevronRight, Layers } from 'lucide-react';
import { Dialog } from 'primereact/dialog';
import { useReactToPrint } from 'react-to-print';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import CVFormInline from '../components/CVFormInline';
import CVFormTemplate2 from '../components/CVFormTemplate2';
import CVFormTemplate3 from '../components/CVFormTemplate3';
import CVDisplay from '../components/CVDisplay';
import CVDisplayTemplate2 from '../components/CVDisplayTemplate2';
import CVDisplayTemplate3 from '../components/CVDisplayTemplate3';
import CVPaginatedPreview from '../components/CVPaginatedPreview';
import type { CVData } from '../types/cv.types';
import { useCVContext } from '../context/CVContext';
import '../styles/cv-builder.css';
import '../styles/cv.css';

interface SavedCV extends CVData {
  id: string;
  savedAt: string;
}

const emptyCVData: CVData = {
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
  sectionTitleColor: '017A8C',
  templateId: 'template1',
  additionalInfo: ''
};

export default function CVBuilder() {
  const navigate = useNavigate();
  const { cvData, setCvData } = useCVContext();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedCvs, setSavedCvs] = useState<SavedCV[]>([]);
  const [activeCvId, setActiveCvId] = useState<string | null>(null);
  const [loadingCvs, setLoadingCvs] = useState(true);
  const [showMyCvs, setShowMyCvs] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const cvDisplayRef = useRef<HTMLDivElement>(null);

  // Fetch saved CVs from Firestore on mount
  useEffect(() => {
    const fetchSavedCvs = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoadingCvs(false);
        return;
      }

      try {
        const userCvsRef = doc(db, 'cvs', user.uid);
        const docSnap = await getDoc(userCvsRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setSavedCvs(data.cvList || []);
        }
      } catch (error) {
        console.error('Error fetching CVs:', error);
      } finally {
        setLoadingCvs(false);
      }
    };

    // Wait a moment for auth to be ready
    const unsubscribe = auth.onAuthStateChanged(() => {
      fetchSavedCvs();
    });

    return () => unsubscribe();
  }, []);

  const isTemplate2 = cvData.templateId === 'template2';
  const isTemplate3 = cvData.templateId === 'template3';

  const handleSwitchTemplate = useCallback((templateId: 'template1' | 'template2' | 'template3') => {
    setCvData({ ...cvData, templateId });
  }, [cvData, setCvData]);

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

    if (cvData.header?.fullName && cvData.header?.email && cvData.header?.phone && cvData.header?.specialization) {
      progress += weights.personalDetails;
    }
    if (cvData.abstract && cvData.abstract.length > 20) {
      progress += weights.abstract;
    }
    if (cvData.skills && cvData.skills.length >= 3) {
      progress += weights.skills;
    }
    if (cvData.career && cvData.career.length > 0) {
      progress += weights.career;
    }
    if (isTemplate3) {
      if (cvData.certifications && cvData.certifications.length > 5) {
        progress += weights.projects;
      }
      if (cvData.educationEntries && cvData.educationEntries.length > 0) {
        progress += weights.education;
      }
    } else if (isTemplate2) {
      if (cvData.additionalInfo && cvData.additionalInfo.length > 5) {
        progress += weights.projects;
      }
      if (cvData.education && cvData.education.length > 10) {
        progress += weights.education;
      }
    } else {
      if (cvData.personalProjects && cvData.personalProjects.length > 0) {
        progress += weights.projects;
      }
      if (cvData.education && cvData.education.length > 10) {
        progress += weights.education;
      }
    }

    return progress;
  }, [cvData, isTemplate2]);

  const handleFormSubmit = useCallback((data: CVData) => {
    setCvData(data);
  }, [setCvData]);

  const handleReset = useCallback(() => {
    setCvData({ ...emptyCVData });
    setActiveCvId(null);
  }, [setCvData]);

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

  // Save CV to Firestore
  const handleSaveCV = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      alert('Please log in to save your CV.');
      return;
    }

    if (!cvData.header.fullName) {
      alert('Please fill in at least your full name before saving.');
      return;
    }

    setSaving(true);
    try {
      const userCvsRef = doc(db, 'cvs', user.uid);
      const docSnap = await getDoc(userCvsRef);
      let currentList: SavedCV[] = docSnap.exists() ? (docSnap.data().cvList || []) : [];

      if (activeCvId) {
        // Update existing CV
        currentList = currentList.map(cv =>
          cv.id === activeCvId
            ? { ...cvData, id: activeCvId, savedAt: new Date().toISOString() }
            : cv
        );
      } else {
        // Create new CV
        const newId = crypto.randomUUID();
        const newEntry: SavedCV = {
          ...cvData,
          id: newId,
          savedAt: new Date().toISOString(),
        };
        currentList.push(newEntry);
        setActiveCvId(newId);
      }

      await setDoc(userCvsRef, { cvList: currentList });
      setSavedCvs(currentList);
      alert('CV saved successfully!');
    } catch (error) {
      console.error('Error saving CV:', error);
      alert('Failed to save CV. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [cvData, activeCvId]);

  // Load a saved CV into the editor
  const handleLoadCV = useCallback((cv: SavedCV) => {
    const { id, savedAt, ...cvDataWithoutMeta } = cv;
    setCvData(cvDataWithoutMeta);
    setActiveCvId(id);
  }, [setCvData]);

  // Start a new blank CV
  const handleNewCV = useCallback(() => {
    setCvData({ ...emptyCVData });
    setActiveCvId(null);
  }, [setCvData]);

  // Delete a saved CV
  const handleDeleteCV = useCallback(async (cvId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    setDeleting(cvId);
    try {
      const userCvsRef = doc(db, 'cvs', user.uid);
      const updatedList = savedCvs.filter(cv => cv.id !== cvId);
      await setDoc(userCvsRef, { cvList: updatedList });
      setSavedCvs(updatedList);

      if (activeCvId === cvId) {
        setCvData({ ...emptyCVData });
        setActiveCvId(null);
      }
    } catch (error) {
      console.error('Error deleting CV:', error);
      alert('Failed to delete CV. Please try again.');
    } finally {
      setDeleting(null);
    }
  }, [savedCvs, activeCvId, setCvData]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
        className="sticky top-0 z-50 no-print"
      >
        <div className="bg-gradient-to-r from-[#015C6A] via-[#017A8C] to-[#019baf] rounded-b-[2rem] shadow-lg shadow-[#017A8C]/20 relative overflow-hidden">
          {/* Decorative blurs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 blur-2xl" />
          </div>

          {/* Top nav row */}
          <div className="container mx-auto px-6 pt-4 pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <motion.div whileHover={{ scale: 1.05 }} className="text-2xl font-bold text-white tracking-tight cursor-pointer" onClick={() => navigate('/')}>
                Nuivo
              </motion.div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-300">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </motion.button>
            </div>
          </div>

          {/* Breadcrumb + Title + Progress */}
          <div className="container mx-auto px-6 pb-6 pt-1 relative z-10">
            <div className="flex items-center gap-1.5 text-white/60 text-sm mb-3">
              <Home className="w-3.5 h-3.5" />
              <button onClick={() => navigate('/')} className="hover:text-white/90 transition-colors">Home</button>
              <ChevronRight className="w-3.5 h-3.5" />
              <button onClick={() => navigate('/templates')} className="hover:text-white/90 transition-colors">Templates</button>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white font-medium">Resume Builder</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white leading-tight">Resume Builder</h1>
                  <p className="text-sm text-white/60">{activeCvId ? 'Editing saved resume' : 'Create a new professional resume'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/15 min-w-[200px]">
                <span className="text-lg font-bold text-white">{completionProgress}%</span>
                <div className="flex-1">
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${completionProgress}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} className="h-full bg-white rounded-full" />
                  </div>
                  <p className="text-[11px] text-white/50 mt-0.5">Completion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* My CVs Section */}
      {auth.currentUser && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="px-10 pt-4 no-print"
        >
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#017A8C] via-[#019baf] to-[#88B7C4]" />
            {/* Section Header - Clickable Toggle */}
            <button
              onClick={() => setShowMyCvs(!showMyCvs)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#FAF7F0]/50 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#017A8C] to-[#019baf] flex items-center justify-center shadow-md">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <h2 className="text-lg font-bold text-[#02343F]">My CVs</h2>
                  <p className="text-xs text-[#88B7C4]">
                    {savedCvs.length} saved CV{savedCvs.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => { e.stopPropagation(); handleNewCV(); }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#017A8C] to-[#019baf] hover:from-[#015C6A] hover:to-[#017A8C] text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  New CV
                </motion.div>
                {showMyCvs ? (
                  <ChevronUp className="w-5 h-5 text-[#88B7C4]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#88B7C4]" />
                )}
              </div>
            </button>

            {/* CV Cards Grid */}
            <AnimatePresence>
              {showMyCvs && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 pt-1">
                    {loadingCvs ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-6 h-6 border-2 border-[#017A8C] border-t-transparent rounded-full animate-spin" />
                        <span className="ml-3 text-sm text-[#88B7C4]">Loading your CVs...</span>
                      </div>
                    ) : savedCvs.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#FAF7F0] border-2 border-dashed border-[#C6DEE4] flex items-center justify-center">
                          <FileText className="w-7 h-7 text-[#C6DEE4]" />
                        </div>
                        <p className="text-sm text-[#88B7C4] font-medium">No saved CVs yet</p>
                        <p className="text-xs text-[#C6DEE4] mt-1">Fill in the form below and click Save to store your first CV</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {savedCvs.map((cv, index) => (
                          <motion.div
                            key={cv.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className={`group relative rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                              activeCvId === cv.id
                                ? 'border-[#017A8C] bg-gradient-to-br from-[#017A8C]/5 to-[#019baf]/5 shadow-md shadow-[#017A8C]/15'
                                : 'border-[#C6DEE4]/50 bg-white hover:border-[#017A8C]/40 hover:shadow-md'
                            }`}
                            onClick={() => handleLoadCV(cv)}
                          >
                            {/* Active Indicator */}
                            {activeCvId === cv.id && (
                              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#017A8C] to-[#019baf]" />
                            )}

                            <div className="p-4">
                              {/* CV Icon & Name */}
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                    activeCvId === cv.id
                                      ? 'bg-[#017A8C] shadow-sm'
                                      : 'bg-[#FAF7F0] group-hover:bg-[#017A8C]/10'
                                  }`}>
                                    <FileText className={`w-4 h-4 ${
                                      activeCvId === cv.id ? 'text-white' : 'text-[#017A8C]'
                                    }`} />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h3 className="text-sm font-bold text-[#02343F] truncate">
                                      {cv.header.fullName || 'Untitled CV'}
                                    </h3>
                                    <p className="text-xs text-[#88B7C4] truncate">
                                      {cv.header.specialization || 'No specialization'}
                                    </p>
                                  </div>
                                </div>

                                {/* Delete Button */}
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm('Are you sure you want to delete this CV?')) {
                                      handleDeleteCV(cv.id);
                                    }
                                  }}
                                  disabled={deleting === cv.id}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 text-[#C6DEE4] hover:text-red-500 flex-shrink-0"
                                >
                                  {deleting === cv.id ? (
                                    <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Trash2 className="w-3.5 h-3.5" />
                                  )}
                                </motion.button>
                              </div>

                              {/* Meta Info */}
                              <div className="flex items-center gap-2 mt-3">
                                <span className="text-[10px] text-[#88B7C4] bg-[#FAF7F0] px-2 py-0.5 rounded-full">
                                  {cv.skills?.length || 0} skills
                                </span>
                                <span className="text-[10px] text-[#88B7C4] bg-[#FAF7F0] px-2 py-0.5 rounded-full">
                                  {cv.career?.length || 0} jobs
                                </span>
                              </div>

                              {/* Date */}
                              <p className="text-[10px] text-[#C6DEE4] mt-2">
                                {formatDate(cv.savedAt)}
                              </p>
                            </div>

                            {/* Active Label */}
                            {activeCvId === cv.id && (
                              <div className="absolute bottom-0 left-0 right-0 bg-[#017A8C] py-1 text-center">
                                <span className="text-[10px] font-semibold text-white tracking-wide uppercase">Editing</span>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Template Switcher */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="px-10 pt-3 pb-1 no-print"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#88B7C4] uppercase tracking-wider whitespace-nowrap">Template:</span>
          <div className="flex gap-2">
            {([
              { id: 'template1', label: 'Classic' },
              { id: 'template2', label: 'Professional' },
              { id: 'template3', label: 'Modern' },
            ] as const).map((t) => {
              const active = cvData.templateId === t.id;
              return (
                <motion.button
                  key={t.id}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSwitchTemplate(t.id)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                    active
                      ? 'bg-[#017A8C] border-[#017A8C] text-white shadow-md'
                      : 'bg-white border-[#C6DEE4]/60 text-[#5A6A6F] hover:border-[#017A8C]/50 hover:text-[#017A8C]'
                  }`}
                >
                  {t.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Main Content - Resume.io Style Layout */}
      <div className="px-10 pt-4 pb-6 no-print">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Form Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-1/2 no-print"
          >
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20 max-h-[calc(100vh-240px)] overflow-y-auto overflow-x-hidden custom-scrollbar no-print relative">
              <div className="h-1 bg-gradient-to-r from-[#017A8C] via-[#019baf] to-[#88B7C4]" />
              <div className="px-6 py-6 w-full">
                {isTemplate3 ? (
                  <CVFormTemplate3
                    key={`${activeCvId || 'new'}-template3`}
                    onSubmit={handleFormSubmit}
                    initialData={cvData}
                  />
                ) : isTemplate2 ? (
                  <CVFormTemplate2
                    key={`${activeCvId || 'new'}-template2`}
                    onSubmit={handleFormSubmit}
                    initialData={cvData}
                  />
                ) : (
                  <CVFormInline
                    key={`${activeCvId || 'new'}-template1`}
                    onSubmit={handleFormSubmit}
                    initialData={cvData}
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 px-6 pb-6 pt-6 border-t border-[#017A8C]/10 w-full">
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-[#FAF7F0] text-[#88B7C4] font-semibold rounded-lg border border-[#017A8C]/20 transition-all duration-300"
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
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveCV}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#015C6A] to-[#017A8C] hover:from-[#014550] hover:to-[#015C6A] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : activeCvId ? 'Update' : 'Save'}
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
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20 no-print overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-[#88B7C4] via-[#019baf] to-[#017A8C]" />
              <div className="p-6">
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
              <CVPaginatedPreview
                data={cvData}
                renderDisplay={
                isTemplate3 ? (d) => <CVDisplayTemplate3 data={d} /> :
                isTemplate2 ? (d) => <CVDisplayTemplate2 data={d} /> :
                undefined
              }
              />
              </div>
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
            }}
          >
            {isTemplate3 ? <CVDisplayTemplate3 data={cvData} /> : isTemplate2 ? <CVDisplayTemplate2 data={cvData} /> : <CVDisplay data={cvData} />}
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
          {isTemplate3 ? <CVDisplayTemplate3 data={cvData} /> : isTemplate2 ? <CVDisplayTemplate2 data={cvData} /> : <CVDisplay data={cvData} />}
        </div>
      </div>
    </div>
  );
}
