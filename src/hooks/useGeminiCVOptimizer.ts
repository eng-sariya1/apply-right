import { useState } from 'react';
import type { CVData, CVOptimizationResult, OptimizationSuggestion } from '../types/cv.types';

interface UseGeminiCVOptimizerResult {
  optimizeCV: (cvData: CVData, jobDescription: string) => Promise<CVData>;
  generateSuggestions: (cvData: CVData, jobDescription: string) => Promise<CVOptimizationResult>;
  applySuggestions: (cvData: CVData, suggestions: OptimizationSuggestion[]) => CVData;
  isLoading: boolean;
  error: string | null;
}

export const useGeminiCVOptimizer = (): UseGeminiCVOptimizerResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const optimizeCV = async (cvData: CVData, jobDescription: string): Promise<CVData> => {
    if (!cvData || !jobDescription.trim()) {
      setError('Please provide both CV data and job description');
      throw new Error('Please provide both CV data and job description');
    }

    setIsLoading(true);
    setError(null);

    try {
      const cvText = JSON.stringify(cvData, null, 2);

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
                    text: `You are a CV optimization expert. Your job is to optimize a candidate's CV to better match a job description while maintaining truthfulness and authenticity.

JOB DESCRIPTION:
${jobDescription}

CURRENT CV DATA:
${cvText}

Optimize the CV by:
1. Rewriting the abstract/summary to highlight relevant skills and experiences for this job
2. Rephrasing career experiences to emphasize achievements relevant to the job description
3. Reordering or adding relevant skills that match the job requirements (only add skills that can be reasonably inferred from existing experience)
4. Improving project descriptions to showcase relevant technical abilities
5. Using keywords from the job description naturally throughout the CV

IMPORTANT RULES:
- DO NOT fabricate experiences, skills, or qualifications that don't exist
- DO NOT change dates, company names, or factual information
- DO enhance descriptions to better showcase existing relevant experience
- DO use industry-standard terminology from the job description
- Keep the same JSON structure as the input

Return ONLY a valid JSON object with the EXACT same structure as the input CV data (no additional text or markdown):`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 8000,
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

      const optimizedCV = parseGeminiResponse(responseText);
      return optimizedCV;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to optimize CV';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const generateSuggestions = async (cvData: CVData, jobDescription: string): Promise<CVOptimizationResult> => {
    if (!cvData || !jobDescription.trim()) {
      setError('Please provide both CV data and job description');
      throw new Error('Please provide both CV data and job description');
    }

    setIsLoading(true);
    setError(null);

    try {
      const cvText = JSON.stringify(cvData, null, 2);

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
                    text: `You are a CV optimization expert. Analyze this CV against the job description and provide specific, actionable optimization suggestions.

JOB DESCRIPTION:
${jobDescription}

CURRENT CV DATA:
${cvText}

Generate a list of specific suggestions to optimize the CV for this job. For each suggestion:
1. Identify the type: "keyword" (adding missing keywords), "phrasing" (improving wording), "skill" (adding/highlighting skills), or "summary" (improving abstract/summary)
2. Specify the exact section being modified (e.g., "abstract", "career[0].summarization", "skills")
3. Provide the original text and suggested replacement
4. Assign a confidence level:
   - "high": Essential changes with strong job description match (e.g., adding critical missing keywords)
   - "medium": Beneficial improvements with good relevance
   - "low": Optional enhancements that may help
5. Explain why this change is recommended

IMPORTANT RULES:
- Only suggest changes that are truthful and based on existing CV content
- Do NOT fabricate experiences or qualifications
- Focus on rephrasing, keyword optimization, and skill highlighting
- Be specific - provide exact text replacements
- Prioritize suggestions that address missing keywords from the job description
- For skills: Create ONE SEPARATE suggestion for EACH individual skill to add (never combine multiple skills in one suggestion)
- For example, if suggesting to add "Docker" and "Kubernetes", create TWO separate suggestions, not one with "Docker, Kubernetes"
- Each skill suggestion should have "suggested" containing only ONE skill name
- Limit to 15-20 most impactful suggestions

Return ONLY a valid JSON object in this exact structure (no markdown):
{
  "suggestions": [
    {
      "id": "unique-id",
      "type": "keyword" | "phrasing" | "skill" | "summary",
      "section": "section-path",
      "title": "Brief description",
      "original": "current text",
      "suggested": "improved text",
      "confidence": "high" | "medium" | "low",
      "reason": "explanation"
    }
  ]
}

REMEMBER: For type "skill", the "suggested" field must contain ONLY ONE skill, never a comma-separated list!`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 8000,
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

      const result = parseSuggestionsResponse(responseText);

      // Auto-approve high confidence suggestions
      result.suggestions = result.suggestions.map(suggestion => ({
        ...suggestion,
        approved: suggestion.confidence === 'high'
      }));

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate suggestions';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const applySuggestions = (cvData: CVData, suggestions: OptimizationSuggestion[]): CVData => {
    const approvedSuggestions = suggestions.filter(s => s.approved);
    console.log(`applySuggestions: ${approvedSuggestions.length} approved suggestions to apply`);

    if (approvedSuggestions.length === 0) {
      console.log('applySuggestions: No approved suggestions, returning original CV');
      return cvData;
    }

    // Create a deep copy of the CV data
    const optimizedCV = JSON.parse(JSON.stringify(cvData)) as CVData;

    // Apply each approved suggestion
    approvedSuggestions.forEach((suggestion, index) => {
      const section = suggestion.section;
      console.log(`Applying suggestion ${index + 1}/${approvedSuggestions.length}:`, {
        section,
        type: suggestion.type,
        title: suggestion.title
      });

      if (section === 'abstract') {
        console.log('  → Updating abstract');
        optimizedCV.abstract = suggestion.suggested;
      } else if (section === 'skills') {
        // For skills, add as a single skill (AI should suggest one skill per suggestion)
        if (suggestion.type === 'skill') {
          const skillToAdd = suggestion.suggested.trim();
          if (skillToAdd && !optimizedCV.skills.includes(skillToAdd)) {
            console.log('  → Adding skill:', skillToAdd);
            optimizedCV.skills.push(skillToAdd);
          } else {
            console.log('  → Skill already exists or empty:', skillToAdd);
          }
        }
      } else if (section.startsWith('career[') && !section.includes('.projects[')) {
        // Parse career index: career[0].summarization
        const match = section.match(/career\[(\d+)\]\.(\w+)/);
        if (match) {
          const index = parseInt(match[1]);
          const field = match[2];
          if (optimizedCV.career[index] && field === 'summarization') {
            console.log(`  → Updating career[${index}].summarization`);
            optimizedCV.career[index].summarization = suggestion.suggested;
          } else {
            console.log(`  → Could not find career[${index}] or field ${field}`);
          }
        } else {
          console.log('  → Failed to parse career section:', section);
        }
      } else if (section.startsWith('career[') && section.includes('.projects[')) {
        // Parse career project: career[0].projects[1].description
        const match = section.match(/career\[(\d+)\]\.projects\[(\d+)\]\.(\w+)/);
        if (match) {
          const careerIndex = parseInt(match[1]);
          const projectIndex = parseInt(match[2]);
          const field = match[3];
          if (optimizedCV.career[careerIndex]?.projects[projectIndex]) {
            if (field === 'description') {
              console.log(`  → Updating career[${careerIndex}].projects[${projectIndex}].description`);
              optimizedCV.career[careerIndex].projects[projectIndex].description = suggestion.suggested;
            }
          } else {
            console.log(`  → Could not find career[${careerIndex}].projects[${projectIndex}]`);
          }
        } else {
          console.log('  → Failed to parse career project section:', section);
        }
      } else if (section.startsWith('personalProjects[')) {
        // Parse personal project: personalProjects[0].description
        const match = section.match(/personalProjects\[(\d+)\]\.(\w+)/);
        if (match) {
          const index = parseInt(match[1]);
          const field = match[2];
          if (optimizedCV.personalProjects[index] && field === 'description') {
            console.log(`  → Updating personalProjects[${index}].description`);
            optimizedCV.personalProjects[index].description = suggestion.suggested;
          } else {
            console.log(`  → Could not find personalProjects[${index}]`);
          }
        } else {
          console.log('  → Failed to parse personalProjects section:', section);
        }
      } else {
        console.log('  → Unhandled section format:', section);
      }
    });

    console.log('applySuggestions: All suggestions applied, returning optimized CV');
    return optimizedCV;
  };

  return {
    optimizeCV,
    generateSuggestions,
    applySuggestions,
    isLoading,
    error,
  };
};

function parseGeminiResponse(responseText: string): CVData {
  try {
    let cleanedText = responseText.trim();

    // Remove markdown code blocks if present
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/```\s*$/, '');
    }

    // Try to find JSON object in the response
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }

    const parsed = JSON.parse(cleanedText);
    return parsed as CVData;
  } catch (error) {
    console.error('Failed to parse Gemini response:', error);
    console.error('Response text:', responseText);
    throw new Error('Failed to parse optimized CV. Please try again.');
  }
}

function parseSuggestionsResponse(responseText: string): CVOptimizationResult {
  try {
    let cleanedText = responseText.trim();

    // Remove markdown code blocks if present
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/```\s*$/, '');
    }

    // Try to find JSON object in the response
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }

    const parsed = JSON.parse(cleanedText);
    const suggestions = parsed.suggestions || [];

    // Calculate summary statistics
    const summary = {
      totalSuggestions: suggestions.length,
      keywordSuggestions: suggestions.filter((s: OptimizationSuggestion) => s.type === 'keyword').length,
      phrasingSuggestions: suggestions.filter((s: OptimizationSuggestion) => s.type === 'phrasing').length,
      skillSuggestions: suggestions.filter((s: OptimizationSuggestion) => s.type === 'skill').length,
      highConfidenceCount: suggestions.filter((s: OptimizationSuggestion) => s.confidence === 'high').length,
    };

    return {
      suggestions,
      summary,
    };
  } catch (error) {
    console.error('Failed to parse suggestions response:', error);
    console.error('Response text:', responseText);
    throw new Error('Failed to parse optimization suggestions. Please try again.');
  }
}
