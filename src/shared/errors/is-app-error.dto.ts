import { ZodDto } from '@/lib/zod-dto/dto-helpers';

export function isAppErrorDto(metatype: any): metatype is ZodDto<unknown> {
  return metatype?.isAppError;
}
