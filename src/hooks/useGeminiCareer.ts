import { useState } from 'react';

interface UseGeminiCareerResult {
  improveText: (text: string) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

export const useGeminiCareer = (): UseGeminiCareerResult => {
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
                    text: `You are an expert AI assistant specialized in writing professional CV summaries and career descriptions.
I will provide you with a short or raw description of the user’s work field or experience (e.g., frontend developer, AI student, data analyst, etc.).
Your task is to rewrite it as a single, polished, and professional career summary, suitable for the CV header or “Work Summary” section.

Requirements:
 • Return only one single best version — no alternatives.
 • Keep it concise (2–3 lines maximum), formal, and natural.
 • Emphasize skills, expertise, and professional tone.
 • If needed, make the sentence flow better without changing the original meaning.
 • Do not include explanations or bullet points — just the final text.
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
