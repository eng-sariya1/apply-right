import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FilePlus, PlayCircle, FileSearch, Clock, Edit2, Trash2, FileText, LayoutGrid } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useCVContext } from '../context/CVContext';
import type { CVData } from '../types/cv.types';

interface SavedCV extends CVData {
  id: string;
  savedAt: string;
}

const TEMPLATE_META: Record<string, { label: string; color: string }> = {
  template1: { label: 'Classic', color: 'bg-[#017A8C]' },
  template2: { label: 'Professional', color: 'bg-blue-600' },
  template3: { label: 'Modern', color: 'bg-purple-600' },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function HomePage() {
  const navigate = useNavigate();
  const { setCvData } = useCVContext();
  const [savedCvs, setSavedCvs] = useState<SavedCV[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        setLoading(false);
        return;
      }
      setUserName(user.displayName || user.email?.split('@')[0] || 'there');
      fetchCVs(user.uid);
    });
    return () => unsubscribe();
  }, []);

  const fetchCVs = async (uid: string) => {
    try {
      const docSnap = await getDoc(doc(db, 'cvs', uid));
      if (docSnap.exists()) {
        const list: SavedCV[] = docSnap.data().cvList || [];
        // Sort newest first
        list.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
        setSavedCvs(list);
      }
    } catch (err) {
      console.error('Error fetching CVs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cv: SavedCV) => {
    const { id, savedAt, ...cvDataWithoutMeta } = cv;
    setCvData(cvDataWithoutMeta);
    navigate('/cv-builder');
  };

  const handleContinueLast = () => {
    if (savedCvs.length === 0) return;
    handleEdit(savedCvs[0]);
  };

  const handleDelete = async (cvId: string) => {
    const user = auth.currentUser;
    if (!user || !confirm('Are you sure you want to delete this CV?')) return;
    setDeletingId(cvId);
    try {
      const updated = savedCvs.filter((cv) => cv.id !== cvId);
      await setDoc(doc(db, 'cvs', user.uid), { cvList: updated });
      setSavedCvs(updated);
    } catch (err) {
      console.error('Error deleting CV:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const recentCvs = savedCvs.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#FAF7F0] relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-r from-[#017A8C]/10 via-transparent to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-gradient-to-l from-[#017A8C]/10 via-transparent to-transparent blur-3xl rounded-full" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="sticky top-0 z-50"
      >
        <div className="bg-gradient-to-r from-[#015C6A] via-[#017A8C] to-[#019baf] rounded-b-[2rem] shadow-lg shadow-[#017A8C]/20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 blur-2xl" />
          </div>

          <div className="container mx-auto px-6 pt-4 pb-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold text-white tracking-tight cursor-pointer"
                onClick={() => navigate('/')}
              >
                Nuivo
              </motion.div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <LayoutGrid className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white leading-tight">
                  Welcome back, {userName}
                </h1>
                <p className="text-sm text-white/60">Here's your workspace</p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 space-y-8">

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-lg font-bold text-[#02343F] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Create New CV */}
            <motion.button
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/templates')}
              className="flex flex-col items-center gap-3 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-[#C6DEE4]/40 shadow-md hover:shadow-lg hover:border-[#017A8C]/40 transition-all duration-200 text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#017A8C] to-[#019baf] rounded-xl flex items-center justify-center shadow-md">
                <FilePlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-[#02343F]">Create New CV</p>
                <p className="text-xs text-[#88B7C4] mt-0.5">Choose a template and start fresh</p>
              </div>
            </motion.button>

            {/* Continue Last CV */}
            <motion.button
              whileHover={savedCvs.length > 0 ? { y: -5, scale: 1.02 } : {}}
              whileTap={savedCvs.length > 0 ? { scale: 0.98 } : {}}
              onClick={handleContinueLast}
              disabled={savedCvs.length === 0}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl border shadow-md text-center transition-all duration-200 ${
                savedCvs.length > 0
                  ? 'bg-white/80 backdrop-blur-sm border-[#C6DEE4]/40 hover:shadow-lg hover:border-[#017A8C]/40 cursor-pointer'
                  : 'bg-white/40 border-[#C6DEE4]/20 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#017A8C] to-[#019baf] rounded-xl flex items-center justify-center shadow-md">
                <PlayCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-[#02343F]">Continue Last CV</p>
                <p className="text-xs text-[#88B7C4] mt-0.5">
                  {savedCvs.length > 0
                    ? `Resume "${savedCvs[0].header.fullName || 'Untitled'}"`
                    : 'No CVs saved yet'}
                </p>
              </div>
            </motion.button>

            {/* Analyze CV */}
            <motion.button
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/ats')}
              className="flex flex-col items-center gap-3 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-[#C6DEE4]/40 shadow-md hover:shadow-lg hover:border-[#017A8C]/40 transition-all duration-200 text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#017A8C] to-[#019baf] rounded-xl flex items-center justify-center shadow-md">
                <FileSearch className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-[#02343F]">Analyze CV</p>
                <p className="text-xs text-[#88B7C4] mt-0.5">Check your ATS match score</p>
              </div>
            </motion.button>
          </div>
        </motion.section>

        {/* Recent CVs */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <h2 className="text-lg font-bold text-[#02343F] mb-4">Recent CVs</h2>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#C6DEE4]/40 shadow-md overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-[#017A8C] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : recentCvs.length === 0 ? (
              <div className="text-center py-12 px-6">
                <FileText className="w-12 h-12 text-[#C6DEE4] mx-auto mb-3" />
                <p className="font-semibold text-[#02343F]">No CVs yet</p>
                <p className="text-sm text-[#88B7C4] mt-1">Create your first CV to get started</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/templates')}
                  className="mt-4 px-5 py-2 bg-gradient-to-r from-[#017A8C] to-[#019baf] text-white text-sm font-semibold rounded-lg shadow hover:shadow-md transition-all"
                >
                  Create New CV
                </motion.button>
              </div>
            ) : (
              <ul className="divide-y divide-[#C6DEE4]/30">
                {recentCvs.map((cv, i) => {
                  const meta = TEMPLATE_META[cv.templateId || 'template1'] ?? TEMPLATE_META.template1;
                  return (
                    <motion.li
                      key={cv.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-[#FAF7F0]/60 transition-colors"
                    >
                      {/* Icon */}
                      <div className="w-9 h-9 rounded-lg bg-[#017A8C]/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-[#017A8C]" />
                      </div>

                      {/* Name + meta */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#02343F] truncate">
                          {cv.header.fullName || 'Untitled CV'}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`px-2 py-0.5 rounded-full text-white text-xs font-medium ${meta.color}`}>
                            {meta.label}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-[#88B7C4]">
                            <Clock className="w-3 h-3" />
                            {formatDate(cv.savedAt)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(cv)}
                          className="p-2 rounded-lg text-[#017A8C] hover:bg-[#017A8C]/10 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(cv.id)}
                          disabled={deletingId === cv.id}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors disabled:opacity-40"
                          title="Delete"
                        >
                          {deletingId === cv.id ? (
                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </motion.button>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            )}
          </div>

          {savedCvs.length > 5 && (
            <p className="text-xs text-[#88B7C4] mt-2 text-center">
              Showing 5 of {savedCvs.length} CVs — open the CV Builder to see all
            </p>
          )}
        </motion.section>
      </div>
    </div>
  );
}
