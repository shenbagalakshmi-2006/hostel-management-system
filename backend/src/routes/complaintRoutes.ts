import { Router } from 'express';
import { ComplaintController } from '../controllers/complaintController.js';
import { authenticateJWT, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateJWT);

router.get('/', ComplaintController.getAllComplaints);
router.get('/:id', ComplaintController.getComplaintById);
router.post('/', ComplaintController.createComplaint);
router.put('/:id', requireRole('ADMIN'), ComplaintController.updateComplaint);
router.delete('/:id', requireRole('ADMIN'), ComplaintController.deleteComplaint);

export default router;
