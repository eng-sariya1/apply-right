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
                    text: `You are an expert technical resume writer specializing in career experience descriptions.
I will provide career/work experience information below.
Your task:
• Enhance the career description to be professional, impactful, and achievement-oriented.
• Use strong action verbs and quantify achievements where possible.
• Highlight technical skills, responsibilities, and measurable outcomes.
• Keep it concise (2-4 bullet points or 100-150 words).
• Focus on impact, technologies used, and problem-solving abilities.
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
