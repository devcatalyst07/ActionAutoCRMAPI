import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { IUser, JwtPayload, LoginResponse, UserRole } from '../types';
import { env } from '../config/env';

export class AuthService {
  static generateToken(user: IUser): string {
    const payload: JwtPayload = {
      userId: user._id.toString(),
      username: user.username,
      role: user.role as UserRole,
    };
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as string,
    } as jwt.SignOptions);
  }

  static async login(username: string, password: string): Promise<LoginResponse> {
    const user = await User.findOne({ username, isActive: true }).select('+password');

    if (!user) {
      throw Object.assign(new Error('Invalid credentials.'), { statusCode: 401 });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw Object.assign(new Error('Invalid credentials.'), { statusCode: 401 });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        role: user.role as UserRole,
        email: user.email,
      },
    };
  }

  static async getUserProfile(userId: string): Promise<IUser | null> {
    return User.findById(userId);
  }
}