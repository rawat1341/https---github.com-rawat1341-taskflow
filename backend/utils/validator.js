import { z } from 'zod';

export const signupSchema = z.object({
  username: z.string().trim().min(3, 'Username must be at least 3 characters long'),
  email: z.string().trim().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .trim()
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[@$!%*?&]/, 'Password must contain at least one special character'),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[@$!%*?&]/, 'Password must contain at least one special character'),
});

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z
    .string()
    .trim()
    .max(100, 'Description must be at most 100 characters long')
    .optional(),
  status: z.enum(['Pending', 'In progress', 'Completed']).optional(),
  priorityType: z.enum(['Professional', 'Personal']).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').optional(),
  description: z
    .string()
    .trim()
    .max(100, 'Description must be at most 100 characters long')
    .optional(),
  status: z.enum(['Pending', 'In progress', 'Completed']).optional(),
  priorityType: z.enum(['Professional', 'Personal']).optional(),
});
