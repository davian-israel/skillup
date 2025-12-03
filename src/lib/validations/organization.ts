import { z } from 'zod';

export const updateOrganizationProfileSchema = z.object({
  organizationName: z.string().min(2).optional(),
  organizationType: z.enum(['NGO', 'Startup', 'Small Business']).optional(),
  registrationNumber: z.string().optional(),
  website: z.string().url().optional(),
  description: z.string().min(50).optional(),
  logo: z.string().url().optional(),
  contactPerson: z.string().min(2).optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().min(10).optional(),
  address: z.string().optional(),
});

export type UpdateOrganizationProfileInput = z.infer<typeof updateOrganizationProfileSchema>;

