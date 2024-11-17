import { z, ZodRawShape, ZodSchema } from 'zod';
import { AppError } from '@/lib/errors/app-error';
import { apiErrorSchema } from '@/lib/errors/schemas/api-error.schema';

export function defineError<Params = undefined>(
  name: string,
  shape?: ZodRawShape,
): ErrorClass<Params> {
  const apiSchema = apiErrorSchema.extend({
    statusMessage: z.literal(name),
    data: z.object({ ...shape }),
  });

  return class extends AppError {
    static schema = apiSchema;

    constructor(params?: Params) {
      super(name, params ?? {});
    }
  } as unknown as ErrorClass<Params>;
}

type ErrorApiSchema = ZodSchema;
type ErrorClass<Params> = Params extends undefined
  ? (new () => AppError) & { schema: ErrorApiSchema }
  : (new (params: Params) => AppError) & { schema: ErrorApiSchema };
