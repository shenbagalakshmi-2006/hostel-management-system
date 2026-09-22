import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';
import { Student } from '../models/Student.js';
import { AuthUserPayload } from '../types/index.js';

export class AuthService {
  static generateToken(payload: AuthUserPayload): string {
    const secret = process.env.JWT_SECRET || 'super_secret_hostel_jwt_key_2026_dev_mode';
    const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as any;
    return jwt.sign(payload, secret, { expiresIn });
  }

  static async login(email: string, password: string): Promise<{ token: string; user: any }> {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
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
  }

  static async getMe(userId: string): Promise<any> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

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
}
