import { useState } from 'react';
import type { CVData } from '../types/cv.types';

interface UseGeminiATSResult {
    analyzeAndOptimizeCV: (cvData: CVData) => Promise<CVData>;
    isLoading: boolean;
    error: string | null;
}

export const useGeminiATS = (): UseGeminiATSResult => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyzeAndOptimizeCV = async (cvData: CVData): Promise<CVData> => {
        if (!cvData) {
            setError('Please provide CV data to analyze');
            return cvData;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Prepare CV data as a formatted string for Gemini
            const cvText = formatCVDataForAnalysis(cvData);

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
                                        text: `You are an AI Resume Editor and Professional Formatter.
I will provide raw data from a user's CV form (career summary, education, work experience, personal projects, and skills).
Your job is to return a fully cleaned, formatted, and professional version that's ready to be displayed in a modern CV.

Your tasks:
1. Correct all spelling and grammar mistakes.
2. Fix spacing and punctuation (add spaces between glued words, fix missing periods or commas).
3. Keep consistent capitalization (e.g., names, degrees, job titles).
4. Reformat text to look clean and aligned, suitable for a CV layout.
5. For the Skills section:
   • Split the skills into bullet points (•).
   • Fix spacing and remove duplicates.
   • Optionally group into Technical Skills and Soft Skills if it's clear.
6. For the Education section:
   • Make sure degrees, fields, universities, and years are clearly formatted.
   • Example: Bachelor's in Information Technology — IUST University (2024)
7. For the Career Summary:
   • Keep it short (2–3 sentences).
   • Fix grammar and flow but keep the same meaning.
8. For the Work Experience:
   • Use short professional sentences or bullet points.
   • Start each point with a strong action verb (e.g., "Developed", "Managed").
9. DO NOT add fictional information, only clean and enhance existing content.
10. Return ONLY a valid JSON object with the exact same structure as the input.
11. Ensure the response is ONLY the JSON object, no additional text or markdown.

INPUT CV DATA:
${cvText}

Return the cleaned and formatted CV as a JSON object with this exact structure:
{
  "header": {
    "fullName": "string",
    "specialization": "string",
    "email": "string",
    "phone": "string",
    "links": [{"name": "string", "url": "string"}]
  },
  "abstract": "string",
  "skills": ["string"],
  "career": [{
    "startDate": "string",
    "endDate": "string or null",
    "isPresent": boolean,
    "location": "string",
    "companyName": "string",
    "workSpecialization": "string",
    "jobType": "string",
    "summarization": "string",
    "projects": [{"name": "string", "description": "string", "technologies": "string", "keyContributions": ["string"]}]
  }],
  "personalProjects": [{
    "title": "string",
    "description": "string",
    "technologies": "string",
    "keyFeatures": ["string"]
  }],
  "education": "string",
  "sectionTitleColor": "string"
}`,
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

            // Parse the JSON response from Gemini
            const optimizedCV = parseGeminiResponse(responseText);

            return optimizedCV;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to optimize CV';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        analyzeAndOptimizeCV,
        isLoading,
        error,
    };
};

// Helper function to format CV data for analysis
function formatCVDataForAnalysis(cvData: CVData): string {
    return JSON.stringify(cvData, null, 2);
}

// Helper function to parse Gemini response and extract JSON
function parseGeminiResponse(responseText: string): CVData {
    try {
        // Remove markdown code blocks if present
        let cleanedText = responseText.trim();

        // Remove ```json and ``` markers if present
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
        throw new Error('Failed to parse optimized CV data. Please try again.');
    }
}
