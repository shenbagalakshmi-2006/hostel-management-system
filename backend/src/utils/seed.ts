import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Student } from '../models/Student.js';
import { Room } from '../models/Room.js';
import { Allocation } from '../models/Allocation.js';
import { Complaint } from '../models/Complaint.js';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hostel_management';

export const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to database...');
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected. Clearing existing collections...');

    // Clear old data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Room.deleteMany({});
    await Allocation.deleteMany({});
    await Complaint.deleteMany({});

    console.log('[Seed] Creating Admin Warden account...');
    const adminUser = await User.create({
      name: 'Admin Warden',
      email: 'admin@hostel.com',
      password: 'Admin@123',
      role: 'ADMIN',
    });

    console.log('[Seed] Creating Rooms...');
    const roomData = [
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

    const createdRooms: any[] = [];
    for (const r of roomData) {
      const room = await Room.create({
        ...r,
        occupiedCount: 0,
        availableBeds: r.capacity,
        status: 'AVAILABLE',
      });
      createdRooms.push(room);
    }

    console.log('[Seed] Creating Students...');
    const rawStudents = [
      {
        studentId: 'STU001',
        name: 'Rahul Kumar',
        email: 'rahul.kumar@hostel.com',
        phone: '9876543210',
        gender: 'Male',
        department: 'CSE',
        year: 3,
        address: '12 Green Park, New Delhi',
        guardianName: 'Ramesh Kumar',
        guardianPhone: '9876543219',
      },
      {
        studentId: 'STU002',
        name: 'Priya Sharma',
        email: 'priya.sharma@hostel.com',
        phone: '9876543211',
        gender: 'Female',
        department: 'IT',
        year: 2,
        address: '45 Lake View, Bangalore',
        guardianName: 'Suresh Sharma',
        guardianPhone: '9876543220',
      },
      {
        studentId: 'STU003',
        name: 'Ankit Verma',
        email: 'ankit.verma@hostel.com',
        phone: '9876543212',
        gender: 'Male',
        department: 'ECE',
        year: 4,
        address: '78 Civil Lines, Jaipur',
        guardianName: 'Mahesh Verma',
        guardianPhone: '9876543221',
      },
      {
        studentId: 'STU004',
        name: 'Sneha Patel',
        email: 'sneha.patel@hostel.com',
        phone: '9876543213',
        gender: 'Female',
        department: 'CSE',
        year: 1,
        address: '90 Ring Road, Ahmedabad',
        guardianName: 'Dinesh Patel',
        guardianPhone: '9876543222',
      },
      {
        studentId: 'STU005',
        name: 'Vikram Singh',
        email: 'vikram.singh@hostel.com',
        phone: '9876543214',
        gender: 'Male',
        department: 'MECH',
        year: 3,
        address: '15 Sector 14, Chandigarh',
        guardianName: 'Balwant Singh',
        guardianPhone: '9876543223',
      },
      {
        studentId: 'STU006',
        name: 'Divya Nair',
        email: 'divya.nair@hostel.com',
        phone: '9876543215',
        gender: 'Female',
        department: 'AI&DS',
        year: 2,
        address: '22 Marine Drive, Kochi',
        guardianName: 'Gopal Nair',
        guardianPhone: '9876543224',
      },
      {
        studentId: 'STU007',
        name: 'Rohan Gupta',
        email: 'rohan.gupta@hostel.com',
        phone: '9876543216',
        gender: 'Male',
        department: 'CSE',
        year: 2,
        address: '67 Gomti Nagar, Lucknow',
        guardianName: 'Anil Gupta',
        guardianPhone: '9876543225',
      },
      {
        studentId: 'STU008',
        name: 'Ananya Roy',
        email: 'ananya.roy@hostel.com',
        phone: '9876543217',
        gender: 'Female',
        department: 'IT',
        year: 3,
        address: '33 Salt Lake, Kolkata',
        guardianName: 'Subhas Roy',
        guardianPhone: '9876543226',
      },
      {
        studentId: 'STU009',
        name: 'Karthik Raja',
        email: 'karthik.raja@hostel.com',
        phone: '9876543218',
        gender: 'Male',
        department: 'ECE',
        year: 4,
        address: '89 Anna Nagar, Chennai',
        guardianName: 'Rajarathinam S',
        guardianPhone: '9876543227',
      },
      {
        studentId: 'STU010',
        name: 'Meera Iyer',
        email: 'meera.iyer@hostel.com',
        phone: '9876543228',
        gender: 'Female',
        department: 'AI&DS',
        year: 1,
        address: '54 Malleshwaram, Bangalore',
        guardianName: 'Venkatesh Iyer',
        guardianPhone: '9876543229',
      },
    ];

    const createdStudents: any[] = [];
    for (const s of rawStudents) {
      const user = await User.create({
        name: s.name,
        email: s.email,
        password: 'Student@123',
        role: 'STUDENT',
      });

      const student = await Student.create({
        user: user._id,
        studentId: s.studentId,
        name: s.name,
        email: s.email,
        phone: s.phone,
        gender: s.gender,
        dateOfBirth: new Date(2003, 4, 15),
        department: s.department,
        year: s.year,
        address: s.address,
        guardianName: s.guardianName,
        guardianPhone: s.guardianPhone,
        room: null,
      });

      createdStudents.push(student);
    }

    console.log('[Seed] Allocating initial rooms...');
    // Allocations:
    // Student 0 (Rahul Kumar) -> Room 0 (A-101, Single) -> Full
    // Student 1 (Priya Sharma) -> Room 7 (B-101, Single) -> Full
    // Student 2 (Ankit Verma) -> Room 1 (A-102, Double) -> Partially Occupied
    // Student 4 (Vikram Singh) -> Room 1 (A-102, Double) -> Full
    // Student 6 (Rohan Gupta) -> Room 4 (A-201, Four Sharing) -> Partially Occupied
    // Student 7 (Ananya Roy) -> Room 9 (B-103, Triple) -> Partially Occupied

    const allocationsToMake = [
      { studentIdx: 0, roomIdx: 0, notes: 'Allocated during semester registration' },
      { studentIdx: 1, roomIdx: 7, notes: 'Special medical single room request' },
      { studentIdx: 2, roomIdx: 1, notes: 'Standard room allocation' },
      { studentIdx: 4, roomIdx: 1, notes: 'Standard room allocation' },
      { studentIdx: 6, roomIdx: 4, notes: 'Four sharing room wing A' },
      { studentIdx: 7, roomIdx: 9, notes: 'Three sharing room wing B' },
    ];

    for (const alloc of allocationsToMake) {
      const st = createdStudents[alloc.studentIdx];
      const rm = createdRooms[alloc.roomIdx];

      await Allocation.create({
        student: st._id,
        room: rm._id,
        allocatedAt: new Date(),
        status: 'ACTIVE',
        notes: alloc.notes,
      });

      rm.occupiedCount += 1;
      await rm.save();

      st.room = rm._id;
      await st.save();
    }

    console.log('[Seed] Creating Sample Complaints...');
    const complaintsData = [
      {
        complaintId: 'CMP-0001',
        studentIdx: 0, // Rahul Kumar
        category: 'Electrical',
        priority: 'HIGH',
        description: 'Ceiling fan regulator is making a sparking noise in room A-101.',
        status: 'IN_PROGRESS',
        adminRemarks: 'Electrician Mr. Rajesh assigned. Scheduled for repair tomorrow morning.',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        complaintId: 'CMP-0002',
        studentIdx: 1, // Priya Sharma
        category: 'Internet',
        priority: 'MEDIUM',
        description: 'Wi-Fi access point in corridor 1st Floor Block B drops connection frequently.',
        status: 'RESOLVED',
        adminRemarks: 'Router rebooted and firmware updated. Verified signal strength.',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        complaintId: 'CMP-0003',
        studentIdx: 2, // Ankit Verma
        category: 'Plumbing',
        priority: 'URGENT',
        description: 'Water tap leaking continuously in bathroom adjoining A-102.',
        status: 'PENDING',
        adminRemarks: '',
        date: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
      {
        complaintId: 'CMP-0004',
        studentIdx: 6, // Rohan Gupta
        category: 'Cleanliness',
        priority: 'LOW',
        description: 'Dustbin in Room A-201 needs replacement.',
        status: 'PENDING',
        adminRemarks: '',
        date: new Date(),
      },
      {
        complaintId: 'CMP-0005',
        studentIdx: 7, // Ananya Roy
        category: 'Food',
        priority: 'MEDIUM',
        description: 'Request for hot water facility during dinner time in mess hall.',
        status: 'RESOLVED',
        adminRemarks: 'Hot water dispenser installed in Dining Hall B.',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ];

    for (const c of complaintsData) {
      await Complaint.create({
        complaintId: c.complaintId,
        student: createdStudents[c.studentIdx]._id,
        category: c.category,
        priority: c.priority,
        description: c.description,
        status: c.status,
        adminRemarks: c.adminRemarks,
        date: c.date,
        resolvedAt: c.status === 'RESOLVED' ? new Date() : null,
      });
    }

    console.log('----------------------------------------------------');
    console.log('✅ Database seeded successfully!');
    console.log('👤 Admin Account:');
    console.log('   Email:    admin@hostel.com');
    console.log('   Password: Admin@123');
    console.log('   Role:     ADMIN');
    console.log('');
    console.log('🎓 Sample Student Accounts:');
    console.log('   1. rahul.kumar@hostel.com / Student@123 (Room A-101, Single)');
    console.log('   2. priya.sharma@hostel.com / Student@123 (Room B-101, Single)');
    console.log('   3. ankit.verma@hostel.com  / Student@123 (Room A-102, Double)');
    console.log('   4. sneha.patel@hostel.com  / Student@123 (Unallocated)');
    console.log('----------------------------------------------------');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error] Failed to seed database:', err);
    process.exit(1);
  }
};

// If run directly
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedDatabase();
}
