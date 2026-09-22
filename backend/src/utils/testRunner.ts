import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Student } from '../models/Student.js';
import { Room } from '../models/Room.js';
import { AllocationService } from '../services/allocationService.js';
import { AuthService } from '../services/authService.js';
import { ComplaintService } from '../services/complaintService.js';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hostel_management_test';

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING HOSTEL MANAGEMENT SYSTEM BUSINESS LOGIC TESTS');
  console.log('====================================================');

  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, testName: string) => {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  };

  try {
    await mongoose.connect(mongoUri);
    console.log('[Test DB] Connected to test database.');

    // Clean test db
    await mongoose.connection.dropDatabase();

    // TEST 1: User authentication and password hashing
    console.log('\n--- Test Suite 1: Authentication & Password Security ---');
    const user = await User.create({
      name: 'Test Admin',
      email: 'testadmin@hostel.com',
      password: 'AdminPassword123',
      role: 'ADMIN',
    });

    assert(user.password !== 'AdminPassword123', 'Password must be hashed with bcrypt');
    const isCorrect = await user.comparePassword('AdminPassword123');
    const isWrong = await user.comparePassword('WrongPassword');
    assert(isCorrect === true, 'comparePassword validates correct password');
    assert(isWrong === false, 'comparePassword rejects incorrect password');

    const authResult = await AuthService.login('testadmin@hostel.com', 'AdminPassword123');
    assert(!!authResult.token, 'AuthService.login returns valid JWT token');
    assert(authResult.user.email === 'testadmin@hostel.com', 'AuthService.login returns correct user');

    // TEST 2: Room Capacity & Status Auto-Calculation
    console.log('\n--- Test Suite 2: Room Model & Bed Calculations ---');
    const singleRoom = await Room.create({
      roomNumber: 'T-101',
      block: 'T',
      floor: 1,
      roomType: 'Single',
      capacity: 1,
    });
    assert(singleRoom.availableBeds === 1, 'New room availableBeds equals capacity');
    assert(singleRoom.status === 'AVAILABLE', 'New room status defaults to AVAILABLE');

    const doubleRoom = await Room.create({
      roomNumber: 'T-102',
      block: 'T',
      floor: 1,
      roomType: 'Double',
      capacity: 2,
    });
    assert(doubleRoom.availableBeds === 2, 'Double room initializes with 2 available beds');

    // TEST 3: Student Creation & User Pairing
    console.log('\n--- Test Suite 3: Student Profile Creation ---');
    const stuUser1 = await User.create({
      name: 'Test Student 1',
      email: 'stu1@hostel.com',
      password: 'Student@123',
      role: 'STUDENT',
    });

    const student1 = await Student.create({
      user: stuUser1._id,
      studentId: 'TST001',
      name: 'Test Student 1',
      email: 'stu1@hostel.com',
      phone: '9998887771',
      gender: 'Male',
      department: 'CSE',
      year: 2,
      address: 'Test Address 1',
      guardianName: 'Guardian 1',
      guardianPhone: '9998887770',
    });
    assert(student1.studentId === 'TST001', 'Student created with unique studentId');

    const stuUser2 = await User.create({
      name: 'Test Student 2',
      email: 'stu2@hostel.com',
      password: 'Student@123',
      role: 'STUDENT',
    });

    const student2 = await Student.create({
      user: stuUser2._id,
      studentId: 'TST002',
      name: 'Test Student 2',
      email: 'stu2@hostel.com',
      phone: '9998887772',
      gender: 'Female',
      department: 'IT',
      year: 3,
      address: 'Test Address 2',
      guardianName: 'Guardian 2',
      guardianPhone: '9998887773',
    });

    // TEST 4: Room Allocation Business Logic
    console.log('\n--- Test Suite 4: Room Allocation Workflow ---');
    const alloc1 = await AllocationService.allocateRoom(
      student1._id.toString(),
      singleRoom._id.toString(),
      'First allocation'
    );

    assert(alloc1.allocation.status === 'ACTIVE', 'Allocation status is ACTIVE');
    assert(alloc1.room.occupiedCount === 1, 'Room occupiedCount incremented to 1');
    assert(alloc1.room.availableBeds === 0, 'Room availableBeds decremented to 0');
    assert(alloc1.room.status === 'FULL', 'Room status updated to FULL when full');

    // Verify student cannot have two active allocations
    let doubleAllocError = false;
    try {
      await AllocationService.allocateRoom(
        student1._id.toString(),
        doubleRoom._id.toString()
      );
    } catch (e: any) {
      doubleAllocError = true;
    }
    assert(doubleAllocError, 'Prevent allocating student who already has an active room');

    // Verify full room cannot accept another student
    let fullRoomError = false;
    try {
      await AllocationService.allocateRoom(
        student2._id.toString(),
        singleRoom._id.toString()
      );
    } catch (e: any) {
      fullRoomError = true;
    }
    assert(fullRoomError, 'Prevent allocating to a FULL room');

    // TEST 5: Room Vacating Business Logic
    console.log('\n--- Test Suite 5: Room Vacating Workflow ---');
    const vacateRes = await AllocationService.vacateAllocation(
      alloc1.allocation._id.toString()
    );
    assert(vacateRes.allocation.status === 'VACATED', 'Allocation marked as VACATED');
    assert(vacateRes.room?.occupiedCount === 0, 'Room occupiedCount reduced to 0');
    assert(vacateRes.room?.availableBeds === 1, 'Room availableBeds recovered to 1');
    assert(vacateRes.room?.status === 'AVAILABLE', 'Room status reverted to AVAILABLE');

    const updatedStudent1 = await Student.findById(student1._id);
    assert(updatedStudent1?.room === null, 'Student active room reference cleared upon vacating');

    // TEST 6: Complaints Workflow
    console.log('\n--- Test Suite 6: Complaints Workflow ---');
    const complaint = await ComplaintService.createComplaint({
      studentId: student1._id.toString(),
      category: 'Electrical',
      priority: 'HIGH',
      description: 'Air conditioner not working in test room',
    });

    assert(complaint.complaintId.startsWith('CMP-'), 'Complaint ID formatted properly (CMP-xxxx)');
    assert(complaint.status === 'PENDING', 'New complaint defaults to PENDING');

    const updatedComplaint = await ComplaintService.updateComplaint(
      complaint._id.toString(),
      {
        status: 'RESOLVED',
        adminRemarks: 'Repaired by technician',
      }
    );
    assert(updatedComplaint.status === 'RESOLVED', 'Complaint status updated to RESOLVED');
    assert(updatedComplaint.adminRemarks === 'Repaired by technician', 'Admin remarks recorded');

    // Clean test db and exit
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();

    console.log('\n====================================================');
    console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================');

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
