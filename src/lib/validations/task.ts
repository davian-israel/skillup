import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(200, 'Title too long'),
  description: z.string().min(50, 'Description must be at least 50 characters').max(5000),
  category: z.string().min(1, 'Category is required'),
  skillsRequired: z.array(z.string()).min(1, 'At least one skill is required').max(10),
  compensationAmount: z.number().positive('Amount must be positive').max(100000),
  compensationType: z.enum(['Tuition', 'Stipend', 'Scholarship']),
  deadline: z.string().or(z.date()),
  estimatedDuration: z.string().optional(),
  requirements: z.string().min(20, 'Requirements must be at least 20 characters').max(2000),
  deliverables: z.string().min(20, 'Deliverables must be at least 20 characters').max(2000),
  maxApplicants: z.number().positive().optional(),
});

export const applyForTaskSchema = z.object({
  coverLetter: z.string().min(100, 'Cover letter must be at least 100 characters').max(2000),
  proposedTimeline: z.string().max(500).optional(),
});

export const submitTaskSchema = z.object({
  description: z.string().min(50, 'Description must be at least 50 characters').max(2000),
  submissionUrls: z.array(z.string().url()).min(1, 'At least one file is required').max(10),
});

export const reviewSubmissionSchema = z.object({
  isApproved: z.boolean(),
  reviewNotes: z.string().max(1000).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type ApplyForTaskInput = z.infer<typeof applyForTaskSchema>;
export type SubmitTaskInput = z.infer<typeof submitTaskSchema>;
export type ReviewSubmissionInput = z.infer<typeof reviewSubmissionSchema>;

