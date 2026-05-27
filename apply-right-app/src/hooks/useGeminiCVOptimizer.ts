import { useState } from 'react';
import { callGemini } from './useGemini';
import type { CVData, CVOptimizationResult, OptimizationSuggestion } from '../types/cv.types';

interface UseGeminiCVOptimizerResult {
  generateSuggestions: (cvData: CVData, jobDescription: string) => Promise<CVOptimizationResult>;
  applySuggestions: (cvData: CVData, suggestions: OptimizationSuggestion[]) => CVData;
  isLoading: boolean;
  error: string | null;
}

export const useGeminiCVOptimizer = (): UseGeminiCVOptimizerResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestions = async (cvData: CVData, jobDescription: string): Promise<CVOptimizationResult> => {
    if (!cvData || !jobDescription.trim()) {
      throw new Error('Please provide both CV data and job description');
    }
    setIsLoading(true);
    setError(null);
    try {
      const cvText = JSON.stringify(cvData, null, 2);
      const responseText = await callGemini(
        [{ parts: [{ text: `You are a CV optimization expert. Analyze this CV against the job description and provide specific optimization suggestions.\n\nJOB DESCRIPTION:\n${jobDescription}\n\nCV DATA:\n${cvText}\n\nReturn ONLY valid JSON:\n{"suggestions":[{"id":"unique-id","type":"keyword"|"phrasing"|"skill"|"summary","section":"section-path","title":"Brief description","original":"current text","suggested":"improved text","confidence":"high"|"medium"|"low","reason":"explanation"}]}` }] }],
        { temperature: 0.7, maxOutputTokens: 8000 },
      );
      const result = parseSuggestionsResponse(responseText);
      result.suggestions = result.suggestions.map((s) => ({
        ...s,
        approved: s.confidence === 'high',
      }));
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to generate suggestions';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const applySuggestions = (cvData: CVData, suggestions: OptimizationSuggestion[]): CVData => {
    const approved = suggestions.filter((s) => s.approved);
    if (approved.length === 0) return cvData;
    const optimizedCV = JSON.parse(JSON.stringify(cvData)) as CVData;
    approved.forEach((suggestion) => {
      const { section } = suggestion;
      if (section === 'abstract') {
        optimizedCV.abstract = suggestion.suggested;
      } else if (section === 'skills' && suggestion.type === 'skill') {
        const skill = suggestion.suggested.trim();
        if (skill && !optimizedCV.skills.includes(skill)) {
          optimizedCV.skills.push(skill);
        }
      } else if (section.startsWith('career[') && !section.includes('.projects[')) {
        const match = section.match(/career\[(\d+)\]\.(\w+)/);
        if (match) {
          const idx = parseInt(match[1]);
          if (optimizedCV.career[idx] && match[2] === 'summarization') {
            optimizedCV.career[idx].summarization = suggestion.suggested;
          }
        }
      } else if (section.startsWith('career[') && section.includes('.projects[')) {
        const match = section.match(/career\[(\d+)\]\.projects\[(\d+)\]\.(\w+)/);
        if (match) {
          const ci = parseInt(match[1]);
          const pi = parseInt(match[2]);
          if (optimizedCV.career[ci]?.projects[pi] && match[3] === 'description') {
            optimizedCV.career[ci].projects[pi].description = suggestion.suggested;
          }
        }
      } else if (section.startsWith('personalProjects[')) {
        const match = section.match(/personalProjects\[(\d+)\]\.(\w+)/);
        if (match) {
          const idx = parseInt(match[1]);
          if (optimizedCV.personalProjects[idx] && match[2] === 'description') {
            optimizedCV.personalProjects[idx].description = suggestion.suggested;
          }
        }
      }
    });
    return optimizedCV;
  };

  return { generateSuggestions, applySuggestions, isLoading, error };
};

function parseSuggestionsResponse(responseText: string): CVOptimizationResult {
  let text = responseText.trim();
  if (text.startsWith('```json')) text = text.replace(/^```json\s*/, '').replace(/```\s*$/, '');
  else if (text.startsWith('```')) text = text.replace(/^```\s*/, '').replace(/```\s*$/, '');
  const match = text.match(/\{[\s\S]*\}/);
  if (match) text = match[0];
  const parsed = JSON.parse(text);
  const suggestions: OptimizationSuggestion[] = parsed.suggestions || [];
  return {
    suggestions,
    summary: {
      totalSuggestions: suggestions.length,
      keywordSuggestions: suggestions.filter((s) => s.type === 'keyword').length,
      phrasingSuggestions: suggestions.filter((s) => s.type === 'phrasing').length,
      skillSuggestions: suggestions.filter((s) => s.type === 'skill').length,
      highConfidenceCount: suggestions.filter((s) => s.confidence === 'high').length,
    },
  };
}
