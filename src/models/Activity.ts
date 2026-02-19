import mongoose, { Schema } from 'mongoose';
import { IActivity, ActivityType } from '../types';

const ActivitySchema = new Schema<IActivity>(
  {
    title: {
      type: String,
      required: [true, 'Activity title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    type: {
      type: String,
      enum: Object.values(ActivityType),
      required: [true, 'Activity type is required'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    scheduledAt: {
      type: Date,
      required: [true, 'Scheduled date is required'],
    },
    endAt: {
      type: Date,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    relatedLead: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
    },
    location: {
      type: String,
      trim: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
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
ActivitySchema.index({ scheduledAt: 1, assignedTo: 1 });
ActivitySchema.index({ type: 1 });

export const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);