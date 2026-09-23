export interface InMemUser {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'STUDENT';
  password?: string;
}

export interface InMemRoom {
  _id: string;
  roomNumber: string;
  block: string;
  floor: number;
  roomType: string;
  capacity: number;
  occupiedCount: number;
  availableBeds: number;
  status: string;
}

export interface InMemStudent {
  _id: string;
  user?: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  department: string;
  year: number;
  address: string;
  guardianName: string;
  guardianPhone: string;
  room?: any;
  createdAt: string;
}

export interface InMemComplaint {
  _id: string;
  complaintId: string;
  student: any;
  category: string;
  priority: string;
  description: string;
  status: string;
  adminRemarks?: string;
  date: string;
  createdAt: string;
}

export interface InMemAllocation {
  _id: string;
  student: any;
  room: any;
  allocatedAt: string;
  vacatedAt?: string;
  status: 'ACTIVE' | 'VACATED';
  notes?: string;
  createdAt: string;
}

class InMemoryStore {
  users: InMemUser[] = [];
  rooms: InMemRoom[] = [];
  students: InMemStudent[] = [];
  complaints: InMemComplaint[] = [];
  allocations: InMemAllocation[] = [];

  constructor() {
    this.seed();
  }

  seed() {
    // 1. Admin
    this.users = [
      {
        id: 'user-admin-01',
        _id: 'user-admin-01',
        name: 'Admin Warden',
        email: 'admin@hostel.com',
        role: 'ADMIN',
      },
    ];

    // 2. Rooms
    const roomDefs = [
      { roomNumber: 'A-101', block: 'A', floor: 1, roomType: 'Single', capacity: 1 },
      { roomNumber: 'A-102', block: 'A', floor: 1, roomType: 'Double', capacity: 2 },
      { roomNumber: 'A-103', block: 'A', floor: 1, roomType: 'Double', capacity: 2 },
      { roomNumber: 'A-104', block: 'A', floor: 1, roomType: 'Triple', capacity: 3 },
      { roomNumber: 'A-201', block: 'A', floor: 2, roomType: 'Four Sharing', capacity: 4 },
      { roomNumber: 'A-202', block: 'A', floor: 2, roomType: 'Double', capacity: 2 },
      { roomNumber: 'A-203', block: 'A', floor: 2, roomType: 'Single', capacity: 1 },
      { roomNumber: 'B-101', block: 'B', floor: 1, roomType: 'Single', capacity: 1 },
      { roomNumber: 'B-102', block: 'B', floor: 1, roomType: 'Double', capacity: 2 },
      { roomNumber: 'B-103', block: 'B', floor: 1, roomType: 'Triple', capacity: 3 },
      { roomNumber: 'B-201', block: 'B', floor: 2, roomType: 'Double', capacity: 2 },
      { roomNumber: 'B-202', block: 'B', floor: 2, roomType: 'Four Sharing', capacity: 4 },
    ];

    this.rooms = roomDefs.map((r, idx) => ({
      _id: `room-${idx + 1}`,
      ...r,
      occupiedCount: 0,
      availableBeds: r.capacity,
      status: 'AVAILABLE',
    }));

    // 3. Students
    const studentDefs = [
      { studentId: 'STU001', name: 'Rahul Kumar', email: 'rahul.kumar@hostel.com', phone: '9876543210', gender: 'Male', department: 'CSE', year: 3, address: '12 Green Park, New Delhi', guardianName: 'Ramesh Kumar', guardianPhone: '9876543219' },
      { studentId: 'STU002', name: 'Priya Sharma', email: 'priya.sharma@hostel.com', phone: '9876543211', gender: 'Female', department: 'IT', year: 2, address: '45 Lake View, Bangalore', guardianName: 'Suresh Sharma', guardianPhone: '9876543220' },
      { studentId: 'STU003', name: 'Ankit Verma', email: 'ankit.verma@hostel.com', phone: '9876543212', gender: 'Male', department: 'ECE', year: 4, address: '78 Civil Lines, Jaipur', guardianName: 'Mahesh Verma', guardianPhone: '9876543221' },
      { studentId: 'STU004', name: 'Sneha Patel', email: 'sneha.patel@hostel.com', phone: '9876543213', gender: 'Female', department: 'CSE', year: 1, address: '90 Ring Road, Ahmedabad', guardianName: 'Dinesh Patel', guardianPhone: '9876543222' },
      { studentId: 'STU005', name: 'Vikram Singh', email: 'vikram.singh@hostel.com', phone: '9876543214', gender: 'Male', department: 'MECH', year: 3, address: '15 Sector 14, Chandigarh', guardianName: 'Balwant Singh', guardianPhone: '9876543223' },
      { studentId: 'STU006', name: 'Divya Nair', email: 'divya.nair@hostel.com', phone: '9876543215', gender: 'Female', department: 'AI&DS', year: 2, address: '22 Marine Drive, Kochi', guardianName: 'Gopal Nair', guardianPhone: '9876543224' },
      { studentId: 'STU007', name: 'Rohan Gupta', email: 'rohan.gupta@hostel.com', phone: '9876543216', gender: 'Male', department: 'CSE', year: 2, address: '67 Gomti Nagar, Lucknow', guardianName: 'Anil Gupta', guardianPhone: '9876543225' },
      { studentId: 'STU008', name: 'Ananya Roy', email: 'ananya.roy@hostel.com', phone: '9876543217', gender: 'Female', department: 'IT', year: 3, address: '33 Salt Lake, Kolkata', guardianName: 'Subhas Roy', guardianPhone: '9876543226' },
      { studentId: 'STU009', name: 'Karthik Raja', email: 'karthik.raja@hostel.com', phone: '9876543218', gender: 'Male', department: 'ECE', year: 4, address: '89 Anna Nagar, Chennai', guardianName: 'Rajarathinam S', guardianPhone: '9876543227' },
      { studentId: 'STU010', name: 'Meera Iyer', email: 'meera.iyer@hostel.com', phone: '9876543228', gender: 'Female', department: 'AI&DS', year: 1, address: '54 Malleshwaram, Bangalore', guardianName: 'Venkatesh Iyer', guardianPhone: '9876543229' },
    ];

    this.students = studentDefs.map((s, idx) => {
      const uId = `user-student-${idx + 1}`;
      this.users.push({
        id: uId,
        _id: uId,
        name: s.name,
        email: s.email,
        role: 'STUDENT',
      });

      return {
        _id: `student-${idx + 1}`,
        user: uId,
        ...s,
        room: null,
        createdAt: new Date(Date.now() - (10 - idx) * 86400000).toISOString(),
      };
    });

    // 4. Initial Allocations
    const initialAllocations = [
      { studentIdx: 0, roomIdx: 0, notes: 'Allocated during semester registration' },
      { studentIdx: 1, roomIdx: 7, notes: 'Special single room request' },
      { studentIdx: 2, roomIdx: 1, notes: 'Standard room allocation' },
      { studentIdx: 4, roomIdx: 1, notes: 'Standard room allocation' },
      { studentIdx: 6, roomIdx: 4, notes: 'Four sharing room wing A' },
      { studentIdx: 7, roomIdx: 9, notes: 'Three sharing room wing B' },
    ];

    initialAllocations.forEach((alloc, idx) => {
      const st = this.students[alloc.studentIdx];
      const rm = this.rooms[alloc.roomIdx];
      if (st && rm) {
        rm.occupiedCount += 1;
        rm.availableBeds = rm.capacity - rm.occupiedCount;
        rm.status = rm.availableBeds === 0 ? 'FULL' : 'PARTIALLY_OCCUPIED';
        st.room = { ...rm };

        this.allocations.push({
          _id: `alloc-${idx + 1}`,
          student: {
            _id: st._id,
            name: st.name,
            studentId: st.studentId,
            department: st.department,
          },
          room: {
            _id: rm._id,
            roomNumber: rm.roomNumber,
            block: rm.block,
            floor: rm.floor,
            roomType: rm.roomType,
          },
          allocatedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
          status: 'ACTIVE',
          notes: alloc.notes,
          createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        });
      }
    });

    // 5. Complaints
    const complaintDefs = [
      {
        complaintId: 'CMP-0001',
        studentIdx: 0,
        category: 'Electrical',
        priority: 'HIGH',
        description: 'Ceiling fan regulator is making a sparking noise in room A-101.',
        status: 'IN_PROGRESS',
        adminRemarks: 'Electrician Mr. Rajesh assigned. Scheduled for repair tomorrow morning.',
        daysAgo: 2,
      },
      {
        complaintId: 'CMP-0002',
        studentIdx: 1,
        category: 'Internet',
        priority: 'MEDIUM',
        description: 'Wi-Fi access point in corridor 1st Floor Block B drops connection frequently.',
        status: 'RESOLVED',
        adminRemarks: 'Router rebooted and firmware updated. Signal verified.',
        daysAgo: 4,
      },
      {
        complaintId: 'CMP-0003',
        studentIdx: 2,
        category: 'Plumbing',
        priority: 'URGENT',
        description: 'Water tap leaking continuously in bathroom adjoining A-102.',
        status: 'PENDING',
        adminRemarks: '',
        daysAgo: 1,
      },
      {
        complaintId: 'CMP-0004',
        studentIdx: 6,
        category: 'Cleanliness',
        priority: 'LOW',
        description: 'Dustbin in Room A-201 needs replacement.',
        status: 'PENDING',
        adminRemarks: '',
        daysAgo: 0,
      },
      {
        complaintId: 'CMP-0005',
        studentIdx: 7,
        category: 'Food',
        priority: 'MEDIUM',
        description: 'Request for hot water facility during dinner time in mess hall.',
        status: 'RESOLVED',
        adminRemarks: 'Hot water dispenser installed in Dining Hall B.',
        daysAgo: 7,
      },
    ];

    this.complaints = complaintDefs.map((c, idx) => {
      const st = this.students[c.studentIdx] || this.students[0];
      return {
        _id: `comp-${idx + 1}`,
        complaintId: c.complaintId,
        student: {
          _id: st._id,
          studentId: st.studentId,
          name: st.name,
          email: st.email,
          phone: st.phone,
          department: st.department,
          year: st.year,
          room: st.room,
        },
        category: c.category,
        priority: c.priority,
        description: c.description,
        status: c.status,
        adminRemarks: c.adminRemarks,
        date: new Date(Date.now() - c.daysAgo * 86400000).toISOString(),
        createdAt: new Date(Date.now() - c.daysAgo * 86400000).toISOString(),
      };
    });
  }

  findUserByEmail(email: string): InMemUser | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string): InMemUser | undefined {
    return this.users.find((u) => u.id === id || u._id === id);
  }

  findStudentByUserOrEmail(userId: string, email: string): InMemStudent | undefined {
    return this.students.find(
      (s) => s.user === userId || s.email.toLowerCase() === email.toLowerCase() || s._id === userId
    );
  }

  getDashboardStats() {
    const totalStudents = this.students.length;
    const totalRooms = this.rooms.length;
    const totalCapacity = this.rooms.reduce((acc, r) => acc + r.capacity, 0);
    const occupiedBeds = this.rooms.reduce((acc, r) => acc + r.occupiedCount, 0);
    const availableBeds = this.rooms.reduce((acc, r) => acc + r.availableBeds, 0);
    const occupancyPercentage =
      totalCapacity > 0 ? Math.round((occupiedBeds / totalCapacity) * 100) : 0;

    const pendingComplaints = this.complaints.filter((c) => c.status === 'PENDING').length;
    const inProgressComplaints = this.complaints.filter((c) => c.status === 'IN_PROGRESS').length;
    const resolvedComplaints = this.complaints.filter((c) => c.status === 'RESOLVED').length;
    const totalComplaints = this.complaints.length;

    // Complaints by category
    const catMap: Record<string, number> = {};
    this.complaints.forEach((c) => {
      catMap[c.category] = (catMap[c.category] || 0) + 1;
    });
    const complaintsByCategory = Object.entries(catMap).map(([category, count]) => ({
      category,
      count,
    }));

    // Rooms by block
    const blockMap: Record<string, { rooms: number; capacity: number; occupied: number; available: number }> = {};
    this.rooms.forEach((r) => {
      if (!blockMap[r.block]) {
        blockMap[r.block] = { rooms: 0, capacity: 0, occupied: 0, available: 0 };
      }
      blockMap[r.block].rooms += 1;
      blockMap[r.block].capacity += r.capacity;
      blockMap[r.block].occupied += r.occupiedCount;
      blockMap[r.block].available += r.availableBeds;
    });
    const roomsByBlock = Object.entries(blockMap).map(([block, stats]) => ({
      block,
      ...stats,
    }));

    return {
      totalStudents,
      totalRooms,
      availableBeds,
      occupiedBeds,
      totalCapacity,
      occupancyPercentage,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      totalComplaints,
      complaintsByCategory,
      roomsByBlock,
      recentAllocations: this.allocations.slice(-5).reverse(),
      recentComplaints: this.complaints.slice(-5).reverse(),
    };
  }
}

export const inMemoryStore = new InMemoryStore();
