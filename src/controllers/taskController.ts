import { Response, NextFunction } from 'express';
import { Task } from '../models/Task';
import { AuthRequest, TaskStatus } from '../types';

export class TaskController {
  // GET /api/tasks
  static async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as string;
      const skip = (page - 1) * limit;

      const filter: Record<string, unknown> = {};
      if (status) filter.status = status;

      const [tasks, total] = await Promise.all([
        Task.find(filter)
          .populate('assignedTo', 'name')
          .populate('createdBy', 'name')
          .sort({ dueDate: 1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Task.countDocuments(filter),
      ]);

      res.status(200).json({
        success: true,
        message: 'Tasks retrieved.',
        data: tasks,
        meta: { total, page, limit, pages: Math.ceil(total / limit) },
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/tasks
  static async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const task = await Task.create({
        ...req.body,
        createdBy: req.user!._id,
      });
      res.status(201).json({
        success: true,
        message: 'Task created.',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/tasks/:id
  static async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.body.status === TaskStatus.COMPLETED) {
        req.body.completedAt = new Date();
      }
      const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).populate('assignedTo', 'name');
      if (!task) {
        res.status(404).json({ success: false, message: 'Task not found.' });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Task updated.',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/tasks/:id
  static async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) {
        res.status(404).json({ success: false, message: 'Task not found.' });
        return;
      }
      res.status(200).json({ success: true, message: 'Task deleted.' });
    } catch (error) {
      next(error);
    }
  }
}
