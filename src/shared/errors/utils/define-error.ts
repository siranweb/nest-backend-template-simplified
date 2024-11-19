import { z, ZodRawShape, ZodSchema } from 'zod';
import { AppError } from '@/shared/errors/app-error';
import { apiErrorSchema } from '@/shared/errors/schemas/api-error.schema';

export function defineError<Params = undefined>(
  name: string,
  shape?: ZodRawShape,
): TErrorClass<Params> {
  const apiSchema = apiErrorSchema.extend({
    code: z.literal(name),
    data: z.object({ ...shape }),
  });

  return class extends AppError {
    static schema = apiSchema;

    constructor(params?: Params) {
      super(name, params ?? {});
    }
  } as unknown as TErrorClass<Params>;
}

type TErrorApiSchema = ZodSchema;
type TErrorClass<Params> = Params extends undefined
  ? (new () => AppError) & { schema: TErrorApiSchema }
  : (new (params: Params) => AppError) & { schema: TErrorApiSchema };
