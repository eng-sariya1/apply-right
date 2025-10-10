import { useState } from 'react';

interface UseGeminiEducationResult {
  improveText: (text: string) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

export const useGeminiEducation = (): UseGeminiEducationResult => {
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
                    text: `You are an expert AI assistant specialized in writing professional CV content.
I will provide education information such as degree, field of study, university, and grade.
Rewrite it as a single, polished, and professional sentence that fits perfectly in a CV.
Do not give multiple options — only the best possible version.
Keep it formal, clear, and grammatically perfect.
                    original text: ${text}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
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
      const improvedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!improvedText) {
        throw new Error('No response received from Gemini');
      }

      return improvedText;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to improve text';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    improveText,
    isLoading,
    error,
  };
};
