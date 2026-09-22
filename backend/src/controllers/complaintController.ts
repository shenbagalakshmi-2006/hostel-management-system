import { Response, NextFunction } from 'express';
import { ComplaintService } from '../services/complaintService.js';
import { StudentService } from '../services/studentService.js';
import { AuthenticatedRequest } from '../types/index.js';

export class ComplaintController {
  static async getAllComplaints(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, category, priority, status, studentId } = req.query;

      let studentProfileId: string | undefined = undefined;
      if (req.user?.role === 'STUDENT') {
        const studentProfile = await StudentService.getStudentByUserId(req.user.userId);
        studentProfileId = studentProfile.student._id.toString();
      }

      const complaints = await ComplaintService.getAllComplaints(
        {
          search: search as string,
          category: category as any,
          priority: priority as any,
          status: status as any,
          studentId: studentId as string,
        },
        req.user?.role,
        studentProfileId
      );

      res.status(200).json({
        success: true,
        data: complaints,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getComplaintById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const complaint = await ComplaintService.getComplaintById(id);

      // If student, check if complaint belongs to them
      if (req.user?.role === 'STUDENT') {
        const studentProfile = await StudentService.getStudentByUserId(req.user.userId);
        if ((complaint.student as any)._id.toString() !== studentProfile.student._id.toString()) {
          res.status(403).json({ success: false, message: 'Forbidden. You can only view your own complaints' });
          return;
        }
      }

      res.status(200).json({
        success: true,
        data: complaint,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createComplaint(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, priority, description, studentId } = req.body;

      let targetStudentId = studentId;
      if (req.user?.role === 'STUDENT') {
        const studentProfile = await StudentService.getStudentByUserId(req.user.userId);
        targetStudentId = studentProfile.student._id.toString();
      }

      if (!targetStudentId) {
        res.status(400).json({ success: false, message: 'Student ID is required' });
        return;
      }

      const complaint = await ComplaintService.createComplaint({
        studentId: targetStudentId,
        category,
        priority,
        description,
      });

      res.status(201).json({
        success: true,
        message: 'Complaint submitted successfully',
        data: complaint,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateComplaint(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status, adminRemarks } = req.body;

      const updated = await ComplaintService.updateComplaint(id, {
        status,
        adminRemarks,
      });

      res.status(200).json({
        success: true,
        message: 'Complaint updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteComplaint(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await ComplaintService.deleteComplaint(id);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}
