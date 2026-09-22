import { Router } from 'express';
import { AllocationController } from '../controllers/allocationController.js';
import { authenticateJWT, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateJWT);

// Only Admin can allocate, vacate, or reassign
router.get('/', requireRole('ADMIN'), AllocationController.getAllAllocations);
router.post('/', requireRole('ADMIN'), AllocationController.allocate);
router.post('/:id/vacate', requireRole('ADMIN'), AllocationController.vacate);
router.post('/:id/reassign', requireRole('ADMIN'), AllocationController.reassign);

export default router;
