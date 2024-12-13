import { createZodDto } from '@/lib/zod-dto/dto-helpers';
import { paginationQuerySchema } from '@/shared/schemas/pagination.schema';

export class PaginationQueryDto extends createZodDto(paginationQuerySchema) {}
