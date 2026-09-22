import mongoose, { Document, Schema } from 'mongoose';
import { RoomType, RoomStatus } from '../types/index.js';

export interface IRoom extends Document {
  roomNumber: string;
  block: string;
  floor: number;
  roomType: RoomType;
  capacity: number;
  occupiedCount: number;
  availableBeds: number;
  status: RoomStatus;
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema = new Schema<IRoom>(
  {
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    block: {
      type: String,
      required: [true, 'Block is required'],
      trim: true,
      uppercase: true,
    },
    floor: {
      type: Number,
      required: [true, 'Floor is required'],
      min: [0, 'Floor cannot be negative'],
    },
    roomType: {
      type: String,
      enum: ['Single', 'Double', 'Triple', 'Four Sharing'],
      required: [true, 'Room type is required'],
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    occupiedCount: {
      type: Number,
      default: 0,
      min: [0, 'Occupied count cannot be negative'],
    },
    availableBeds: {
      type: Number,
      default: function (this: IRoom) {
        return this.capacity || 1;
      },
      min: [0, 'Available beds cannot be negative'],
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'PARTIALLY_OCCUPIED', 'FULL', 'MAINTENANCE'],
      default: 'AVAILABLE',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-sync availableBeds and status on save
roomSchema.pre('save', function (next) {
  if (this.occupiedCount > this.capacity) {
    return next(new Error('Occupied count cannot exceed room capacity'));
  }
  this.availableBeds = this.capacity - this.occupiedCount;
  
  if (this.status !== 'MAINTENANCE') {
    if (this.occupiedCount === 0) {
      this.status = 'AVAILABLE';
    } else if (this.occupiedCount >= this.capacity) {
      this.status = 'FULL';
    } else {
      this.status = 'PARTIALLY_OCCUPIED';
    }
  }
  next();
});

export const Room = mongoose.model<IRoom>('Room', roomSchema);
