import mongoose, { Document, Schema, Types } from 'mongoose';
import { AllocationStatus } from '../types/index.js';

export interface IAllocation extends Document {
  student: Types.ObjectId;
  room: Types.ObjectId;
  allocatedAt: Date;
  vacatedAt?: Date | null;
  status: AllocationStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const allocationSchema = new Schema<IAllocation>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student is required for allocation'],
      index: true,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Room is required for allocation'],
      index: true,
    },
    allocatedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    vacatedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'VACATED'],
      default: 'ACTIVE',
      index: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Allocation = mongoose.model<IAllocation>('Allocation', allocationSchema);
