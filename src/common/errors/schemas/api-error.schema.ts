import { z } from 'zod';

export const apiErrorSchema = z
  .object({
    code: z.string(),
    data: z.object({}),
  })
  .required();
