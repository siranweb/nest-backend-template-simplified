import { z } from 'zod';

export const userProfileSchema = z.object({
  login: z.string().openapi({ title: 'Login', example: 'sirandev' }),
});
