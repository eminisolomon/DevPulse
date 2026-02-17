import { z } from 'zod';

export const goalSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  hours: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, 'Target must be a positive number'),
  delta: z.enum(['day', 'week'] as const),
  is_inverse: z.boolean().default(false),
  ignore_zero_days: z.boolean().default(false),
  ignore_days: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  projects: z.array(z.string()).default([]),
});

export type GoalFormData = z.infer<typeof goalSchema>;
