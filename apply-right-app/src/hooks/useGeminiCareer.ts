import { useState } from 'react';
import { callGemini } from './useGemini';

export const useGeminiCareer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const improveText = async (text: string): Promise<string> => {
    if (!text.trim()) return text;
    setIsLoading(true);
    setError(null);
    try {
      return await callGemini(
        [{ parts: [{ text: `You are an expert CV writer. Rewrite this career description as a polished, professional 2-3 line summary for a CV. Return only the final text.\noriginal: ${text}` }] }],
        { temperature: 0.7, maxOutputTokens: 500 },
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to improve text';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return { improveText, isLoading, error };
};
