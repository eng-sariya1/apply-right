import { useState } from 'react';
import { callGemini } from './useGemini';

export const useGeminiProfessionalBackground = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateDescription = async (professionalBackground: string): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      return await callGemini(
        [{ parts: [{ text: `Generate a comprehensive, realistic job description for a ${professionalBackground} role including key responsibilities, required skills, qualifications, and ATS keywords. Return only the job description text.` }] }],
        { temperature: 0.7, maxOutputTokens: 4000 },
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to generate description';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateDescription, isLoading, error };
};
