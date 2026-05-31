import { useState } from 'react';
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
                    text: `You are an AI CV/Resume parser. Your job is to extract structured information from CV text and return it in a specific JSON format.

I will provide you with text extracted from a CV document. Please analyze it VERY carefully and extract ALL relevant information you can find.

CV TEXT:
${extractedText}

Your task is to parse this CV text and extract the following information:
1. Personal information (name, email, phone, specialization/title/job title)
2. Professional summary/abstract/objective
3. ALL Skills mentioned (technical and soft skills)
4. Complete work experience/career history with ALL details
5. Personal projects (if any are mentioned separately from work projects)
6. Education (degrees, universities, dates, grades)

CRITICAL INSTRUCTIONS - READ CAREFULLY:
- Extract ALL factual information from the provided text - don't skip anything
- Look for information in ALL sections of the CV, including headers, footers, and side sections
- For work experience: Extract company name, job title, dates, location, description, and any projects
- For education: Extract degree, field of study, university name, graduation date, GPA/grade if mentioned
- For skills: Create individual array items for each skill - separate comma-separated skills
- For dates: Keep the original format (e.g., "Jan 2020", "2020-01", "January 2020")
- For links: Look for LinkedIn, GitHub, Portfolio, Website URLs and extract them with labels
- For career: Look for job descriptions, responsibilities, achievements - don't leave summarization empty
- For education: Format it as a complete sentence like "Bachelor's Degree in Computer Science from XYZ University (2020-2024)"
- If a text field genuinely has no data in the CV, only then use empty string ""
- If an array field has no data, use empty array []
- Do NOT fabricate information, but do NOT miss information that exists

Return ONLY a valid JSON object with this EXACT structure (no additional text, no markdown, no code blocks):
{
  "header": {
    "fullName": "string (extract full name)",
    "specialization": "string (job title/role like 'Software Engineer', 'Frontend Developer')",
    "email": "string (email address)",
    "phone": "string (phone number with country code if available)",
    "links": [
      {
        "name": "string (e.g., 'LinkedIn', 'GitHub', 'Portfolio')",
        "url": "string (full URL)"
      }
    ]
  },
  "abstract": "string (professional summary or objective, 2-4 sentences)",
  "skills": ["skill1", "skill2", "skill3"],
  "career": [
    {
      "startDate": "string (e.g., 'Jan 2020', '2020-01')",
      "endDate": "string or null (null if currently working)",
      "isPresent": boolean (true if currently working here),
      "location": "string (city, country e.g. 'New York, USA' or 'Remote')",
      "companyName": "string (company/organization name e.g. 'Google', 'Microsoft')",
      "workSpecialization": "string (job title/position e.g. 'Senior Software Engineer', 'Frontend Developer')",
      "jobType": "Full time" | "Part time" | "Contract" | "Freelance",
      "summarization": "string (IMPORTANT: Extract the complete job description, responsibilities, and achievements. This should NOT be empty if work experience details exist in the CV)",
      "projects": [
        {
          "name": "string (project name)",
          "description": "string (what the project does)",
          "technologies": "string (comma-separated technologies)",
          "keyContributions": ["contribution1", "contribution2"]
        }
      ]
    }
  ],
  "personalProjects": [
    {
      "title": "string (project name)",
      "description": "string (project description)",
      "technologies": "string (comma-separated technologies)",
      "keyFeatures": ["feature1", "feature2"]
    }
  ],
  "education": "string (IMPORTANT: Extract ALL education details and format professionally. Example: 'Bachelor of Science in Computer Science from Stanford University (2018-2022), GPA: 3.8/4.0'. This should NOT be empty if education info exists in CV)",
  "sectionTitleColor": "017A8C"
}

VALIDATION RULES:
- Ensure all required fields are present
- Use proper data types (strings, arrays, booleans, null)
- jobType must be one of: "Full time", "Part time", "Contract", "Freelance" (default to "Full time" if unclear)
- isPresent should be true only if the text indicates current employment
- All arrays should be properly formatted JSON arrays
- Return ONLY the JSON object, no explanatory text before or after

CRITICAL REMINDER:
- DO NOT return empty strings for "summarization" if work experience details exist in the CV text
- DO NOT return empty strings for "education" if education details exist in the CV text
- DO NOT skip skills - extract ALL skills mentioned
- DO NOT miss project descriptions or company details
- Read the ENTIRE CV text carefully before extracting data
- If you see job responsibilities, achievements, or descriptions - include them ALL in the summarization field`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.3,
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

      const parsedCV = parseGeminiResponse(responseText);
      return parsedCV;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse CV';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    parseCV,
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

    // Validate the parsed data structure
    if (!parsed.header || typeof parsed.header !== 'object') {
      throw new Error('Invalid CV data structure: missing header');
    }
console.log({parsed})
    // Ensure all required fields have proper defaults
    const cvData: CVData = {
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

    return cvData;
  } catch (error) {
    console.error('Failed to parse Gemini response:', error);
    console.error('Response text:', responseText);
    throw new Error('Failed to parse CV data from response. Please try again.');
  }
}
