import { Response, NextFunction } from 'express';
import { StudentService } from '../services/studentService.js';
import { AuthenticatedRequest } from '../types/index.js';

export class StudentController {
  static async getAllStudents(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, department, year, gender, page, limit } = req.query;
      const result = await StudentService.getAllStudents({
        search: search as string,
        department: department as string,
        year: year ? Number(year) : undefined,
        gender: gender as string,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 50,
      });

      res.status(200).json({
        success: true,
        data: result.students,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStudentById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await StudentService.getStudentById(id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthenticated' });
        return;
      }
      const result = await StudentService.getStudentByUserId(req.user.userId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createStudent(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await StudentService.createStudent(req.body);
      res.status(201).json({
        success: true,
        message: 'Student registered successfully',
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStudent(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      // If student is updating own profile, verify ownership
      if (req.user?.role === 'STUDENT') {
        const student = await StudentService.getStudentByUserId(req.user.userId);
        if (student.student._id.toString() !== id) {
          res.status(403).json({ success: false, message: 'Forbidden: You can only edit your own profile' });
          return;
        }
      }

      const updated = await StudentService.updateStudent(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Student profile updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteStudent(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await StudentService.deleteStudent(id);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}
