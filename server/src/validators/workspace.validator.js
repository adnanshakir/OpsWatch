import { z } from 'zod';

export const systemContextSchema = z.object({
  projectName: z.string().trim().optional(),
  liveUrl: z.string().url('Invalid live URL').optional().or(z.literal('')),
  stackPreset: z.string().trim().optional(),
  techStack: z.array(z.string()).optional(),
  integrations: z.array(z.string()).optional(),
  repoUrl: z.string().url('Invalid repo URL').optional().or(z.literal('')),
});
