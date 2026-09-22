import { Room, IRoom } from '../models/Room.js';
import { Student } from '../models/Student.js';
import { Allocation } from '../models/Allocation.js';
import { RoomStatus, RoomType } from '../types/index.js';

export interface RoomFilters {
  search?: string;
  status?: RoomStatus;
  block?: string;
  floor?: number;
  roomType?: RoomType;
  availableOnly?: boolean;
}

export class RoomService {
  static async getAllRooms(filters: RoomFilters) {
    const { search, status, block, floor, roomType, availableOnly } = filters;
    const query: any = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { roomNumber: searchRegex },
        { block: searchRegex },
      ];
    }

    if (status) {
      query.status = status;
    }

    if (block) {
      query.block = block.toUpperCase();
    }

    if (floor !== undefined && floor !== null && !isNaN(Number(floor))) {
      query.floor = Number(floor);
    }

    if (roomType) {
      query.roomType = roomType;
    }

    if (availableOnly) {
      query.availableBeds = { $gt: 0 };
      query.status = { $ne: 'MAINTENANCE' };
    }

    const rooms = await Room.find(query).sort({ block: 1, roomNumber: 1 });
    return rooms;
  }

  static async getRoomById(id: string) {
    const room = await Room.findById(id);
    if (!room) {
      throw new Error('Room not found');
    }

    // Get current occupants
    const occupants = await Student.find({ room: room._id }).select(
      'studentId name email phone department year'
    );

    // Get room allocation history
    const allocations = await Allocation.find({ room: room._id })
      .populate('student', 'name studentId department')
      .sort({ allocatedAt: -1 });

    return {
      room,
      occupants,
      allocations,
    };
  }

  static async createRoom(data: {
    roomNumber: string;
    block: string;
    floor: number;
    roomType: RoomType;
    capacity: number;
    status?: RoomStatus;
  }) {
    const existing = await Room.findOne({ roomNumber: data.roomNumber.toUpperCase() });
    if (existing) {
      throw new Error(`Room with number ${data.roomNumber} already exists`);
    }

    const room = new Room({
      roomNumber: data.roomNumber.toUpperCase(),
      block: data.block.toUpperCase(),
      floor: data.floor,
      roomType: data.roomType,
      capacity: data.capacity,
      occupiedCount: 0,
      availableBeds: data.capacity,
      status: data.status || 'AVAILABLE',
    });

    await room.save();
    return room;
  }

  static async updateRoom(id: string, updateData: Partial<IRoom>) {
    const room = await Room.findById(id);
    if (!room) {
      throw new Error('Room not found');
    }

    if (updateData.roomNumber && updateData.roomNumber.toUpperCase() !== room.roomNumber) {
      const existing = await Room.findOne({
        roomNumber: updateData.roomNumber.toUpperCase(),
        _id: { $ne: id },
      });
      if (existing) {
        throw new Error(`Room number ${updateData.roomNumber} is already in use`);
      }
      room.roomNumber = updateData.roomNumber.toUpperCase();
    }

    if (updateData.block) room.block = updateData.block.toUpperCase();
    if (updateData.floor !== undefined) room.floor = updateData.floor;
    if (updateData.roomType) room.roomType = updateData.roomType;
    if (updateData.status) room.status = updateData.status;

    if (updateData.capacity !== undefined) {
      if (updateData.capacity < room.occupiedCount) {
        throw new Error(
          `Cannot reduce capacity to ${updateData.capacity}. The room currently has ${room.occupiedCount} occupants.`
        );
      }
      room.capacity = updateData.capacity;
    }

    await room.save();
    return room;
  }

  static async deleteRoom(id: string) {
    const room = await Room.findById(id);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.occupiedCount > 0) {
      throw new Error('Cannot delete room because it currently has active occupants. Please vacate them first.');
    }

    await Allocation.deleteMany({ room: room._id });
    await Room.findByIdAndDelete(id);

    return { message: 'Room deleted successfully' };
  }
}
