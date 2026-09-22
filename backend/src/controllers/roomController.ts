import { Request, Response, NextFunction } from 'express';
import { RoomService } from '../services/roomService.js';
import { RoomStatus, RoomType } from '../types/index.js';

export class RoomController {
  static async getAllRooms(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, status, block, floor, roomType, availableOnly } = req.query;
      const rooms = await RoomService.getAllRooms({
        search: search as string,
        status: status as RoomStatus,
        block: block as string,
        floor: floor ? Number(floor) : undefined,
        roomType: roomType as RoomType,
        availableOnly: availableOnly === 'true',
      });

      res.status(200).json({
        success: true,
        data: rooms,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getRoomById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await RoomService.getRoomById(id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const room = await RoomService.createRoom(req.body);
      res.status(201).json({
        success: true,
        message: 'Room created successfully',
        data: room,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await RoomService.updateRoom(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Room updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await RoomService.deleteRoom(id);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}
