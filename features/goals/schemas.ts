import { z } from 'zod';

export const goalSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  hours: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, 'Target must be a positive number'),
  delta: z.enum(['day', 'week', 'month'] as const),
});

export type GoalFormData = z.infer<typeof goalSchema>;
