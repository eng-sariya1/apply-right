import { useState } from 'react';

interface UseGeminiProjectsResult {
  improveText: (text: string) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

export const useGeminiProjects = (): UseGeminiProjectsResult => {
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
                    text: `You are an expert technical resume writer specializing in personal project descriptions.
I will provide personal project information below.
Your task:
• Enhance the project description to be clear, professional, and technically impressive.
• Highlight the technologies, frameworks, and tools used.
• Emphasize the problem solved, features implemented, and technical challenges overcome.
• Include measurable outcomes if possible (users, performance improvements, scale).
• Keep it concise (2-4 bullet points or 100-150 words).
• Focus on technical depth, innovation, and practical application.
• Maintain a professional tone suitable for technical resumes.
• Do not generate multiple options — just one polished final version.
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
