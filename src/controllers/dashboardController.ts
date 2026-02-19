import { Response, NextFunction } from 'express';
import { Lead } from '../models/Lead';
import { Task } from '../models/Task';
import { Activity } from '../models/Activity';
import { TimeClock } from '../models/TimeClock';
import { AuthRequest, TaskStatus } from '../types';

export class DashboardController {
  // GET /api/dashboard/summary
  static async getSummary(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id;
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfWeek = new Date(startOfDay);
      endOfWeek.setDate(endOfWeek.getDate() + 7);

      const [pendingTasks, overdueTasks, upcomingActivities, recentEmailLeads, recentSmsLeads, todayTimeClock] =
        await Promise.all([
          Task.find({ status: { $in: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS] } })
            .populate('assignedTo', 'name')
            .populate('createdBy', 'name')
            .sort({ dueDate: 1 })
            .limit(10)
            .lean(),

          Task.find({
            status: { $ne: TaskStatus.COMPLETED },
            dueDate: { $lt: now },
          })
            .populate('assignedTo', 'name')
            .sort({ dueDate: 1 })
            .limit(10)
            .lean(),

          Activity.find({
            scheduledAt: { $gte: startOfDay, $lte: endOfWeek },
            isCompleted: false,
          })
            .populate('assignedTo', 'name')
            .sort({ scheduledAt: 1 })
            .limit(20)
            .lean(),

          Lead.find({ channel: 'email' })
            .sort({ createdAt: -1 })
            .limit(15)
            .lean(),

          Lead.find({ channel: 'sms' })
            .sort({ createdAt: -1 })
            .limit(15)
            .lean(),

          TimeClock.findOne({
            userId,
            clockIn: { $gte: startOfDay },
            clockOut: null,
          }).lean(),
        ]);

      res.status(200).json({
        success: true,
        message: 'Dashboard data retrieved.',
        data: {
          pendingTasks,
          overdueTasks,
          upcomingActivities,
          leads: {
            emails: recentEmailLeads,
            sms: recentSmsLeads,
          },
          timeClock: todayTimeClock,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/dashboard/clock-in
  static async clockIn(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id;
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      // Check if already clocked in today
      const existing = await TimeClock.findOne({
        userId,
        clockIn: { $gte: startOfDay },
        clockOut: null,
      });

      if (existing) {
        res.status(400).json({
          success: false,
          message: 'Already clocked in today.',
          data: existing,
        });
        return;
      }

      const timeClock = await TimeClock.create({
        userId,
        clockIn: new Date(),
      });

      res.status(201).json({
        success: true,
        message: 'Clocked in successfully.',
        data: timeClock,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/dashboard/clock-out
  static async clockOut(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id;
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const timeClock = await TimeClock.findOne({
        userId,
        clockIn: { $gte: startOfDay },
        clockOut: null,
      });

      if (!timeClock) {
        res.status(400).json({
          success: false,
          message: 'No active clock-in found for today.',
        });
        return;
      }

      timeClock.clockOut = new Date();
      await timeClock.save();

      res.status(200).json({
        success: true,
        message: 'Clocked out successfully.',
        data: timeClock,
      });
    } catch (error) {
      next(error);
    }
  }
}
