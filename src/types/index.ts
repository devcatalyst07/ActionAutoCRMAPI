import { Request } from 'express';
import { Document, Types } from 'mongoose';

// ─── User Types ──────────────────────────────────────────
export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  SALES_REP = 'Sales Rep',
  FINANCE = 'Finance',
  SERVICE = 'Service',
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  username: string;
  password: string;
  role: UserRole;
  email?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ─── Auth Types ──────────────────────────────────────────
export interface AuthRequest extends Request {
  user?: IUser;
  body: any;
  query: any;
  params: any;
  headers: any;
}

export interface JwtPayload {
  userId: string;
  username: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    username: string;
    role: UserRole;
    email?: string;
  };
}

// ─── Lead Types ──────────────────────────────────────────
export enum LeadChannel {
  EMAIL = 'email',
  SMS = 'sms',
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  LOST = 'lost',
  CONVERTED = 'converted',
}

export interface ILead extends Document {
  _id: Types.ObjectId;
  customerName: string;
  email?: string;
  phone?: string;
  channel: LeadChannel;
  status: LeadStatus;
  subject?: string;
  message: string;
  assignedTo?: Types.ObjectId;
  vehicleInterest?: string;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Task Types ──────────────────────────────────────────
export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface ITask extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: Types.ObjectId;
  createdBy: Types.ObjectId;
  dueDate: Date;
  completedAt?: Date;
  relatedLead?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Activity Types ──────────────────────────────────────
export enum ActivityType {
  APPOINTMENT = 'appointment',
  FOLLOW_UP = 'follow_up',
  TEST_DRIVE = 'test_drive',
  DELIVERY = 'delivery',
  SERVICE = 'service',
  MEETING = 'meeting',
  CALL = 'call',
}

export interface IActivity extends Document {
  _id: Types.ObjectId;
  title: string;
  type: ActivityType;
  description?: string;
  scheduledAt: Date;
  endAt?: Date;
  assignedTo: Types.ObjectId;
  createdBy: Types.ObjectId;
  relatedLead?: Types.ObjectId;
  location?: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── API Response Types ──────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

// ─── Time Clock Types ────────────────────────────────────
export interface ITimeClock extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  clockIn: Date;
  clockOut?: Date;
  totalHours?: number;
  createdAt: Date;
  updatedAt: Date;
}
