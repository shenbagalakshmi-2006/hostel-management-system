import { Student } from '../models/Student.js';
import { Room } from '../models/Room.js';
import { Complaint } from '../models/Complaint.js';
import { Allocation } from '../models/Allocation.js';

export class DashboardService {
  static async getStats() {
    const totalStudents = await Student.countDocuments();
    const totalRooms = await Room.countDocuments();

    // Aggregations on Room collection for beds & capacity
    const roomStats = await Room.aggregate([
      {
        $group: {
          _id: null,
          totalCapacity: { $sum: '$capacity' },
          occupiedBeds: { $sum: '$occupiedCount' },
          availableBeds: { $sum: '$availableBeds' },
        },
      },
    ]);

    const totalCapacity = roomStats[0]?.totalCapacity || 0;
    const occupiedBeds = roomStats[0]?.occupiedBeds || 0;
    const availableBeds = roomStats[0]?.availableBeds || 0;
    const occupancyPercentage =
      totalCapacity > 0 ? Math.round((occupiedBeds / totalCapacity) * 100) : 0;

    // Complaints counts by status
    const pendingComplaints = await Complaint.countDocuments({ status: 'PENDING' });
    const inProgressComplaints = await Complaint.countDocuments({ status: 'IN_PROGRESS' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'RESOLVED' });
    const totalComplaints = pendingComplaints + inProgressComplaints + resolvedComplaints;

    // Complaint breakdown by category
    const complaintsByCategory = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Room breakdown by block
    const roomsByBlock = await Room.aggregate([
      {
        $group: {
          _id: '$block',
          rooms: { $sum: 1 },
          capacity: { $sum: '$capacity' },
          occupied: { $sum: '$occupiedCount' },
          available: { $sum: '$availableBeds' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Recent Allocations
    const recentAllocations = await Allocation.find()
      .populate('student', 'name studentId department')
      .populate('room', 'roomNumber block floor roomType')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent Complaints
    const recentComplaints = await Complaint.find()
      .populate('student', 'name studentId')
      .sort({ createdAt: -1 })
      .limit(5);

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
      complaintsByCategory: complaintsByCategory.map((c) => ({
        category: c._id,
        count: c.count,
      })),
      roomsByBlock: roomsByBlock.map((b) => ({
        block: b._id,
        rooms: b.rooms,
        capacity: b.capacity,
        occupied: b.occupied,
        available: b.available,
      })),
      recentAllocations,
      recentComplaints,
    };
  }
}
