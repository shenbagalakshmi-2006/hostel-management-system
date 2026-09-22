import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController.js';
import { authenticateJWT, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateJWT);

// Admin dashboard live stats
router.get('/stats', requireRole('ADMIN'), DashboardController.getStats);

export default router;
