import { Router } from 'express';
import { StudentController } from '../controllers/studentController.js';
import { authenticateJWT, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateJWT);

// Student profile route (for current logged-in student)
router.get('/profile/me', StudentController.getMyProfile);

// Admin-only student management routes
router.get('/', requireRole('ADMIN'), StudentController.getAllStudents);
router.get('/:id', StudentController.getStudentById);
router.post('/', requireRole('ADMIN'), StudentController.createStudent);
router.put('/:id', StudentController.updateStudent);
router.delete('/:id', requireRole('ADMIN'), StudentController.deleteStudent);

export default router;
