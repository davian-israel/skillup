import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const studentRegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().optional(),
  schoolName: z.string().min(2, 'School name is required'),
  major: z.string().optional(),
  yearOfStudy: z.number().min(1).max(7).optional(),
});

export const organizationRegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  organizationName: z.string().min(2, 'Organization name is required'),
  organizationType: z.enum(['NGO', 'Startup', 'Small Business']),
  contactPerson: z.string().min(2, 'Contact person is required'),
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: z.string().min(10, 'Phone number is required'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type StudentRegisterInput = z.infer<typeof studentRegisterSchema>;
export type OrganizationRegisterInput = z.infer<typeof organizationRegisterSchema>;

