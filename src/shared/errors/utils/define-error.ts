import { z, ZodRawShape, ZodSchema } from 'zod';
import { AppError } from '@/shared/errors/app-error';
import { apiErrorSchema } from '@/shared/errors/schemas/api-error.schema';
import { ZodObject } from 'zod/lib/types';
import { TEmptyObject } from '@/shared/types';

export function defineError<Shape extends ZodRawShape, Params extends z.infer<ZodObject<Shape>>>(
  code: string,
  shape?: Shape,
): TErrorClass<Params> {
  const apiSchema = apiErrorSchema.extend({
    code: z.literal(code),
    data: z.object({ ...shape }),
  });

  return class extends AppError<Params> {
    public static schema = apiSchema;
    public static isAppError = true;

    public static create(input: unknown) {
      return this.schema.parse(input);
    }

    constructor(params?: Params) {
      super(code, params ?? ({} as Params));
    }
  } as unknown as TErrorClass<Params>;
}

type TErrorApiSchema = ZodSchema;
type TErrorClass<Params extends Record<any, any>> = Params extends TEmptyObject
  ? (new () => AppError<Params>) & { schema: TErrorApiSchema }
  : (new (params: Params) => AppError<Params>) & { schema: TErrorApiSchema };
