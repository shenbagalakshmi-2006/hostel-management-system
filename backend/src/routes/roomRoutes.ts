import { Router } from 'express';
import { RoomController } from '../controllers/roomController.js';
import { authenticateJWT, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateJWT);

router.get('/', RoomController.getAllRooms);
router.get('/:id', RoomController.getRoomById);
router.post('/', requireRole('ADMIN'), RoomController.createRoom);
router.put('/:id', requireRole('ADMIN'), RoomController.updateRoom);
router.delete('/:id', requireRole('ADMIN'), RoomController.deleteRoom);

export default router;
