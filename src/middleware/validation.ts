import { body, param, query } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

// Validation result handler
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: errors.array(),
    });
    return;
  }
  next();
};

// Auth Validations
export const loginValidation = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .trim()
    .isLength({ max: 50 })
    .withMessage('Username cannot exceed 50 characters'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Lead Validations
export const createLeadValidation = [
  body('customerName')
    .notEmpty()
    .withMessage('Customer name is required')
    .trim()
    .isLength({ max: 100 }),
  body('channel')
    .notEmpty()
    .withMessage('Channel is required')
    .isIn(['email', 'sms']),
  body('message')
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ max: 5000 }),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim(),
];

// Task Validations
export const createTaskValidation = [
  body('title')
    .notEmpty()
    .withMessage('Task title is required')
    .trim()
    .isLength({ max: 200 }),
  body('dueDate')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('assignedTo')
    .notEmpty()
    .withMessage('Assignee is required')
    .isMongoId()
    .withMessage('Invalid user ID'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent']),
];

// Activity Validations
export const createActivityValidation = [
  body('title')
    .notEmpty()
    .withMessage('Activity title is required')
    .trim()
    .isLength({ max: 200 }),
  body('type')
    .notEmpty()
    .withMessage('Activity type is required')
    .isIn(['appointment', 'follow_up', 'test_drive', 'delivery', 'service', 'meeting', 'call']),
  body('scheduledAt')
    .notEmpty()
    .withMessage('Scheduled date is required')
    .isISO8601(),
];

// Generic ID param validation
export const idParamValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
];

// Pagination query validation
export const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];
