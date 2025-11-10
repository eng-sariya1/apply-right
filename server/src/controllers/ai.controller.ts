import { Request, Response } from 'express';
import geminiService from '../services/gemini.service';

export class AIController {
  async improveContent(req: Request, res: Response): Promise<void> {
    try {
      const { content, context } = req.body;

      if (!content || !context) {
        res.status(400).json({ error: 'Content and context are required' });
        return;
      }

      const improved = await geminiService.improveContent(content, context);
      
      res.json({
        original: content,
        improved,
        success: true
      });
    } catch (error: any) {
      console.error('Error in improveContent:', error);
      res.status(500).json({ 
        error: 'Failed to improve content',
        message: error.message 
      });
    }
  }

  async generateSummary(req: Request, res: Response): Promise<void> {
    try {
      const { cvData } = req.body;

      if (!cvData) {
        res.status(400).json({ error: 'CV data is required' });
        return;
      }

      const summary = await geminiService.generateSummary(cvData);
      
      res.json({
        summary,
        success: true
      });
    } catch (error: any) {
      console.error('Error in generateSummary:', error);
      res.status(500).json({ 
        error: 'Failed to generate summary',
        message: error.message 
      });
    }
  }

  async suggestKeywords(req: Request, res: Response): Promise<void> {
    try {
      const { jobTitle, industry } = req.body;

      if (!jobTitle || !industry) {
        res.status(400).json({ error: 'Job title and industry are required' });
        return;
      }

      const keywords = await geminiService.suggestKeywords(jobTitle, industry);
      
      res.json({
        keywords,
        success: true
      });
    } catch (error: any) {
      console.error('Error in suggestKeywords:', error);
      res.status(500).json({ 
        error: 'Failed to suggest keywords',
        message: error.message 
      });
    }
  }

  async enhanceAchievement(req: Request, res: Response): Promise<void> {
    try {
      const { achievement } = req.body;

      if (!achievement) {
        res.status(400).json({ error: 'Achievement text is required' });
        return;
      }

      const enhanced = await geminiService.enhanceAchievement(achievement);
      
      res.json({
        original: achievement,
        enhanced,
        success: true
      });
    } catch (error: any) {
      console.error('Error in enhanceAchievement:', error);
      res.status(500).json({ 
        error: 'Failed to enhance achievement',
        message: error.message 
      });
    }
  }

  async analyzeATS(req: Request, res: Response): Promise<void> {
    try {
      const { cvText } = req.body;

      if (!cvText) {
        res.status(400).json({ error: 'CV text is required' });
        return;
      }

      const analysis = await geminiService.analyzeATSCompatibility(cvText);
      
      res.json({
        analysis,
        success: true
      });
    } catch (error: any) {
      console.error('Error in analyzeATS:', error);
      res.status(500).json({ 
        error: 'Failed to analyze ATS compatibility',
        message: error.message 
      });
    }
  }
}

export default new AIController();
