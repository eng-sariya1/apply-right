import { useState } from 'react';
import { callGemini } from './useGemini';
import type { CVData } from '../types/cv.types';

interface UseGeminiCVParserResult {
  parseCV: (input: string | { base64: string; mimeType: string }) => Promise<CVData>;
  isLoading: boolean;
  error: string | null;
}

const PROMPT = `You are an AI CV/Resume parser. Extract structured information from the CV (text or PDF) and return it in JSON format.

Return ONLY a valid JSON object with this EXACT structure (no markdown, no code fences, no explanation):
{"header":{"fullName":"","specialization":"","email":"","phone":"","links":[{"name":"","url":""}]},"abstract":"","skills":[],"career":[{"startDate":"","endDate":null,"isPresent":false,"location":"","companyName":"","workSpecialization":"","jobType":"Full time","summarization":"","projects":[]}],"personalProjects":[{"title":"","description":"","technologies":"","keyFeatures":[]}],"education":"","sectionTitleColor":"017A8C"}

Rules:
- Extract ALL information present in the CV. Do not fabricate.
- jobType must be one of: "Full time" | "Part time" | "Contract" | "Freelance"
- isPresent is true only if the CV indicates current employment.
- Use empty string "" for missing string fields and [] for missing arrays.`;

export const useGeminiCVParser = (): UseGeminiCVParserResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseCV = async (input: string | { base64: string; mimeType: string }): Promise<CVData> => {
    setIsLoading(true);
    setError(null);
    try {
      const parts: any[] =
        typeof input === 'string'
          ? [{ text: `${PROMPT}\n\nCV TEXT:\n${input}` }]
          : [
              { inline_data: { mime_type: input.mimeType, data: input.base64 } },
              { text: PROMPT },
            ];

      const responseText = await callGemini([{ parts }], { temperature: 0.3, maxOutputTokens: 8000 });
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
