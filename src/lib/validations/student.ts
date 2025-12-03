import { z } from 'zod';

export const updateStudentProfileSchema = z.object({
  schoolName: z.string().min(2).optional(),
  studentId: z.string().optional(),
  major: z.string().optional(),
  yearOfStudy: z.number().min(1).max(7).optional(),
  tuitionFeeOutstanding: z.number().optional(),
  bankAccountName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankName: z.string().optional(),
});

export const addSkillSchema = z.object({
  skillName: z.string().min(2, 'Skill name is required'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
  yearsOfExperience: z.number().min(0).optional(),
});

export const addPortfolioItemSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(500),
  url: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  fileUrl: z.string().url().optional(),
  category: z.string().optional(),
});

export type UpdateStudentProfileInput = z.infer<typeof updateStudentProfileSchema>;
export type AddSkillInput = z.infer<typeof addSkillSchema>;
export type AddPortfolioItemInput = z.infer<typeof addPortfolioItemSchema>;

