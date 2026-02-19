import { Response, NextFunction } from 'express';
import { Lead } from '../models/Lead';
import { AuthRequest } from '../types';

export class LeadController {
  // GET /api/leads
  static async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const channel = req.query.channel as string;
      const status = req.query.status as string;
      const skip = (page - 1) * limit;

      const filter: Record<string, unknown> = {};
      if (channel) filter.channel = channel;
      if (status) filter.status = status;

      const [leads, total] = await Promise.all([
        Lead.find(filter)
          .populate('assignedTo', 'name')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Lead.countDocuments(filter),
      ]);

      res.status(200).json({
        success: true,
        message: 'Leads retrieved.',
        data: leads,
        meta: { total, page, limit, pages: Math.ceil(total / limit) },
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/leads/:id
  static async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const lead = await Lead.findById(req.params.id).populate('assignedTo', 'name');
      if (!lead) {
        res.status(404).json({ success: false, message: 'Lead not found.' });
        return;
      }
      res.status(200).json({ success: true, data: lead });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/leads
  static async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const lead = await Lead.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Lead created successfully.',
        data: lead,
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/leads/:id
  static async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!lead) {
        res.status(404).json({ success: false, message: 'Lead not found.' });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Lead updated.',
        data: lead,
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/leads/:id
  static async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const lead = await Lead.findByIdAndDelete(req.params.id);
      if (!lead) {
        res.status(404).json({ success: false, message: 'Lead not found.' });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Lead deleted.',
      });
    } catch (error) {
      next(error);
    }
  }
}
