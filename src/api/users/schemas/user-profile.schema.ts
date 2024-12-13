import { z } from 'zod';
import { UUID_EXAMPLE } from '@/shared/constants';

export const userProfileSchema = z.object({
  id: z.string().openapi({ description: 'Айди пользователя', example: UUID_EXAMPLE }),
  login: z.string().openapi({ description: 'Логин', example: 'sirandev' }),
});
