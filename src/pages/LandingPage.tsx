import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Sparkles, Download, Eye, Upload } from 'lucide-react';
import { useState } from 'react';
import UploadResumeModal from '../components/UploadResumeModal';
import { useCVContext } from '../context/CVContext';
import type { CVData } from '../types/cv.types';

export default function LandingPage() {
  const navigate = useNavigate();
  const { setCvData } = useCVContext();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleCreateResume = () => {
    navigate('/cv-builder');
  };

  const handleUploadSuccess = (cvData: CVData) => {
    setCvData(cvData);
    navigate('/cv-builder');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-[#017A8C]/10 via-transparent to-transparent blur-3xl rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-l from-[#017A8C]/10 via-transparent to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-t from-[#017A8C]/5 via-transparent to-transparent blur-3xl rounded-full" />
      </div>

      {/* Sticky Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="sticky top-0 z-50 backdrop-blur-lg bg-[#FAF7F0]/90 border-b border-[#017A8C]/20 shadow-sm"
      >
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="text-2xl font-bold text-[#017A8C] tracking-tight"
            >
              Nuivo
            </motion.div>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#home"
                className="text-[#017A8C] hover:text-[#015d6b] transition-colors duration-300 font-medium"
              >
                Home
              </a>
              <a
                href="#features"
                className="text-[#017A8C] hover:text-[#015d6b] transition-colors duration-300 font-medium"
              >
                Features
              </a>
              <a
                href="#contact"
                className="text-[#017A8C] hover:text-[#015d6b] transition-colors duration-300 font-medium"
              >
                Contact
              </a>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(1, 122, 140, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={handleCreateResume}
                className="px-6 py-2 bg-[#017A8C] hover:bg-[#015C6A] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                Create Resume
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-[#017A8C] hover:text-[#015d6b] transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <section id="home" className="relative pt-20 pb-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-[#F3F3F3] rounded-3xl shadow-md shadow-[#017A8C]/10 py-20 px-10 md:px-16 relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-[#017A8C]/5 before:to-transparent before:rounded-3xl before:-z-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Column - Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                className="space-y-6 z-10"
              >
                {/* Title */}
                <h1 className="text-6xl md:text-7xl font-extrabold leading-tight">
                  <span className="text-[#02343F]">This resume builder gets you </span>
                  <span className="text-[#017A8C]">promoted.</span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-[#88B7C4] leading-relaxed max-w-xl">
                  Create your professional CV with ease — optimized for ATS and designed to impress.
                </p>

                {/* Buttons - Large and Centered */}
                <div className="flex flex-col items-center gap-4 mt-8">
                  {/* Primary CTA Button */}
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: '#019baf',
                      boxShadow: '0 20px 40px rgba(1, 122, 140, 0.4)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    onClick={handleCreateResume}
                    className="flex items-center justify-center gap-3 bg-[#017A8C] text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-[#017A8C]/30 transition-all duration-200 hover:shadow-2xl"
                    data-cy="create-resume-button"
                  >
                    Create my resume
                  </motion.button>

                  <div className="flex items-center gap-3">
                    <div className="h-px w-16 bg-[#88B7C4]/30"></div>
                    <span className="text-sm text-[#88B7C4] font-medium">or</span>
                    <div className="h-px w-16 bg-[#88B7C4]/30"></div>
                  </div>

                  {/* Upload Button - Smaller */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center justify-center gap-2 bg-transparent border-2 border-[#017A8C] text-[#017A8C] px-6 py-2.5 rounded-lg font-semibold hover:bg-[#017A8C] hover:text-white transition-all duration-200"
                    data-cy="upload-resume-button"
                  >
                    <Upload className="w-4 h-4" />
                    Upload My Resume
                  </motion.button>
                </div>
              </motion.div>

              {/* Right Column - CV Preview Image */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                className="relative flex justify-center lg:justify-end"
              >
                <motion.div
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="bg-white p-4 md:p-6 rounded-2xl shadow-lg shadow-[#017A8C]/10 max-w-md lg:max-w-lg w-full lg:translate-x-8 relative z-10"
                >
                  <img
                    src="/images/typing-hero-19c17dfac3e22fdc206c80e7f4d80e2c2feaa5cc2ac34f29257ec4da6ec6c722.png"
                    alt="CV Builder Preview"
                    className="w-full h-auto rounded-lg"
                  />
                </motion.div>

                {/* Decorative element behind image */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#017A8C]/10 to-transparent rounded-2xl blur-2xl -z-10 scale-105" />
              </motion.div>
            </div>

            {/* Trust indicators / Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
              className="mt-16 pt-12 border-t border-[#017A8C]/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-[#017A8C]">ATS-Friendly</h3>
                  <p className="text-sm text-[#88B7C4]">Pass applicant tracking systems with ease</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-[#017A8C]">Professional</h3>
                  <p className="text-sm text-[#88B7C4]">Stand out with polished design</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-[#017A8C]">Easy to Use</h3>
                  <p className="text-sm text-[#88B7C4]">Build your resume in minutes</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#02343F] mb-4">
              Why Choose Nuivo?
            </h2>
            <p className="text-lg text-[#88B7C4] max-w-2xl mx-auto">
              Professional tools to build the perfect resume that gets you hired
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.2 } }}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-[#C6DEE4]/30 shadow-lg hover:shadow-xl hover:border-[#017A8C]/40 transition-all duration-200"
            >
              <div className="mb-6 w-14 h-14 bg-gradient-to-br from-[#017A8C] to-[#019baf] rounded-xl flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#02343F] mb-3">
                ATS Compatibility
              </h3>
              <p className="text-[#88B7C4] leading-relaxed">
                Optimized formats that pass Applicant Tracking Systems with ease,
                ensuring your resume reaches human eyes
              </p>
            </motion.div>

            {/* Feature Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.2 } }}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-[#C6DEE4]/30 shadow-lg hover:shadow-xl hover:border-[#017A8C]/40 transition-all duration-200"
            >
              <div className="mb-6 w-14 h-14 bg-gradient-to-br from-[#017A8C] to-[#019baf] rounded-xl flex items-center justify-center shadow-md">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#02343F] mb-3">
                AI-Powered Optimization
              </h3>
              <p className="text-[#88B7C4] leading-relaxed">
                Smart grammar fixes and layout optimization powered by AI to make
                your resume stand out professionally
              </p>
            </motion.div>

            {/* Feature Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.2 } }}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-[#C6DEE4]/30 shadow-lg hover:shadow-xl hover:border-[#017A8C]/40 transition-all duration-200"
            >
              <div className="mb-6 w-14 h-14 bg-gradient-to-br from-[#017A8C] to-[#019baf] rounded-xl flex items-center justify-center shadow-md">
                <Download className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#02343F] mb-3">
                Custom Themes & PDF Export
              </h3>
              <p className="text-[#88B7C4] leading-relaxed">
                Choose from professional themes and export as high-quality PDF
                ready to send to employers instantly
              </p>
            </motion.div>

            {/* Feature Card 4 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.2 } }}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-[#C6DEE4]/30 shadow-lg hover:shadow-xl hover:border-[#017A8C]/40 transition-all duration-200"
            >
              <div className="mb-6 w-14 h-14 bg-gradient-to-br from-[#017A8C] to-[#019baf] rounded-xl flex items-center justify-center shadow-md">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#02343F] mb-3">
                Real-time Preview
              </h3>
              <p className="text-[#88B7C4] leading-relaxed">
                See your changes instantly with live preview mode while editing
                your resume for perfect results
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-24 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#02343F] mb-6">
              Ready to Get Hired?
            </h2>
            <p className="text-lg text-[#88B7C4] mb-10">
              Join thousands of professionals who landed their dream jobs with Nuivo
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(1, 122, 140, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={handleCreateResume}
              className="px-10 py-4 bg-gradient-to-r from-[#017A8C] to-[#019baf] text-white font-semibold text-lg rounded-lg shadow-xl hover:shadow-2xl transition-all duration-200"
            >
              Get Started Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="relative border-t border-[#C6DEE4]/30 bg-[#F3F3F3]/70 backdrop-blur-sm py-12 px-6 mt-12">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-[#017A8C] mb-4">Nuivo</h3>
              <p className="text-[#88B7C4] mb-4 max-w-md">
                Build professional resumes that get you hired. Trusted by thousands of job seekers worldwide.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-[#017A8C] hover:text-[#015d6b] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-[#017A8C] hover:text-[#015d6b] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-[#017A8C] hover:text-[#015d6b] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-[#017A8C] mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="text-[#88B7C4] hover:text-[#017A8C] transition-colors">Home</a></li>
                <li><a href="#features" className="text-[#88B7C4] hover:text-[#017A8C] transition-colors">Features</a></li>
                <li><a href="#contact" className="text-[#88B7C4] hover:text-[#017A8C] transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-semibold text-[#017A8C] mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-[#88B7C4] hover:text-[#017A8C] transition-colors">Resume Tips</a></li>
                <li><a href="#" className="text-[#88B7C4] hover:text-[#017A8C] transition-colors">Career Advice</a></li>
                <li><a href="#" className="text-[#88B7C4] hover:text-[#017A8C] transition-colors">FAQs</a></li>
                <li><a href="#" className="text-[#88B7C4] hover:text-[#017A8C] transition-colors">Support</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright Bar */}
          <div className="pt-8 border-t border-[#C6DEE4]/30 text-center">
            <p className="text-[#88B7C4] text-sm">
              © 2025 Nuivo. All rights reserved. | <a href="#" className="hover:text-[#017A8C] transition-colors">Privacy Policy</a> | <a href="#" className="hover:text-[#017A8C] transition-colors">Terms of Service</a>
            </p>
          </div>
        </div>
      </footer>

      {/* Upload Resume Modal */}
      <UploadResumeModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}
