import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, ChevronRight, Home, FileText, FileSearch, CheckCircle2, Circle } from 'lucide-react';
import { Card } from 'primereact/card';
import { useCVContext } from '../context/CVContext';
import { getCompletionProgress } from '../utils/cvCompletion';
import LinkedInJobsCard from '../components/LinkedInJobsCard';

const REQUIRED_COMPLETION = 85;

export default function SuggestionJobsPage() {
  const navigate = useNavigate();
  const { cvData, atsResult } = useCVContext();

  const progress = getCompletionProgress(cvData);
  const cvReady = progress >= REQUIRED_COMPLETION;
  const atsReady = atsResult !== null;
  const unlocked = cvReady && atsReady;

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
          {/* Decorative blurs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 blur-2xl" />
          </div>

          {/* Top nav row */}
          <div className="container mx-auto px-6 pt-4 pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <motion.div whileHover={{ scale: 1.05 }} className="text-2xl font-bold text-white tracking-tight cursor-pointer" onClick={() => navigate('/home')}>
                Nuivo
              </motion.div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/ats')}
                className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-300">
                <ArrowLeft className="w-4 h-4" />
                Back to ATS Analyzer
              </motion.button>
            </div>
          </div>

          {/* Breadcrumb + Title */}
          <div className="container mx-auto px-6 pb-6 pt-1 relative z-10">
            <div className="flex items-center gap-1.5 text-white/60 text-sm mb-3">
              <Home className="w-3.5 h-3.5" />
              <button onClick={() => navigate('/home')} className="hover:text-white/90 transition-colors">Home</button>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white font-medium">Suggested Jobs</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white leading-tight">Suggested Jobs</h1>
                <p className="text-sm text-white/60">Job matches based on your CV and ATS analysis</p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {unlocked ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LinkedInJobsCard cvData={cvData} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white/70 backdrop-blur-md shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20">
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#017A8C]/10 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-[#017A8C]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#017A8C] mb-1">
                      Let's find your next role
                    </h3>
                    <p className="text-sm text-[#88B7C4]">
                      Start by completing your CV, then run an ATS analysis to see how it
                      scores. Once your CV is at least {REQUIRED_COMPLETION}% complete and
                      analyzed, we'll surface job openings matched to your profile.
                    </p>
                  </div>
                </div>

                {/* Progress checklist */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FAF7F0] border border-[#C6DEE4]/40">
                    {cvReady ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#88B7C4] shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#02343F]">
                        CV completion: {progress}%
                      </p>
                      <p className="text-xs text-[#88B7C4]">
                        {cvReady
                          ? 'Your CV is ready.'
                          : `Reach ${REQUIRED_COMPLETION}% to continue.`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FAF7F0] border border-[#C6DEE4]/40">
                    {atsReady ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#88B7C4] shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#02343F]">
                        ATS analysis: {atsReady ? 'Done' : 'Not yet run'}
                      </p>
                      <p className="text-xs text-[#88B7C4]">
                        {atsReady
                          ? 'Analysis complete.'
                          : 'Run an ATS analysis on your CV.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/cv-builder')}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#017A8C] to-[#019baf] hover:from-[#015C6A] hover:to-[#017A8C] text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <FileText className="w-4 h-4" />
                    Go to CV Builder
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/ats')}
                    className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-[#FAF7F0] text-[#017A8C] font-semibold py-2.5 px-6 rounded-lg border border-[#017A8C]/20 transition-all duration-300"
                  >
                    <FileSearch className="w-4 h-4" />
                    Run ATS Analysis
                  </motion.button>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
