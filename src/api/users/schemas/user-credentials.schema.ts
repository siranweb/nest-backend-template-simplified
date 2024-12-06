import { z } from 'zod';

export const userCredentialsSchema = z.object({
  login: z.string().openapi({ title: 'Login', example: 'sirandev' }),
  password: z.string().openapi({ title: 'Password', example: 'qwerty12345' }),
});
