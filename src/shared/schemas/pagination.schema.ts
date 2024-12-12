import { z } from 'zod';

export const paginationSchema = z.object({
  totalPages: z.number().openapi({ description: 'Total pages', example: 10 }),
  page: z.coerce.number().openapi({ description: 'Number of page', example: 2 }),
  limit: z.coerce.number().openapi({ description: 'Max amount of records in page', example: 20 }),
});

export const paginationQuerySchema = paginationSchema.omit({ totalPages: true }).extend({
  page: paginationSchema.shape.page.min(1),
  limit: paginationSchema.shape.limit.min(1).max(100),
});
