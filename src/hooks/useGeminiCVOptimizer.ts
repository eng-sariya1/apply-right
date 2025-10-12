import { useState } from 'react';
import type { CVData } from '../types/cv.types';

interface UseGeminiCVOptimizerResult {
  optimizeCV: (cvData: CVData, jobDescription: string) => Promise<CVData>;
  isLoading: boolean;
  error: string | null;
}

export const useGeminiCVOptimizer = (): UseGeminiCVOptimizerResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const optimizeCV = async (cvData: CVData, jobDescription: string): Promise<CVData> => {
    if (!cvData || !jobDescription.trim()) {
      setError('Please provide both CV data and job description');
      throw new Error('Please provide both CV data and job description');
    }

    setIsLoading(true);
    setError(null);

    try {
      const cvText = JSON.stringify(cvData, null, 2);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
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
                    text: `You are a CV optimization expert. Your job is to optimize a candidate's CV to better match a job description while maintaining truthfulness and authenticity.

JOB DESCRIPTION:
${jobDescription}

CURRENT CV DATA:
${cvText}

Optimize the CV by:
1. Rewriting the abstract/summary to highlight relevant skills and experiences for this job
2. Rephrasing career experiences to emphasize achievements relevant to the job description
3. Reordering or adding relevant skills that match the job requirements (only add skills that can be reasonably inferred from existing experience)
4. Improving project descriptions to showcase relevant technical abilities
5. Using keywords from the job description naturally throughout the CV

IMPORTANT RULES:
- DO NOT fabricate experiences, skills, or qualifications that don't exist
- DO NOT change dates, company names, or factual information
- DO enhance descriptions to better showcase existing relevant experience
- DO use industry-standard terminology from the job description
- Keep the same JSON structure as the input

Return ONLY a valid JSON object with the EXACT same structure as the input CV data (no additional text or markdown):`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.8,
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

      const optimizedCV = parseGeminiResponse(responseText);
      return optimizedCV;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to optimize CV';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    optimizeCV,
    isLoading,
    error,
  };
};

function parseGeminiResponse(responseText: string): CVData {
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
    return parsed as CVData;
  } catch (error) {
    console.error('Failed to parse Gemini response:', error);
    console.error('Response text:', responseText);
    throw new Error('Failed to parse optimized CV. Please try again.');
  }
}
