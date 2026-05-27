import { useState } from 'react';
import { callGemini } from './useGemini';
import type { CVData } from '../types/cv.types';

interface UseGeminiCVParserResult {
  parseCV: (extractedText: string) => Promise<CVData>;
  isLoading: boolean;
  error: string | null;
}

export const useGeminiCVParser = (): UseGeminiCVParserResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseCV = async (extractedText: string): Promise<CVData> => {
    if (!extractedText.trim()) {
      setError('No text provided to parse');
      throw new Error('No text provided to parse');
    }
    setIsLoading(true);
    setError(null);
    try {
      const responseText = await callGemini(
        [{ parts: [{ text: `You are an AI CV/Resume parser. Extract structured information from CV text and return it in JSON format.\n\nCV TEXT:\n${extractedText}\n\nReturn ONLY a valid JSON object with this EXACT structure (no markdown):\n{"header":{"fullName":"","specialization":"","email":"","phone":"","links":[{"name":"","url":""}]},"abstract":"","skills":[],"career":[{"startDate":"","endDate":null,"isPresent":false,"location":"","companyName":"","workSpecialization":"","jobType":"Full time","summarization":"","projects":[]}],"personalProjects":[{"title":"","description":"","technologies":"","keyFeatures":[]}],"education":"","sectionTitleColor":"017A8C"}` }] }],
        { temperature: 0.3, maxOutputTokens: 8000 },
      );
      return parseGeminiResponse(responseText);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to parse CV';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { parseCV, isLoading, error };
};

function parseGeminiResponse(responseText: string): CVData {
  let cleanedText = responseText.trim();
  if (cleanedText.startsWith('```json')) {
    cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/```\s*$/, '');
  } else if (cleanedText.startsWith('```')) {
    cleanedText = cleanedText.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }
  const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
  if (jsonMatch) cleanedText = jsonMatch[0];
  const parsed = JSON.parse(cleanedText);
  if (!parsed.header) throw new Error('Invalid CV data structure');
  return {
    header: {
      fullName: parsed.header.fullName || '',
      specialization: parsed.header.specialization || '',
      email: parsed.header.email || '',
      phone: parsed.header.phone || '',
      links: Array.isArray(parsed.header.links) ? parsed.header.links : [],
    },
    abstract: parsed.abstract || '',
    skills: Array.isArray(parsed.skills) ? parsed.skills : [],
    career: Array.isArray(parsed.career) ? parsed.career : [],
    personalProjects: Array.isArray(parsed.personalProjects) ? parsed.personalProjects : [],
    education: parsed.education || '',
    sectionTitleColor: parsed.sectionTitleColor || '017A8C',
  };
}
