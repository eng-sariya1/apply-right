import { useState } from 'react';
import { callGemini } from './useGemini';
import type { CVData, ATSAnalysisResult } from '../types/cv.types';

interface UseGeminiATSAnalysisResult {
  analyzeCV: (cvData: CVData, jobDescription: string) => Promise<ATSAnalysisResult>;
  isLoading: boolean;
  error: string | null;
}

export const useGeminiATSAnalysis = (): UseGeminiATSAnalysisResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeCV = async (cvData: CVData, jobDescription: string): Promise<ATSAnalysisResult> => {
    if (!cvData || !jobDescription.trim()) {
      throw new Error('Please provide both CV data and job description');
    }
    setIsLoading(true);
    setError(null);
    try {
      const cvText = JSON.stringify(cvData, null, 2);
      const responseText = await callGemini(
        [{ parts: [{ text: `You are an ATS analyzer. Compare this CV with the job description and provide analysis.\n\nJOB DESCRIPTION:\n${jobDescription}\n\nCV DATA:\n${cvText}\n\nReturn ONLY valid JSON:\n{"matchPercentage":number,"strengths":[""],"weaknesses":[""],"recommendations":[""],"keywordMatches":{"matched":[""],"missing":[""]}}` }] }],
        { temperature: 0.7, maxOutputTokens: 8000 },
      );
      return parseResponse(responseText);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to analyze CV';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { analyzeCV, isLoading, error };
};

function parseResponse(responseText: string): ATSAnalysisResult {
  let text = responseText.trim();
  if (text.startsWith('```json')) text = text.replace(/^```json\s*/, '').replace(/```\s*$/, '');
  else if (text.startsWith('```')) text = text.replace(/^```\s*/, '').replace(/```\s*$/, '');
  const match = text.match(/\{[\s\S]*\}/);
  if (match) text = match[0];
  return JSON.parse(text) as ATSAnalysisResult;
}
