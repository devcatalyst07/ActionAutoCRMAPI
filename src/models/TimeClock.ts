import mongoose, { Schema } from 'mongoose';
import { ITimeClock } from '../types';

const TimeClockSchema = new Schema<ITimeClock>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    clockIn: {
      type: Date,
      required: true,
    },
    clockOut: {
      type: Date,
    },
    totalHours: {
      type: Number,
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

// Calculate total hours on clock out
TimeClockSchema.pre('save', function (next) {
  if (this.clockOut && this.clockIn) {
    const diff = this.clockOut.getTime() - this.clockIn.getTime();
    this.totalHours = Math.round((diff / (1000 * 60 * 60)) * 100) / 100;
  }
  next();
});

// Indexes
TimeClockSchema.index({ userId: 1, clockIn: -1 });

export const TimeClock = mongoose.model<ITimeClock>('TimeClock', TimeClockSchema);