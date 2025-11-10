import { CVData, ATSScore } from '../types/cv.types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class APIService {
  async improveContent(content: string, context: string): Promise<{ improved: string; original: string }> {
    const response = await fetch(`${API_BASE_URL}/ai/improve-content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, context })
    });
    
    if (!response.ok) throw new Error('Failed to improve content');
    return response.json();
  }

  async generateSummary(cvData: CVData): Promise<{ summary: string }> {
    const response = await fetch(`${API_BASE_URL}/ai/generate-summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cvData })
    });
    
    if (!response.ok) throw new Error('Failed to generate summary');
    return response.json();
  }

  async suggestKeywords(jobTitle: string, industry: string): Promise<{ keywords: string[] }> {
    const response = await fetch(`${API_BASE_URL}/ai/suggest-keywords`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobTitle, industry })
    });
    
    if (!response.ok) throw new Error('Failed to suggest keywords');
    return response.json();
  }

  async enhanceAchievement(achievement: string): Promise<{ enhanced: string; original: string }> {
    const response = await fetch(`${API_BASE_URL}/ai/enhance-achievement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ achievement })
    });
    
    if (!response.ok) throw new Error('Failed to enhance achievement');
    return response.json();
  }

  async analyzeATS(cvData: CVData, targetKeywords: string[] = []): Promise<{ score: ATSScore }> {
    const response = await fetch(`${API_BASE_URL}/ats/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cvData, targetKeywords })
    });
    
    if (!response.ok) throw new Error('Failed to analyze ATS');
    return response.json();
  }

  async getRecommendations(cvData: CVData): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/ats/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cvData })
    });
    
    if (!response.ok) throw new Error('Failed to get recommendations');
    return response.json();
  }
}

export default new APIService();
