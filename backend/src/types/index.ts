import { Request } from 'express';

export type UserRole = 'ADMIN' | 'STUDENT';

export type RoomType = 'Single' | 'Double' | 'Triple' | 'Four Sharing';

export type RoomStatus = 'AVAILABLE' | 'PARTIALLY_OCCUPIED' | 'FULL' | 'MAINTENANCE';

export type AllocationStatus = 'ACTIVE' | 'VACATED';

export type ComplaintCategory =
  | 'Electrical'
  | 'Plumbing'
  | 'Cleanliness'
  | 'Food'
  | 'Internet'
  | 'Room'
  | 'Security'
  | 'Maintenance'
  | 'Other';

export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ComplaintStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';

export interface AuthUserPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
  studentId?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}
