import { Router } from 'express';
import atsController from '../controllers/ats.controller';

const router = Router();

router.post('/analyze', atsController.analyzeCV.bind(atsController));
router.post('/recommendations', atsController.getRecommendations.bind(atsController));

export default router;
