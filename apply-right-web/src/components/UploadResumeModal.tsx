import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, Loader2, AlertCircle } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { useGeminiCVParser } from '../hooks/useGeminiCVParser';
import type { CVData } from '../types/cv.types';

// Set up PDF.js worker - use local worker file from public folder
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface UploadResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (cvData: CVData) => void;
}

export default function UploadResumeModal({ isOpen, onClose, onSuccess }: UploadResumeModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { parseCV } = useGeminiCVParser();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    setError(null);
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension !== 'pdf' && fileExtension !== 'docx') {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      setProgress(`Reading PDF page ${i} of ${pdf.numPages}...`);
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => (item as { str: string }).str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  };

  const extractTextFromDOCX = async (file: File): Promise<string> => {
    setProgress('Reading DOCX file...');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);
    setProgress('Starting...');

    try {
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      let extractedText = '';

      if (fileExtension === 'pdf') {
        extractedText = await extractTextFromPDF(selectedFile);
      } else if (fileExtension === 'docx') {
        extractedText = await extractTextFromDOCX(selectedFile);
      }

      if (!extractedText.trim()) {
        throw new Error('Could not extract text from the file. Please ensure the file contains readable text.');
      }

      setProgress('Analyzing resume with AI...');
      const cvData = await parseCV(extractedText);

      setProgress('Success!');
      onSuccess(cvData);
      handleClose();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process resume. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress('');
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setError(null);
    setProgress('');
    setIsProcessing(false);
    onClose();
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-[var(--color-surface-solid)] rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#017A8C] to-[#019baf] px-4 sm:px-6 py-4 sm:py-5 text-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Upload Your Resume</h2>
                <p className="text-sm text-white/90">PDF or DOCX format, up to 10MB</p>
              </div>
              <button
                onClick={handleClose}
                disabled={isProcessing}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}

            {/* Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all duration-300
                ${isDragging ? 'border-[#017A8C] bg-[#017A8C]/5 scale-[1.02]' : 'border-gray-300 hover:border-[#017A8C]/50'}
                ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileInputChange}
                disabled={isProcessing}
                className="hidden"
              />

              {!selectedFile ? (
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-[#017A8C]/10 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-[#017A8C]" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-700 mb-1">
                      Drop your resume here
                    </p>
                    <p className="text-sm text-gray-500 mb-4">or</p>
                    <button
                      onClick={handleBrowseClick}
                      disabled={isProcessing}
                      className="px-6 py-2.5 bg-[#017A8C] hover:bg-[#015C6A] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 min-h-[44px]"
                    >
                      Browse Files
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">Supports PDF and DOCX files</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-[#017A8C]/10 rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-[#017A8C]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  {!isProcessing && (
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-sm text-[#017A8C] hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}

              {/* Processing State */}
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-[var(--color-surface-90)] backdrop-blur-sm rounded-xl flex flex-col items-center justify-center"
                >
                  <Loader2 className="w-10 h-10 text-[#017A8C] animate-spin mb-3" />
                  <p className="text-sm font-medium text-gray-700">{progress}</p>
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 flex-shrink-0">
              <button
                onClick={handleClose}
                disabled={isProcessing}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || isProcessing}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#017A8C] to-[#019baf] hover:from-[#015C6A] hover:to-[#017A8C] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                {isProcessing ? 'Processing...' : 'Upload & Continue'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
