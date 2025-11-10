import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export class GeminiService {
  async improveContent(content: string, context: string): Promise<string> {
    try {
      const prompt = `You are a professional CV/resume writer. Improve the following ${context} to make it more professional, impactful, and ATS-friendly. Focus on action verbs, quantifiable achievements, and clear communication.

Original content:
${content}

Provide ONLY the improved version without any explanations or additional text.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error improving content:', error);
      throw new Error('Failed to improve content with AI');
    }
  }

  async generateSummary(cvData: any): Promise<string> {
    try {
      const prompt = `You are a professional CV/resume writer. Based on the following information, create a compelling professional summary (2-3 sentences) that highlights key strengths and career objectives.

Name: ${cvData.personalInfo?.fullName || 'Professional'}
Experience: ${cvData.experience?.map((exp: any) => `${exp.position} at ${exp.company}`).join(', ') || 'Various roles'}
Skills: ${cvData.skills?.map((skill: any) => skill.name).join(', ') || 'Multiple skills'}
Education: ${cvData.education?.map((edu: any) => `${edu.degree} in ${edu.field}`).join(', ') || 'Relevant education'}

Provide ONLY the professional summary without any labels or additional text.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error generating summary:', error);
      throw new Error('Failed to generate summary with AI');
    }
  }

  async suggestKeywords(jobTitle: string, industry: string): Promise<string[]> {
    try {
      const prompt = `You are an ATS (Applicant Tracking System) expert. Suggest 15-20 important keywords and skills that should be included in a CV/resume for a ${jobTitle} position in the ${industry} industry. These keywords should be commonly searched by ATS systems.

Provide ONLY a comma-separated list of keywords without any explanations or numbering.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const keywords = response.text()
        .trim()
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);
      
      return keywords;
    } catch (error) {
      console.error('Error suggesting keywords:', error);
      throw new Error('Failed to suggest keywords with AI');
    }
  }

  async enhanceAchievement(achievement: string): Promise<string> {
    try {
      const prompt = `You are a professional CV/resume writer. Enhance the following achievement to make it more impactful by adding quantifiable metrics where possible and using strong action verbs. If metrics are not present, suggest realistic examples in brackets.

Original achievement:
${achievement}

Provide ONLY the enhanced achievement without any explanations.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error enhancing achievement:', error);
      throw new Error('Failed to enhance achievement with AI');
    }
  }

  async analyzeATSCompatibility(cvText: string): Promise<any> {
    try {
      const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze the following CV content for ATS compatibility and provide specific feedback.

CV Content:
${cvText}

Provide your analysis in the following JSON format (respond with ONLY valid JSON, no markdown or additional text):
{
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "missingElements": ["element1", "element2"]
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback if JSON parsing fails
      return {
        strengths: ['Content provided'],
        weaknesses: ['Unable to parse detailed analysis'],
        suggestions: ['Review CV format and content'],
        missingElements: []
      };
    } catch (error) {
      console.error('Error analyzing ATS compatibility:', error);
      throw new Error('Failed to analyze ATS compatibility');
    }
  }
}

export default new GeminiService();
