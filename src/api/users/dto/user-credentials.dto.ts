import { z } from 'zod';
import { createZodDto } from '@/lib/zod-dto/dto-helpers';

const userCredentialsSchema = z.object({
  login: z.string().openapi({ title: 'Логин', example: 'sirandev' }),
  password: z.string().openapi({ title: 'Пароль', example: 'qwerty12345' }),
});

export class UserCredentialsDto extends createZodDto(userCredentialsSchema) {}
