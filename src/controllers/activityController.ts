import { Response, NextFunction } from 'express';
import { Activity } from '../models/Activity';
import { AuthRequest } from '../types';

export class ActivityController {
  // GET /api/activities
  static async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const type = req.query.type as string;
      const from = req.query.from as string;
      const to = req.query.to as string;
      const skip = (page - 1) * limit;

      const filter: Record<string, unknown> = {};
      if (type) filter.type = type;
      if (from || to) {
        filter.scheduledAt = {};
        if (from) (filter.scheduledAt as Record<string, unknown>).$gte = new Date(from);
        if (to) (filter.scheduledAt as Record<string, unknown>).$lte = new Date(to);
      }

      const [activities, total] = await Promise.all([
        Activity.find(filter)
          .populate('assignedTo', 'name')
          .populate('createdBy', 'name')
          .sort({ scheduledAt: 1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Activity.countDocuments(filter),
      ]);

      res.status(200).json({
        success: true,
        data: activities,
        meta: { total, page, limit, pages: Math.ceil(total / limit) },
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/activities
  static async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const activity = await Activity.create({
        ...req.body,
        createdBy: req.user!._id,
        assignedTo: req.body.assignedTo || req.user!._id,
      });
      res.status(201).json({
        success: true,
        message: 'Activity created.',
        data: activity,
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/activities/:id
  static async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!activity) {
        res.status(404).json({ success: false, message: 'Activity not found.' });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Activity updated.',
        data: activity,
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/activities/:id
  static async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const activity = await Activity.findByIdAndDelete(req.params.id);
      if (!activity) {
        res.status(404).json({ success: false, message: 'Activity not found.' });
        return;
      }
      res.status(200).json({ success: true, message: 'Activity deleted.' });
    } catch (error) {
      next(error);
    }
  }
}
