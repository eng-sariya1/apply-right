import { Request, Response } from 'express';
import atsScorer from '../utils/ats-scorer';

export class ATSController {
  async analyzeCV(req: Request, res: Response): Promise<void> {
    try {
      const { cvData, targetKeywords } = req.body;

      if (!cvData) {
        res.status(400).json({ error: 'CV data is required' });
        return;
      }

      const score = atsScorer.calculateScore(cvData, targetKeywords || []);
      
      res.json({
        score,
        success: true
      });
    } catch (error: any) {
      console.error('Error in analyzeCV:', error);
      res.status(500).json({ 
        error: 'Failed to analyze CV',
        message: error.message 
      });
    }
  }

  async getRecommendations(req: Request, res: Response): Promise<void> {
    try {
      const { cvData } = req.body;

      if (!cvData) {
        res.status(400).json({ error: 'CV data is required' });
        return;
      }

      const score = atsScorer.calculateScore(cvData);
      
      res.json({
        recommendations: score.suggestions,
        missingKeywords: score.missingKeywords,
        strengths: score.strengths,
        success: true
      });
    } catch (error: any) {
      console.error('Error in getRecommendations:', error);
      res.status(500).json({ 
        error: 'Failed to get recommendations',
        message: error.message 
      });
    }
  }
}

export default new ATSController();
