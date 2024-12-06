import { z } from 'zod';

export const userProfileSchema = z.object({
  login: z.string().openapi({ description: 'Login', example: 'sirandev' }),
});
