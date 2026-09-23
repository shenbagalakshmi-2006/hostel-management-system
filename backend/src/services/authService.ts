import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Student } from '../models/Student.js';
import { AuthUserPayload } from '../types/index.js';
import { inMemoryStore } from '../utils/inMemoryStore.js';

export class AuthService {
  static generateToken(payload: AuthUserPayload): string {
    const secret = process.env.JWT_SECRET || 'super_secret_hostel_jwt_key_2026_dev_mode';
    const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as any;
    return jwt.sign(payload, secret, { expiresIn });
  }

  static async login(email: string, password?: string): Promise<{ token: string; user: any }> {
    if (!email || !email.trim()) {
      throw new Error('Email address is required to sign in');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const isAdmin =
      normalizedEmail.includes('admin') ||
      normalizedEmail.includes('warden') ||
      normalizedEmail.startsWith('admin');

    const role: 'ADMIN' | 'STUDENT' = isAdmin ? 'ADMIN' : 'STUDENT';
    const baseName = normalizedEmail
      .split('@')[0]
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const displayName = isAdmin
      ? baseName.toLowerCase().includes('admin') || baseName.toLowerCase().includes('warden')
        ? baseName
        : `${baseName} (Admin)`
      : baseName;

    // 1. If MongoDB is actively connected, attempt DB lookup or dynamic creation
    if (mongoose.connection.readyState === 1) {
      try {
        let user = await User.findOne({ email: normalizedEmail }).select('+password');

        if (!user) {
          // Dynamic user creation to accept ANY email!
          user = await User.create({
            name: displayName,
            email: normalizedEmail,
            password: password || 'Demo@123',
            role,
          });

          if (role === 'STUDENT') {
            const studentId = 'STU-' + Math.floor(1000 + Math.random() * 9000);
            await Student.create({
              user: user._id,
              studentId,
              name: displayName,
              email: normalizedEmail,
              phone: '9876543210',
              gender: 'Other',
              department: 'CSE',
              year: 1,
              address: 'Campus Hostel',
              guardianName: 'Guardian',
              guardianPhone: '9876543211',
            });
          }
        }

        let studentProfile: any = null;
        if (user.role === 'STUDENT') {
          studentProfile = await Student.findOne({ user: user._id }).populate('room');
        }

        const payload: AuthUserPayload = {
          userId: user._id.toString(),
          email: user.email,
          role: user.role,
          name: user.name,
          studentId: studentProfile ? studentProfile.studentId : undefined,
        };

        const token = this.generateToken(payload);

        return {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            studentId: studentProfile ? studentProfile.studentId : undefined,
            studentProfileId: studentProfile ? studentProfile._id : undefined,
            room: studentProfile?.room || null,
          },
        };
      } catch (dbErr) {
        console.warn('[AuthService] DB query failed, falling back to instant demo auth:', dbErr);
      }
    }

    // 2. Demo / Fallback Mode: Accept ANY email without needing MongoDB
    const inMemUser = inMemoryStore.findUserByEmail(normalizedEmail);
    const userId = inMemUser ? inMemUser.id : `demo_${Buffer.from(normalizedEmail).toString('hex').slice(0, 10)}`;
    const userRole = inMemUser ? inMemUser.role : role;
    const userName = inMemUser ? inMemUser.name : displayName;

    let studentId: string | undefined = undefined;
    let studentProfileId: string | undefined = undefined;
    let room: any = null;

    if (userRole === 'STUDENT') {
      const inMemStudent = inMemoryStore.findStudentByUserOrEmail(userId, normalizedEmail);
      if (inMemStudent) {
        studentId = inMemStudent.studentId;
        studentProfileId = inMemStudent._id;
        room = inMemStudent.room || null;
      } else {
        studentId = 'STU-' + Math.floor(1000 + Math.random() * 9000);
        studentProfileId = `profile_${userId}`;
        room = {
          _id: 'room-1',
          roomNumber: 'A-101',
          block: 'A',
          floor: 1,
          roomType: 'Single',
          capacity: 1,
        };
      }
    }

    const payload: AuthUserPayload = {
      userId,
      email: normalizedEmail,
      role: userRole,
      name: userName,
      studentId,
    };

    const token = this.generateToken(payload);

    return {
      token,
      user: {
        id: userId,
        name: userName,
        email: normalizedEmail,
        role: userRole,
        studentId,
        studentProfileId,
        room,
      },
    };
  }

  static async getMe(userId: string, decodedUser?: AuthUserPayload): Promise<any> {
    if (mongoose.connection.readyState === 1 && !userId.startsWith('demo_')) {
      try {
        const user = await User.findById(userId);
        if (user) {
          let studentProfile = null;
          if (user.role === 'STUDENT') {
            studentProfile = await Student.findOne({ user: user._id }).populate('room');
          }
          return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            studentProfile,
          };
        }
      } catch (err) {
        console.warn('[AuthService] getMe DB error, fallback to memory:', err);
      }
    }

    const inMemUser = inMemoryStore.findUserById(userId);
    const role = inMemUser?.role || decodedUser?.role || 'ADMIN';
    const email = inMemUser?.email || decodedUser?.email || 'admin@hostel.com';
    const name = inMemUser?.name || decodedUser?.name || 'Demo User';

    let studentProfile = null;
    if (role === 'STUDENT') {
      const inMemStudent = inMemoryStore.findStudentByUserOrEmail(userId, email);
      studentProfile = inMemStudent || {
        _id: `profile_${userId}`,
        studentId: decodedUser?.studentId || 'STU-1001',
        name,
        email,
        phone: '9876543210',
        gender: 'Other',
        department: 'CSE',
        year: 2,
        address: 'Campus Hostel',
        guardianName: 'Guardian',
        guardianPhone: '9876543211',
        room: {
          _id: 'room-1',
          roomNumber: 'A-101',
          block: 'A',
          floor: 1,
          roomType: 'Single',
          capacity: 1,
        },
      };
    }

    return {
      id: userId,
      name,
      email,
      role,
      studentProfile,
    };
  }
}
