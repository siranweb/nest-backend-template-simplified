import { z } from 'zod';

export const userCredentialsSchema = z.object({
  login: z.string().openapi({ description: 'Login', example: 'sirandev' }),
  password: z.string().openapi({ description: 'Password', example: 'qwerty12345' }),
});
