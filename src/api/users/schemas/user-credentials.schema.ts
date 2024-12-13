import { z } from 'zod';

export const userCredentialsSchema = z.object({
  login: z.string().openapi({ description: 'Логин', example: 'sirandev' }),
  password: z.string().openapi({ description: 'Пароль', example: 'qwerty12345' }),
});
