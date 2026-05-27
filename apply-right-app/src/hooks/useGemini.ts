import { useState } from 'react';
import axios from 'axios';
import { GEMINI_FUNCTION_URL } from '../utils/constants';

const GEMINI_URL = GEMINI_FUNCTION_URL;

export async function callGemini(contents: object[], generationConfig?: object): Promise<string> {
  const response = await axios.post(GEMINI_URL, { contents, generationConfig });
  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error('No response from Gemini');
  return text;
}

interface UseGeminiResult {
  improveText: (text: string) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

export const useGemini = (): UseGeminiResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const improveText = async (text: string): Promise<string> => {
    if (!text.trim()) {
      setError('Please provide text to improve');
      return text;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await callGemini(
        [{ parts: [{ text: `You are an expert technical resume writer.\nI will provide my CV or professional background below.\nYour task:\n• Write one single Abstract (Professional Summary) that is powerful, concise, and suitable for any software/IT-related job.\n• Keep it under 150–180 words, professional but natural.\n• Emphasize adaptability, teamwork, and a passion for innovation.\n• Include soft skills (problem-solving, creativity) and technical skills naturally.\n• Do not generate multiple options — just one final version that works for all contexts.\noriginal text: ${text}` }] }],
        { temperature: 0.7, maxOutputTokens: 500 },
      );
      return result;
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
