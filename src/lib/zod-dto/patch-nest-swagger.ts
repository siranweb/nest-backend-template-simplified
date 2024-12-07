/*
 * Original:
 * https://github.com/BenLorantfy/nestjs-zod/blob/main/packages/nestjs-zod/src/openapi/patch.ts
 */

import { Type } from '@nestjs/common';
import { SchemaObjectFactory } from '@nestjs/swagger/dist/services/schema-object-factory';
import { isZodDto } from '@/lib/zod-dto/dto-helpers';
import { createSchema } from 'zod-openapi';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { isAppErrorDto } from '@/shared/errors/is-app-error.dto';

export function patchNestJsSwagger() {
  // @ts-ignore
  if (SchemaObjectFactory.prototype.__zodDtoPatched) return;
  const defaultExplore = SchemaObjectFactory.prototype.exploreModelSchema;

  SchemaObjectFactory.prototype.exploreModelSchema = function (
    this: SchemaObjectFactory | undefined,
    type,
    schemas,
    schemaRefsStack,
  ) {
    if (this && this['isLazyTypeFunc'](type)) {
      const factory = type as () => Type<unknown>;
      type = factory();
    }

    if (isZodDto(type)) {
      schemas[type.name] = createSchema(type.schema, {
        openapi: '3.1.0',
      }).schema as SchemaObject;
      return type.name;
    }

    if (isAppErrorDto(type)) {
      schemas[type.name] = createSchema(type.schema, {
        openapi: '3.1.0',
      }).schema as SchemaObject;
      return type.name;
    }

    return defaultExplore.call(this, type, schemas, schemaRefsStack);
  };
  // @ts-ignore
  SchemaObjectFactory.prototype.__zodDtoPatched = true;
}
