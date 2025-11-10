import { Router } from 'express';
import aiController from '../controllers/ai.controller';

const router = Router();

router.post('/improve-content', aiController.improveContent.bind(aiController));
router.post('/generate-summary', aiController.generateSummary.bind(aiController));
router.post('/suggest-keywords', aiController.suggestKeywords.bind(aiController));
router.post('/enhance-achievement', aiController.enhanceAchievement.bind(aiController));
router.post('/analyze-ats', aiController.analyzeATS.bind(aiController));

export default router;
