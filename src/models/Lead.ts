import mongoose, { Schema } from 'mongoose';
import { ILead, LeadChannel, LeadStatus } from '../types';

const LeadSchema = new Schema<ILead>(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: [100, 'Customer name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    channel: {
      type: String,
      enum: Object.values(LeadChannel),
      required: [true, 'Channel is required'],
    },
    status: {
      type: String,
      enum: Object.values(LeadStatus),
      default: LeadStatus.NEW,
    },
    subject: {
      type: String,
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    vehicleInterest: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const { __v, ...rest } = ret;
        return rest;
      },
    },
  }
);

// Indexes
LeadSchema.index({ channel: 1, createdAt: -1 });
LeadSchema.index({ status: 1 });
LeadSchema.index({ assignedTo: 1 });
LeadSchema.index({ customerName: 'text', message: 'text' });

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);