import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileSearch, TrendingUp, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
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
import { useGeminiATSAnalysis } from '../hooks/useGeminiATSAnalysis';
import { useGeminiCVOptimizer } from '../hooks/useGeminiCVOptimizer';
import type { CVData } from '../types/cv.types';

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
  const { cvData, setCvData } = useCVContext();
  const { analyzeCV, isLoading, error } = useGeminiATSAnalysis();
  const { optimizeCV, isLoading: isOptimizing, error: optimizeError } = useGeminiCVOptimizer();
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<{
    matchPercentage: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    keywordMatches: {
      matched: string[];
      missing: string[];
    };
  } | null>(null);
  const [beforeAnalysis, setBeforeAnalysis] = useState<typeof analysisResult>(null);
  const [afterAnalysis, setAfterAnalysis] = useState<typeof analysisResult>(null);
  const [optimizedCV, setOptimizedCV] = useState<CVData | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      return;
    }

    try {
      const result = await analyzeCV(cvData, jobDescription);
      setAnalysisResult(result);
      // Reset comparison state when doing a fresh analysis
      setShowComparison(false);
      setBeforeAnalysis(null);
      setAfterAnalysis(null);
      setOptimizedCV(null);
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  const handleOptimizeCV = async () => {
    console.log('🚀 Optimize button clicked!');
    console.log('analysisResult:', analysisResult);
    console.log('jobDescription:', jobDescription);

    if (!analysisResult || !jobDescription.trim()) {
      console.error('❌ Missing required data');
      return;
    }

    try {
      console.log('📊 Storing before analysis...');
      // Store the current analysis as "before"
      setBeforeAnalysis(analysisResult);

      console.log('🔄 Calling optimizeCV...');
      // Optimize the CV
      const optimized = await optimizeCV(cvData, jobDescription);
      console.log('✅ CV optimized:', optimized);
      setOptimizedCV(optimized);

      console.log('🔍 Analyzing optimized CV...');
      // Analyze the optimized CV
      const afterResult = await analyzeCV(optimized, jobDescription);
      console.log('✅ After analysis:', afterResult);
      setAfterAnalysis(afterResult);

      console.log('🎉 Showing comparison view');
      // Show comparison view
      setShowComparison(true);
    } catch (err) {
      console.error('❌ Optimization failed:', err);
      console.error('Error details:', err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleApplyOptimization = () => {
    if (optimizedCV) {
      setCvData(optimizedCV);
      // Reset states and show success message
      setShowComparison(false);
      setAnalysisResult(afterAnalysis);
      setBeforeAnalysis(null);
      setAfterAnalysis(null);
      setOptimizedCV(null);
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
        className="sticky top-0 z-50 backdrop-blur-lg bg-white/90 border-b border-[#017A8C]/20 shadow-sm"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileSearch className="w-8 h-8 text-[#017A8C]" />
              <h1 className="text-2xl font-bold text-[#017A8C] tracking-tight">ATS Analyzer</h1>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/cv-builder')}
              className="flex items-center gap-2 px-4 py-2 bg-white/70 hover:bg-white text-[#017A8C] font-medium rounded-lg border border-[#017A8C]/20 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to CV Builder
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Job Description Input */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white/70 backdrop-blur-md shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20">
              <h2 className="text-xl font-bold text-[#017A8C] mb-4">Job Description</h2>
              <p className="text-sm text-[#88B7C4] mb-4">
                Paste the job description below to analyze how well your CV matches
              </p>

              <InputTextarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={15}
                className="w-full p-3 border border-[#017A8C]/20 rounded-lg focus:border-[#017A8C] focus:ring-2 focus:ring-[#017A8C]/20 transition-all"
                placeholder="Paste the job description here..."
              />

              <Button
                label={isLoading ? 'Analyzing...' : 'Analyze CV'}
                icon="pi pi-chart-line"
                onClick={handleAnalyze}
                disabled={!jobDescription.trim() || isLoading}
                loading={isLoading}
                className="w-full mt-4 bg-gradient-to-r from-[#017A8C] to-[#019baf] hover:from-[#015C6A] hover:to-[#017A8C] text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              />

              {analysisResult && !showComparison && (
                <Button
                  label={isOptimizing ? 'Optimizing...' : 'Optimize CV for this Job'}
                  icon="pi pi-sparkles"
                  onClick={handleOptimizeCV}
                  disabled={isOptimizing || isLoading}
                  loading={isOptimizing}
                  className="w-full mt-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
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

          {/* Right Column - Analysis Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {showComparison && beforeAnalysis && afterAnalysis ? (
              <div className="space-y-6">
                {/* Comparison Header */}
                <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-6 h-6" />
                        <h3 className="text-xl font-bold">CV Optimized!</h3>
                      </div>
                      <p className="text-purple-100 text-sm">
                        Your CV has been enhanced to better match the job description
                      </p>
                    </div>
                    <Button
                      label="Apply Changes"
                      icon="pi pi-check"
                      onClick={handleApplyOptimization}
                      className="bg-white text-purple-700 hover:bg-purple-50 font-semibold px-6 py-2 rounded-lg shadow-lg transition-all duration-300"
                    />
                  </div>
                </Card>

                {/* Before/After Score Comparison */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-white/70 backdrop-blur-md shadow-lg border border-orange-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Before</p>
                      <div className="text-4xl font-bold text-orange-600 mb-2">
                        {beforeAnalysis.matchPercentage}%
                      </div>
                      <ProgressBar value={beforeAnalysis.matchPercentage} className="h-2" color="#ea580c" />
                    </div>
                  </Card>
                  <Card className="bg-white/70 backdrop-blur-md shadow-lg border border-green-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">After</p>
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {afterAnalysis.matchPercentage}%
                      </div>
                      <ProgressBar value={afterAnalysis.matchPercentage} className="h-2" color="#16a34a" />
                    </div>
                  </Card>
                </div>

                {/* Improvement Indicator */}
                {afterAnalysis.matchPercentage > beforeAnalysis.matchPercentage && (
                  <Card className="bg-green-50 border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-800">
                          +{afterAnalysis.matchPercentage - beforeAnalysis.matchPercentage}% Improvement
                        </p>
                        <p className="text-sm text-green-700">
                          Your CV now has a stronger match with the job requirements
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* After Analysis - Full Details */}
                <Card className="bg-white/70 backdrop-blur-md shadow-lg border border-[#017A8C]/20">
                  <h3 className="text-lg font-bold text-[#017A8C] mb-4">Optimized CV Analysis</h3>

                  {/* Keyword Comparison */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-3">Keyword Matches</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Before</p>
                        <div className="text-2xl font-bold text-orange-600">
                          {beforeAnalysis.keywordMatches.matched.length}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">After</p>
                        <div className="text-2xl font-bold text-green-600">
                          {afterAnalysis.keywordMatches.matched.length}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* New Strengths */}
                  {afterAnalysis.strengths.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-green-600 mb-2">New Strengths</h4>
                      <ul className="space-y-2">
                        {afterAnalysis.strengths.slice(0, 5).map((strength, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-green-500">✓</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Remaining Recommendations */}
                  {afterAnalysis.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-[#017A8C] mb-2">Additional Tips</h4>
                      <ul className="space-y-2">
                        {afterAnalysis.recommendations.slice(0, 3).map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-[#017A8C]">→</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              </div>
            ) : analysisResult ? (
              <div className="space-y-6">
                {/* Match Percentage Card */}
                <Card className="bg-white/70 backdrop-blur-md shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-[#017A8C]" />
                    <h3 className="text-lg font-bold text-[#017A8C]">Match Score</h3>
                  </div>

                  <div className="flex items-center justify-center mb-4">
                    <div className="text-5xl font-bold text-[#017A8C]">
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

                {/* Keyword Analysis Chart */}
                <Card className="bg-white/70 backdrop-blur-md shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20">
                  <h3 className="text-lg font-bold text-[#017A8C] mb-4">Keyword Analysis</h3>
                  <div className="h-64">
                    <Bar data={keywordChartData} options={chartOptions} />
                  </div>
                </Card>

                {/* Strengths */}
                {analysisResult.strengths.length > 0 && (
                  <Card className="bg-white/70 backdrop-blur-md shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20">
                    <h3 className="text-lg font-bold text-green-600 mb-3">Strengths</h3>
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
                  <Card className="bg-white/70 backdrop-blur-md shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20">
                    <h3 className="text-lg font-bold text-orange-600 mb-3">Areas for Improvement</h3>
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
                  <Card className="bg-white/70 backdrop-blur-md shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20">
                    <h3 className="text-lg font-bold text-[#017A8C] mb-3">Recommendations</h3>
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
                  <Card className="bg-white/70 backdrop-blur-md shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20">
                    <h3 className="text-lg font-bold text-green-600 mb-3">Matched Keywords</h3>
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
                  <Card className="bg-white/70 backdrop-blur-md shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20">
                    <h3 className="text-lg font-bold text-orange-600 mb-3">Missing Keywords</h3>
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
              <Card className="bg-white/70 backdrop-blur-md shadow-lg shadow-[#017A8C]/10 border border-[#017A8C]/20 h-full flex items-center justify-center">
                <div className="text-center py-12">
                  <FileSearch className="w-16 h-16 text-[#88B7C4] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[#017A8C] mb-2">No Analysis Yet</h3>
                  <p className="text-[#88B7C4]">
                    Paste a job description and click "Analyze CV" to see results
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
