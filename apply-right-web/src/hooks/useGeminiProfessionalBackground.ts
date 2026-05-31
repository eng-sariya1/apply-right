import { useState } from 'react';

interface UseGeminiCareerFieldResult {
  generateDescription: (professionalBackground: string) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

export const useGeminiProfessionalBackground = (): UseGeminiCareerFieldResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateDescription = async (professionalBackground: string): Promise<string> => {
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
                    text: `You are an expert job description writer. Generate a comprehensive, realistic job description for a ${professionalBackground} role. Include: a role summary, 8-12 key responsibilities, required technical skills, soft skills, typical qualifications and experience requirements, and important ATS keywords for this field. Write it as a full job posting that an ATS system would parse. Return only the job description text, no extra commentary.`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 4000,
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

      return responseText;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate job description';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateDescription,
    isLoading,
    error,
  };
};
