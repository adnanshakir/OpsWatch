import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z
    .string({
      required_error: 'Service name is required',
    })
    .min(2, 'Name must be at least 2 characters'),

  description: z
    .string()
    .max(300, 'Description must be under 300 characters')
    .optional(),

  type: z.enum(['frontend', 'backend', 'database', 'infra'], {
    required_error: 'Service type is required',
  }),

  techStack: z
    .array(z.string())
    .min(1, 'At least one technology must be listed'),

  environment: z.enum(['production', 'staging', 'dev']).optional(),

  status: z.enum(['active', 'inactive']).optional(),

  repoUrl: z.string().url('Invalid repo URL').optional().or(z.literal('')),

  liveUrl: z.string().url('Invalid live URL').optional().or(z.literal('')),
});
