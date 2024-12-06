import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isZodDto } from '@/lib/zod-dto/dto-helpers';

@Injectable()
export class ZodDtoValidationPipe implements PipeTransform {
  public transform(value: unknown, metadata: ArgumentMetadata): unknown {
    if (!isZodDto(metadata.metatype)) {
      return value;
    }

    const { schema } = metadata.metatype;

    if (!schema) {
      return value;
    }

    const parseResult = schema.safeParse(value);
    if (parseResult.error) {
      throw parseResult.error;
    }

    return parseResult.data;
  }
}
