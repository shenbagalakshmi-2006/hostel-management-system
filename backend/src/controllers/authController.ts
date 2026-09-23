import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';
import { AuthenticatedRequest } from '../types/index.js';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthenticated' });
        return;
      }
      const user = await AuthService.getMe(req.user.userId, req.user);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }
}
