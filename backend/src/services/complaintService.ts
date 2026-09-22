import { Complaint, IComplaint } from '../models/Complaint.js';
import { Student } from '../models/Student.js';
import {
  ComplaintCategory,
  ComplaintPriority,
  ComplaintStatus,
} from '../types/index.js';

export interface ComplaintFilters {
  search?: string;
  category?: ComplaintCategory;
  priority?: ComplaintPriority;
  status?: ComplaintStatus;
  studentId?: string;
}

export class ComplaintService {
  static async generateComplaintId(): Promise<string> {
    const lastComplaint = await Complaint.findOne().sort({ createdAt: -1 });
    if (!lastComplaint || !lastComplaint.complaintId) {
      return 'CMP-0001';
    }

    const match = lastComplaint.complaintId.match(/CMP-(\d+)/);
    if (match) {
      const nextNum = parseInt(match[1], 10) + 1;
      return `CMP-${String(nextNum).padStart(4, '0')}`;
    }

    return `CMP-${Date.now().toString().slice(-4)}`;
  }

  static async getAllComplaints(filters: ComplaintFilters, userRole?: string, studentProfileId?: string) {
    const query: any = {};

    // If student, only return their own complaints
    if (userRole === 'STUDENT' && studentProfileId) {
      query.student = studentProfileId;
    } else if (filters.studentId) {
      query.student = filters.studentId;
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.priority) {
      query.priority = filters.priority;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    let complaints = await Complaint.find(query)
      .populate({
        path: 'student',
        select: 'studentId name email department year phone room',
        populate: {
          path: 'room',
          select: 'roomNumber block floor',
        },
      })
      .sort({ createdAt: -1 });

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      complaints = complaints.filter((c: any) => {
        const cId = c.complaintId?.toLowerCase() || '';
        const desc = c.description?.toLowerCase() || '';
        const stuName = c.student?.name?.toLowerCase() || '';
        const stuId = c.student?.studentId?.toLowerCase() || '';
        const roomNo = c.student?.room?.roomNumber?.toLowerCase() || '';
        return (
          cId.includes(searchLower) ||
          desc.includes(searchLower) ||
          stuName.includes(searchLower) ||
          stuId.includes(searchLower) ||
          roomNo.includes(searchLower)
        );
      });
    }

    return complaints;
  }

  static async getComplaintById(id: string) {
    const complaint = await Complaint.findById(id).populate({
      path: 'student',
      select: 'studentId name email phone department year room',
      populate: {
        path: 'room',
        select: 'roomNumber block floor',
      },
    });

    if (!complaint) {
      throw new Error('Complaint not found');
    }

    return complaint;
  }

  static async createComplaint(data: {
    studentId: string; // Mongo ID of the Student document
    category: ComplaintCategory;
    priority: ComplaintPriority;
    description: string;
  }) {
    const student = await Student.findById(data.studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    const complaintId = await this.generateComplaintId();

    const complaint = new Complaint({
      complaintId,
      student: student._id,
      category: data.category,
      priority: data.priority,
      description: data.description,
      status: 'PENDING',
      date: new Date(),
    });

    await complaint.save();
    return complaint;
  }

  static async updateComplaint(
    id: string,
    updateData: {
      status?: ComplaintStatus;
      adminRemarks?: string;
    }
  ) {
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      throw new Error('Complaint not found');
    }

    if (updateData.status) {
      complaint.status = updateData.status;
      if (updateData.status === 'RESOLVED') {
        complaint.resolvedAt = new Date();
      } else {
        complaint.resolvedAt = null;
      }
    }

    if (updateData.adminRemarks !== undefined) {
      complaint.adminRemarks = updateData.adminRemarks;
    }

    await complaint.save();
    return complaint;
  }

  static async deleteComplaint(id: string) {
    const complaint = await Complaint.findByIdAndDelete(id);
    if (!complaint) {
      throw new Error('Complaint not found');
    }
    return { message: 'Complaint deleted successfully' };
  }
}
