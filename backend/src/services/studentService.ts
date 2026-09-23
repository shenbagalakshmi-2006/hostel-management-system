import mongoose from 'mongoose';
import { Student, IStudent } from '../models/Student.js';
import { User } from '../models/User.js';
import { Allocation } from '../models/Allocation.js';
import { Room } from '../models/Room.js';
import { Complaint } from '../models/Complaint.js';
import { inMemoryStore } from '../utils/inMemoryStore.js';

export interface StudentFilters {
  search?: string;
  department?: string;
  year?: number;
  gender?: string;
  page?: number;
  limit?: number;
}

export class StudentService {
  static async getAllStudents(filters: StudentFilters) {
    if (mongoose.connection.readyState !== 1) {
      let list = [...inMemoryStore.students];
      if (filters.search) {
        const s = filters.search.toLowerCase();
        list = list.filter((st) => st.name.toLowerCase().includes(s) || st.studentId.toLowerCase().includes(s) || st.department.toLowerCase().includes(s));
      }
      if (filters.department) list = list.filter((st) => st.department === filters.department);
      if (filters.year) list = list.filter((st) => st.year === Number(filters.year));
      if (filters.gender) list = list.filter((st) => st.gender === filters.gender);
      return {
        students: list,
        pagination: { page: 1, limit: list.length, total: list.length, totalPages: 1 },
      };
    }

    try {
      const { search, department, year, gender, page = 1, limit = 10 } = filters;
    const query: any = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { studentId: searchRegex },
        { email: searchRegex },
        { department: searchRegex },
      ];
    }

    if (department) {
      query.department = department;
    }

    if (year) {
      query.year = Number(year);
    }

    if (gender) {
      query.gender = gender;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .populate('room', 'roomNumber block floor roomType status')
      .populate('user', 'email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return {
      students,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)) || 1,
      },
    };
    } catch (err) {
      console.warn('[StudentService] DB error, using in-memory students:', err);
      return {
        students: inMemoryStore.students,
        pagination: { page: 1, limit: inMemoryStore.students.length, total: inMemoryStore.students.length, totalPages: 1 },
      };
    }
  }

  static async getStudentById(id: string) {
    const student = await Student.findById(id)
      .populate('room')
      .populate('user', 'name email role');

    if (!student) {
      throw new Error('Student not found');
    }

    // Fetch allocation history
    const allocations = await Allocation.find({ student: student._id })
      .populate('room')
      .sort({ allocatedAt: -1 });

    // Fetch complaints history
    const complaints = await Complaint.find({ student: student._id }).sort({ date: -1 });

    return {
      student,
      allocations,
      complaints,
    };
  }

  static async getStudentByUserId(userId: string) {
    const student = await Student.findOne({ user: userId })
      .populate('room')
      .populate('user', 'name email role');

    if (!student) {
      throw new Error('Student profile not found for current user');
    }

    const allocations = await Allocation.find({ student: student._id })
      .populate('room')
      .sort({ allocatedAt: -1 });

    const complaints = await Complaint.find({ student: student._id }).sort({ date: -1 });

    return {
      student,
      allocations,
      complaints,
    };
  }

  static async createStudent(data: {
    studentId: string;
    name: string;
    email: string;
    phone: string;
    gender: 'Male' | 'Female' | 'Other';
    dateOfBirth?: Date;
    department: string;
    year: number;
    address: string;
    guardianName: string;
    guardianPhone: string;
    password?: string;
  }) {
    // Check if user or student already exists
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      throw new Error('A user with this email already exists.');
    }

    const existingStudentId = await Student.findOne({ studentId: data.studentId.toUpperCase() });
    if (existingStudentId) {
      throw new Error('A student with this Student ID already exists.');
    }

    // Create User account with default password (or provided)
    const userPassword = data.password || 'Student@123';
    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: userPassword,
      role: 'STUDENT',
    });

    // Create Student profile
    const student = await Student.create({
      user: user._id,
      studentId: data.studentId.toUpperCase(),
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      department: data.department,
      year: data.year,
      address: data.address,
      guardianName: data.guardianName,
      guardianPhone: data.guardianPhone,
      room: null,
    });

    return student;
  }

  static async updateStudent(id: string, updateData: Partial<IStudent>) {
    const student = await Student.findById(id);
    if (!student) {
      throw new Error('Student not found');
    }

    // If updating email or name, update linked User record too
    if (updateData.email && updateData.email.toLowerCase() !== student.email) {
      const existingUser = await User.findOne({
        email: updateData.email.toLowerCase(),
        _id: { $ne: student.user },
      });
      if (existingUser) {
        throw new Error('Email is already in use by another account');
      }
      await User.findByIdAndUpdate(student.user, { email: updateData.email.toLowerCase() });
      updateData.email = updateData.email.toLowerCase();
    }

    if (updateData.name && updateData.name !== student.name) {
      await User.findByIdAndUpdate(student.user, { name: updateData.name });
    }

    // Prevent changing critical read-only fields directly via standard update
    delete (updateData as any).user;
    delete (updateData as any).room;

    const updated = await Student.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('room');

    return updated;
  }

  static async deleteStudent(id: string) {
    const student = await Student.findById(id);
    if (!student) {
      throw new Error('Student not found');
    }

    // If student has an active allocation, vacate the bed
    if (student.room) {
      const room = await Room.findById(student.room);
      if (room && room.occupiedCount > 0) {
        room.occupiedCount -= 1;
        await room.save();
      }
      await Allocation.updateMany(
        { student: student._id, status: 'ACTIVE' },
        { status: 'VACATED', vacatedAt: new Date() }
      );
    }

    // Delete student, complaints, and user
    await Complaint.deleteMany({ student: student._id });
    await Allocation.deleteMany({ student: student._id });
    await User.findByIdAndDelete(student.user);
    await Student.findByIdAndDelete(id);

    return { message: 'Student and related records deleted successfully' };
  }
}
