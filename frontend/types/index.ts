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

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  studentProfileId?: string;
  room?: Room | null;
}

export interface Student {
  _id: string;
  id?: string;
  user: string | { _id: string; email: string; role: string; name: string };
  studentId: string;
  name: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth?: string;
  department: string;
  year: number;
  address: string;
  guardianName: string;
  guardianPhone: string;
  room?: Room | string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  _id: string;
  id?: string;
  roomNumber: string;
  block: string;
  floor: number;
  roomType: RoomType;
  capacity: number;
  occupiedCount: number;
  availableBeds: number;
  status: RoomStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Allocation {
  _id: string;
  id?: string;
  student: Student;
  room: Room;
  allocatedAt: string;
  vacatedAt?: string | null;
  status: AllocationStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Complaint {
  _id: string;
  id?: string;
  complaintId: string;
  student: Student | { _id: string; name: string; studentId: string; room?: Room };
  category: ComplaintCategory;
  description: string;
  date: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  adminRemarks?: string;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalRooms: number;
  availableBeds: number;
  occupiedBeds: number;
  totalCapacity: number;
  occupancyPercentage: number;
  pendingComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  totalComplaints: number;
  complaintsByCategory: { category: string; count: number }[];
  roomsByBlock: {
    block: string;
    rooms: number;
    capacity: number;
    occupied: number;
    available: number;
  }[];
  recentAllocations: Allocation[];
  recentComplaints: Complaint[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
