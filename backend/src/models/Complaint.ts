import mongoose, { Document, Schema, Types } from 'mongoose';
import {
  ComplaintCategory,
  ComplaintPriority,
  ComplaintStatus,
} from '../types/index.js';

export interface IComplaint extends Document {
  complaintId: string;
  student: Types.ObjectId;
  category: ComplaintCategory;
  description: string;
  date: Date;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  adminRemarks?: string;
  resolvedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const complaintSchema = new Schema<IComplaint>(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required'],
      index: true,
    },
    category: {
      type: String,
      enum: [
        'Electrical',
        'Plumbing',
        'Cleanliness',
        'Food',
        'Internet',
        'Room',
        'Security',
        'Maintenance',
        'Other',
      ],
      required: [true, 'Complaint category is required'],
    },
    description: {
      type: String,
      required: [true, 'Complaint description is required'],
      trim: true,
      minlength: [5, 'Description must be at least 5 characters'],
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM',
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED'],
      default: 'PENDING',
      index: true,
    },
    adminRemarks: {
      type: String,
      trim: true,
      default: '',
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Complaint = mongoose.model<IComplaint>('Complaint', complaintSchema);
