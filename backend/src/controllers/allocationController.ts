import { Request, Response, NextFunction } from 'express';
import { AllocationService } from '../services/allocationService.js';

export class AllocationController {
  static async getAllAllocations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, search } = req.query;
      const allocations = await AllocationService.getAllAllocations({
        status: status as 'ACTIVE' | 'VACATED',
        search: search as string,
      });

      res.status(200).json({
        success: true,
        data: allocations,
      });
    } catch (error) {
      next(error);
    }
  }

  static async allocate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { studentId, roomId, notes } = req.body;
      if (!studentId || !roomId) {
        res.status(400).json({
          success: false,
          message: 'studentId and roomId are required for allocation',
        });
        return;
      }

      const result = await AllocationService.allocateRoom(studentId, roomId, notes);
      res.status(201).json({
        success: true,
        message: 'Room allocated successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async vacate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await AllocationService.vacateAllocation(id);
      res.status(200).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async reassign(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { newRoomId, notes } = req.body;

      if (!newRoomId) {
        res.status(400).json({
          success: false,
          message: 'newRoomId is required for reassignment',
        });
        return;
      }

      const result = await AllocationService.reassignRoom(id, newRoomId, notes);
      res.status(200).json({
        success: true,
        message: 'Room reassigned successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
