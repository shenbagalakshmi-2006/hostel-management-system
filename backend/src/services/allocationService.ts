import { Allocation, IAllocation } from '../models/Allocation.js';
import { Student } from '../models/Student.js';
import { Room } from '../models/Room.js';

export class AllocationService {
  static async getAllAllocations(filters: { status?: 'ACTIVE' | 'VACATED'; search?: string }) {
    const query: any = {};
    if (filters.status) {
      query.status = filters.status;
    }

    const allocations = await Allocation.find(query)
      .populate({
        path: 'student',
        select: 'studentId name email department year phone gender',
      })
      .populate({
        path: 'room',
        select: 'roomNumber block floor roomType capacity occupiedCount availableBeds status',
      })
      .sort({ createdAt: -1 });

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return allocations.filter((alloc: any) => {
        const studentName = alloc.student?.name?.toLowerCase() || '';
        const studentId = alloc.student?.studentId?.toLowerCase() || '';
        const roomNumber = alloc.room?.roomNumber?.toLowerCase() || '';
        const block = alloc.room?.block?.toLowerCase() || '';
        return (
          studentName.includes(searchLower) ||
          studentId.includes(searchLower) ||
          roomNumber.includes(searchLower) ||
          block.includes(searchLower)
        );
      });
    }

    return allocations;
  }

  static async allocateRoom(studentId: string, roomId: string, notes?: string) {
    // 1. Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    // 2. Check if student already has an active allocation
    const existingActiveAllocation = await Allocation.findOne({
      student: student._id,
      status: 'ACTIVE',
    });

    if (existingActiveAllocation || student.room) {
      throw new Error('Student already has an active room allocation. Please vacate or reassign.');
    }

    // 3. Verify room exists
    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    // 4. Verify room is available
    if (room.status === 'MAINTENANCE') {
      throw new Error('This room is currently under maintenance and cannot accept allocations');
    }

    if (room.occupiedCount >= room.capacity) {
      throw new Error('This room is already at full capacity');
    }

    // 5. Create Allocation record
    const allocation = new Allocation({
      student: student._id,
      room: room._id,
      allocatedAt: new Date(),
      status: 'ACTIVE',
      notes,
    });
    await allocation.save();

    // 6. Update room occupancy & beds
    room.occupiedCount += 1;
    await room.save(); // pre-save hook recalculates availableBeds and status

    // 7. Update student's room reference
    student.room = room._id;
    await student.save();

    return {
      allocation,
      student,
      room,
    };
  }

  static async vacateAllocation(allocationId: string) {
    const allocation = await Allocation.findById(allocationId);
    if (!allocation) {
      throw new Error('Allocation record not found');
    }

    if (allocation.status === 'VACATED') {
      throw new Error('This allocation is already vacated');
    }

    // Mark allocation vacated
    allocation.status = 'VACATED';
    allocation.vacatedAt = new Date();
    await allocation.save();

    // Update room
    const room = await Room.findById(allocation.room);
    if (room) {
      if (room.occupiedCount > 0) {
        room.occupiedCount -= 1;
      }
      await room.save();
    }

    // Update student
    const student = await Student.findById(allocation.student);
    if (student) {
      student.room = null;
      await student.save();
    }

    return {
      message: 'Room vacated successfully',
      allocation,
      room,
    };
  }

  static async reassignRoom(allocationId: string, newRoomId: string, notes?: string) {
    const currentAllocation = await Allocation.findById(allocationId);
    if (!currentAllocation || currentAllocation.status !== 'ACTIVE') {
      throw new Error('Active allocation not found for reassignment');
    }

    const studentId = currentAllocation.student.toString();

    // 1. Vacate current room
    await this.vacateAllocation(allocationId);

    // 2. Allocate to new room
    const newAllocationResult = await this.allocateRoom(studentId, newRoomId, notes || 'Reassigned');

    return newAllocationResult;
  }
}
