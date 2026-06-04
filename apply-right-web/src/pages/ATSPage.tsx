import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileSearch, TrendingUp, Sparkles, Lightbulb, Home, ChevronRight, Briefcase, FileText } from 'lucide-react';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Checkbox } from 'primereact/checkbox';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useCVContext } from '../context/CVContext';
import { useToast } from '../context/ToastContext';
import { useGeminiATSAnalysis } from '../hooks/useGeminiATSAnalysis';
import { useGeminiCVOptimizer } from '../hooks/useGeminiCVOptimizer';
import { useGeminiProfessionalBackground } from '../hooks/useGeminiProfessionalBackground';
import type { OptimizationSuggestion, CVOptimizationResult } from '../types/cv.types';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ATSPage() {
  const navigate = useNavigate();
  const { cvData, setCvData, atsResult: analysisResult, setAtsResult: setAnalysisResult } = useCVContext();
  const { showToast } = useToast();
  const { analyzeCV, isLoading, error } = useGeminiATSAnalysis();
  const { generateSuggestions, applySuggestions, isLoading: isOptimizing, error: optimizeError } = useGeminiCVOptimizer();
  const { generateDescription, isLoading: isGenerating } = useGeminiProfessionalBackground();
  const [mode, setMode] = useState<'job-description' | 'professional-background'>('job-description');
  const [jobDescription, setJobDescription] = useState('');
  const [professionalBackground, setCareerField] = useState('');
  const [activeJobDescription, setActiveJobDescription] = useState('');
  const [optimizationResult, setOptimizationResult] = useState<CVOptimizationResult | null>(null);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [prevCvSnapshot, setPrevCvSnapshot] = useState<typeof cvData | null>(null);
  const [prevScore, setPrevScore] = useState<number | null>(null);

  const handleModeSwitch = (newMode: 'job-description' | 'professional-background') => {
    setMode(newMode);
    setAnalysisResult(null);
    setOptimizationResult(null);
    setSuggestions([]);
    setActiveJobDescription('');
    setPrevCvSnapshot(null);
    setPrevScore(null);
  };

  const handleAnalyze = async () => {
    let descriptionToUse = '';

    if (mode === 'job-description') {
      if (!jobDescription.trim()) return;
      descriptionToUse = jobDescription;
    } else {
      if (!professionalBackground.trim()) return;
      descriptionToUse = await generateDescription(professionalBackground);
    }

    setActiveJobDescription(descriptionToUse);

    try {
      const result = await analyzeCV(cvData, descriptionToUse);
      setAnalysisResult(result);
      setOptimizationResult(null);
      setSuggestions([]);
      setPrevCvSnapshot(null);
      setPrevScore(null);
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  const handleOptimizeCV = async () => {
    if (!analysisResult || !activeJobDescription.trim()) {
      return;
    }

    try {
      // Generate optimization suggestions
      const result = await generateSuggestions(cvData, activeJobDescription);
      setOptimizationResult(result);
      setSuggestions(result.suggestions);
    } catch (err) {
      console.error('Optimization failed:', err);
    }
  };

  const handleToggleSuggestion = (id: string) => {
    setSuggestions(prev =>
      prev.map(s => (s.id === id ? { ...s, approved: !s.approved } : s))
    );
  };

  const handleSelectAll = () => {
    setSuggestions(prev => prev.map(s => ({ ...s, approved: true })));
  };

  const handleDeselectAll = () => {
    setSuggestions(prev => prev.map(s => ({ ...s, approved: false })));
  };

  const handleApplyOptimization = async () => {
    try {
      const snapshotBefore = JSON.parse(JSON.stringify(cvData));
      const scoreBefore = analysisResult!.matchPercentage;

      const optimizedCV = applySuggestions(cvData, suggestions);
      setCvData(optimizedCV);

      const newAnalysis = await analyzeCV(optimizedCV, activeJobDescription);
      setAnalysisResult(newAnalysis);

      setOptimizationResult(null);
      setSuggestions([]);

      if (newAnalysis.matchPercentage < scoreBefore) {
        setPrevCvSnapshot(snapshotBefore);
        setPrevScore(scoreBefore);
        showToast('warn', 'Score Changed', `Score changed from ${scoreBefore}% to ${newAnalysis.matchPercentage}%. AI scoring can vary — your improvements are saved. You can undo below.`);
      } else {
        setPrevCvSnapshot(null);
        setPrevScore(null);
        showToast('success', 'CV Optimized', `Score improved from ${scoreBefore}% to ${newAnalysis.matchPercentage}%!`);
      }
    } catch (err) {
      console.error('Failed to apply optimizations:', err);
      showToast('error', 'Optimization Failed', 'Failed to apply optimizations. Please try again.');
    }
  };

  const handleUndoOptimization = () => {
    if (prevCvSnapshot && prevScore !== null && analysisResult) {
      setCvData(prevCvSnapshot);
      setAnalysisResult({ ...analysisResult, matchPercentage: prevScore });
      setPrevCvSnapshot(null);
      setPrevScore(null);
      showToast('info', 'Reverted', 'CV restored to pre-optimization state.');
    }
  };

  // Chart data for match percentage (Doughnut)
  const matchChartData = useMemo(() => ({
    labels: ['Match', 'Gap'],
    datasets: [
      {
        data: [
          analysisResult?.matchPercentage || 0,
          100 - (analysisResult?.matchPercentage || 0),
        ],
        backgroundColor: ['#017A8C', '#E5E7EB'],
        borderColor: ['#017A8C', '#E5E7EB'],
        borderWidth: 2,
      },
    ],
  }), [analysisResult]);

  // Chart data for keyword analysis (Bar)
  const keywordChartData = useMemo(() => ({
    labels: ['Matched Keywords', 'Missing Keywords'],
    datasets: [
      {
        label: 'Count',
        data: [
          analysisResult?.keywordMatches.matched.length || 0,
          analysisResult?.keywordMatches.missing.length || 0,
        ],
        backgroundColor: ['#017A8C', '#88B7C4'],
        borderColor: ['#017A8C', '#88B7C4'],
        borderWidth: 2,
      },
    ],
  }), [analysisResult]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] relative overflow-hidden">
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
        className="relative lg:sticky lg:top-0 z-50"
      >
        <div className="bg-gradient-to-r from-[#015C6A] via-[#017A8C] to-[#019baf] rounded-b-[2rem] shadow-lg shadow-[#017A8C]/20 relative overflow-hidden">
          {/* Decorative blurs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 blur-2xl" />
          </div>

          {/* Top nav row */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-10 pt-4 pb-2 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <motion.div whileHover={{ scale: 1.05 }} className="hidden lg:block text-2xl font-bold text-white tracking-tight cursor-pointer" onClick={() => navigate('/')}>
                Nuivo
              </motion.div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/cv-builder')}
                className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-300">
                <ArrowLeft className="w-4 h-4" />
                Back to CV Builder
              </motion.button>
            </div>
          </div>

          {/* Breadcrumb + Title */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-10 pb-6 pt-1 relative z-10">
            <div className="flex flex-wrap items-center gap-1.5 text-white/60 text-xs sm:text-sm mb-3">
              <Home className="w-3.5 h-3.5" />
              <button onClick={() => navigate('/')} className="hover:text-white/90 transition-colors">Home</button>
              <ChevronRight className="w-3.5 h-3.5" />
              <button onClick={() => navigate('/cv-builder')} className="hover:text-white/90 transition-colors">Resume Builder</button>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white font-medium">ATS Analyzer</span>
            </div>

            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 flex-shrink-0">
                <FileSearch className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">ATS Analyzer</h1>
                <p className="text-xs sm:text-sm text-white/60">Analyze how well your resume matches a job description</p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Job Description Input */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-[var(--color-surface)] backdrop-blur-md shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20">
              {/* Mode Tabs */}
              <div className="flex gap-1 p-1 bg-[var(--color-bg)] rounded-xl mb-5 border border-[var(--color-border)]/40">
                {[
                  { id: 'job-description', label: 'Job Description', icon: FileText },
                  { id: 'professional-background', label: 'Professional Background', icon: Briefcase },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleModeSwitch(id as 'job-description' | 'professional-background')}
                    className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      mode === id
                        ? 'bg-[#017A8C] text-white shadow-md'
                        : 'text-[var(--color-text-light)] hover:text-[#017A8C]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sm:hidden">{label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#017A8C] mb-1">
                    {mode === 'job-description' ? 'Job Description' : 'Professional Background'}
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--color-text-light)]">
                    {mode === 'job-description'
                      ? 'Paste the job description below to analyze how well your CV matches'
                      : 'Enter a professional background to generate keywords and analyze your CV alignment'}
                  </p>
                </div>
                <Button
                  label={isLoading || isGenerating ? 'Analyzing...' : 'Analyze CV'}
                  icon="pi pi-chart-line"
                  onClick={handleAnalyze}
                  disabled={
                    mode === 'job-description'
                      ? (!jobDescription.trim() || isLoading)
                      : (!professionalBackground.trim() || isLoading || isGenerating)
                  }
                  loading={isLoading || isGenerating}
                  className="w-full sm:w-auto shrink-0 whitespace-nowrap bg-gradient-to-r from-[#017A8C] to-[#019baf] hover:from-[#015C6A] hover:to-[#017A8C] text-white font-semibold py-2.5 px-4 sm:px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm"
                  data-cy="analyze-cv-button"
                />
              </div>

              {mode === 'job-description' ? (
                <InputTextarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={15}
                  className="w-full p-3 border border-[#017A8C]/20 rounded-lg focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/20 transition-all"
                  placeholder="Paste the job description here..."
                  data-cy="job-description-input"
                />
              ) : (
                <div className="flex flex-col gap-3">
                  <InputTextarea
                    value={professionalBackground}
                    onChange={(e) => setCareerField(e.target.value)}
                    rows={15}
                    placeholder="e.g. Software Engineer, Digital Marketing Specialist, Financial Analyst..."
                    className="w-full p-3 border border-[#017A8C]/20 rounded-lg focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/20 transition-all"
                    data-cy="professional-background-input"
                  />
                  {isGenerating && (
                    <motion.div className="flex items-center gap-2 text-sm text-[var(--color-text-light)] px-1">
                      <div className="w-4 h-4 border-2 border-[#017A8C] border-t-transparent rounded-full animate-spin" />
                      Generating job description for "{professionalBackground}"...
                    </motion.div>
                  )}
                </div>
              )}

              {analysisResult && !optimizationResult && (
                <Button
                  label={isOptimizing ? 'Generating Suggestions...' : 'Optimize CV for this Job'}
                  icon="pi pi-sparkles"
                  onClick={handleOptimizeCV}
                  disabled={isOptimizing || isLoading}
                  loading={isOptimizing}
                  className="whitespace-nowrap mt-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  data-cy="optimize-cv-button"
                />
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              {optimizeError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {optimizeError}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Right Column - Analysis Results / Suggestions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {optimizationResult && suggestions.length > 0 ? (
              <div className="space-y-6">
                {/* Suggestions Header */}
                <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-6 h-6" />
                        <h3 className="text-xl font-bold">Optimization Suggestions</h3>
                      </div>
                      <p className="text-purple-100 text-sm mb-2">
                        {optimizationResult.summary.totalSuggestions} improvements found
                        {' • '}
                        {suggestions.filter(s => s.approved).length} selected
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="px-2 py-1 bg-white/20 rounded text-xs">
                          {optimizationResult.summary.keywordSuggestions} Keywords
                        </span>
                        <span className="px-2 py-1 bg-white/20 rounded text-xs">
                          {optimizationResult.summary.phrasingSuggestions} Phrasing
                        </span>
                        <span className="px-2 py-1 bg-white/20 rounded text-xs">
                          {optimizationResult.summary.skillSuggestions} Skills
                        </span>
                        <span className="px-2 py-1 bg-white/20 rounded text-xs">
                          {optimizationResult.summary.highConfidenceCount} High Confidence
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-col sm:flex-row w-full sm:w-auto">
                      <Button
                        label="Select All"
                        size="small"
                        onClick={handleSelectAll}
                        className="bg-white/20 hover:bg-white/30 text-white border-white/40 w-full sm:w-auto"
                        data-cy="select-all-button"
                      />
                      <Button
                        label="Deselect All"
                        size="small"
                        onClick={handleDeselectAll}
                        className="bg-white/20 hover:bg-white/30 text-white border-white/40 w-full sm:w-auto"
                        data-cy="deselect-all-button"
                      />
                    </div>
                  </div>
                </Card>

                {/* Suggestions List */}
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {suggestions.map((suggestion) => (
                    <Card
                      key={suggestion.id}
                      className={`bg-[var(--color-surface)] backdrop-blur-md shadow-md border-2 transition-all ${
                        suggestion.approved
                          ? 'border-purple-400 bg-purple-50/50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="pt-1">
                          <Checkbox
                            checked={suggestion.approved || false}
                            onChange={() => handleToggleSuggestion(suggestion.id)}
                            className="w-5 h-5"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-gray-800">{suggestion.title}</h4>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                suggestion.type === 'keyword' ? 'bg-blue-100 text-blue-700' :
                                suggestion.type === 'skill' ? 'bg-green-100 text-green-700' :
                                suggestion.type === 'phrasing' ? 'bg-orange-100 text-orange-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                                {suggestion.type}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                suggestion.confidence === 'high' ? 'bg-green-100 text-green-700' :
                                suggestion.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {suggestion.confidence} confidence
                              </span>
                            </div>
                          </div>

                          <div className="text-xs text-gray-500 mb-2">
                            Section: {suggestion.section}
                          </div>

                          {suggestion.original && (
                            <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                              <div className="text-xs font-semibold text-red-600 mb-1">Current:</div>
                              <div className="text-gray-700 line-through">{suggestion.original}</div>
                            </div>
                          )}

                          <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                            <div className="text-xs font-semibold text-green-600 mb-1">Suggested:</div>
                            <div className="text-gray-700">{suggestion.suggested}</div>
                          </div>

                          <div className="flex items-start gap-2 text-xs text-gray-600 bg-blue-50 p-2 rounded">
                            <Lightbulb className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            <span>{suggestion.reason}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Apply Button */}
                <Card className="bg-[var(--color-surface)] backdrop-blur-md shadow-lg border border-purple-200 sticky bottom-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-sm sm:text-base font-semibold text-gray-800">
                        {suggestions.filter(s => s.approved).length} of {suggestions.length} changes selected
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        High confidence suggestions are pre-selected
                      </p>
                    </div>
                    <Button
                      label="Apply Changes"
                      icon="pi pi-check"
                      onClick={handleApplyOptimization}
                      disabled={suggestions.filter(s => s.approved).length === 0}
                      className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-6 py-2.5 rounded-lg shadow-lg transition-all duration-300"
                      data-cy="apply-changes-button"
                    />
                  </div>
                </Card>
              </div>
            ) : analysisResult ? (
              <div className="space-y-6">
                {/* Match Percentage Card */}
                <Card className="bg-[var(--color-surface)] backdrop-blur-md shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-5 sm:w-6 h-5 sm:h-6 text-[#017A8C]" />
                    <h3 className="text-base sm:text-lg font-bold text-[#017A8C]">Match Score</h3>
                  </div>

                  <div className="flex items-center justify-center mb-4">
                    <div className="text-4xl sm:text-5xl font-bold text-[#017A8C]">
                      {analysisResult.matchPercentage}%
                    </div>
                  </div>

                  <ProgressBar
                    value={analysisResult.matchPercentage}
                    className="mb-4"
                    color="#017A8C"
                  />

                  <div className="h-64 flex items-center justify-center">
                    <Doughnut data={matchChartData} options={chartOptions} />
                  </div>
                </Card>

                {/* Undo optimization button */}
                {prevCvSnapshot && prevScore !== null && (
                  <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div>
                      <p className="text-sm font-semibold text-orange-700">Score changed after optimization</p>
                      <p className="text-xs text-orange-600">Previous score: {prevScore}% → Current: {analysisResult?.matchPercentage}%</p>
                    </div>
                    <Button
                      label="Undo"
                      icon="pi pi-undo"
                      size="small"
                      onClick={handleUndoOptimization}
                      className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                    />
                  </div>
                )}

                {/* Keyword Analysis Chart */}
                <Card className="bg-[var(--color-surface)] backdrop-blur-md shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20">
                  <h3 className="text-base sm:text-lg font-bold text-[#017A8C] mb-4">Keyword Analysis</h3>
                  <div className="h-64">
                    <Bar data={keywordChartData} options={chartOptions} />
                  </div>
                </Card>

                {/* Strengths */}
                {analysisResult.strengths.length > 0 && (
                  <Card className="bg-[var(--color-surface)] backdrop-blur-md shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20">
                    <h3 className="text-base sm:text-lg font-bold text-green-600 mb-3">Strengths</h3>
                    <ul className="space-y-2">
                      {analysisResult.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-green-500">✓</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {/* Weaknesses */}
                {analysisResult.weaknesses.length > 0 && (
                  <Card className="bg-[var(--color-surface)] backdrop-blur-md shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20">
                    <h3 className="text-base sm:text-lg font-bold text-orange-600 mb-3">Areas for Improvement</h3>
                    <ul className="space-y-2">
                      {analysisResult.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-orange-500">!</span>
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {/* Recommendations */}
                {analysisResult.recommendations.length > 0 && (
                  <Card className="bg-[var(--color-surface)] backdrop-blur-md shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20">
                    <h3 className="text-base sm:text-lg font-bold text-[#017A8C] mb-3">Recommendations</h3>
                    <ul className="space-y-2">
                      {analysisResult.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-[#017A8C]">→</span>
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {/* Matched Keywords */}
                {analysisResult.keywordMatches.matched.length > 0 && (
                  <Card className="bg-[var(--color-surface)] backdrop-blur-md shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20">
                    <h3 className="text-base sm:text-lg font-bold text-green-600 mb-3">Matched Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.keywordMatches.matched.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Missing Keywords */}
                {analysisResult.keywordMatches.missing.length > 0 && (
                  <Card className="bg-[var(--color-surface)] backdrop-blur-md shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20">
                    <h3 className="text-base sm:text-lg font-bold text-orange-600 mb-3">Missing Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.keywordMatches.missing.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="bg-[var(--color-surface)] backdrop-blur-md shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20 h-full flex items-center justify-center">
                <div className="text-center py-12">
                  <FileSearch className="w-16 h-16 text-[var(--color-text-light)] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[#017A8C] mb-2">No Analysis Yet</h3>
                  <p className="text-[var(--color-text-light)]">
                    {mode === 'job-description'
                      ? 'Paste a job description and click "Analyze CV" to see results'
                      : 'Enter a Professional Background and click "Analyze CV" to see results'}
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div> );
}
