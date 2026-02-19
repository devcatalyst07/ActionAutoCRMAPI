import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { AuthRequest } from '../types';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = req.body;
      const result = await AuthService.login(username, password);

      res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated.' });
        return;
      }

      const user = await AuthService.getUserProfile(req.user._id.toString());
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Profile retrieved.',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(_req: AuthRequest, res: Response): Promise<void> {
    // JWT is stateless – client handles token removal
    // In production, implement token blacklisting with Redis
    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  }
}
