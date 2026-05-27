import { useState } from 'react';
import type { CVData } from '../types/cv.types';

interface ATSAnalysisResult {
  matchPercentage: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  keywordMatches: {
    matched: string[];
    missing: string[];
  };
}

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
      setError('Please provide both CV data and job description');
      throw new Error('Please provide both CV data and job description');
    }

    setIsLoading(true);
    setError(null);

    try {
      const cvText = formatCVDataForAnalysis(cvData);

      const response = await fetch(
        '/.netlify/functions/gemini',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an ATS (Applicant Tracking System) analyzer. Your job is to compare a candidate's CV with a job description and provide a detailed analysis.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE CV DATA:
${cvText}

Analyze how well the CV matches the job description and provide:
1. A match percentage (0-100) based on skills, experience, and qualifications alignment
2. List of strengths (what matches well)
3. List of weaknesses (what's missing or doesn't match)
4. Recommendations for improvement
5. Keyword analysis (matched keywords and missing important keywords from job description)

Return ONLY a valid JSON object with this exact structure (no additional text or markdown):
{
  "matchPercentage": number (0-100),
  "strengths": ["string", "string", ...],
  "weaknesses": ["string", "string", ...],
  "recommendations": ["string", "string", ...],
  "keywordMatches": {
    "matched": ["string", "string", ...],
    "missing": ["string", "string", ...]
  }
}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 8000,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || `API request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!responseText) {
        throw new Error('No response received from Gemini');
      }

      const analysisResult = parseGeminiResponse(responseText);
      return analysisResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze CV';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    analyzeCV,
    isLoading,
    error,
  };
};

function formatCVDataForAnalysis(cvData: CVData): string {
  return JSON.stringify(cvData, null, 2);
}

function parseGeminiResponse(responseText: string): ATSAnalysisResult {
  try {
    let cleanedText = responseText.trim();

    // Remove markdown code blocks if present
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/```\s*$/, '');
    }

    // Try to find JSON object in the response
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }

    const parsed = JSON.parse(cleanedText);
    return parsed as ATSAnalysisResult;
  } catch (error) {
    console.error('Failed to parse Gemini response:', error);
    console.error('Response text:', responseText);
    throw new Error('Failed to parse ATS analysis. Please try again.');
  }
}
