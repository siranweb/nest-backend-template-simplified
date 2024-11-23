/*
 * Original:
 * https://github.com/BenLorantfy/nestjs-zod/blob/main/packages/nestjs-zod/src/openapi/patch.ts
 */

import { Type } from '@nestjs/common';
import { SchemaObjectFactory } from '@nestjs/swagger/dist/services/schema-object-factory';
import { isZodDto } from '@/lib/zod-dto/dto-helpers';
import { createSchema } from 'zod-openapi';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

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

    if (!isZodDto(type)) {
      return defaultExplore.call(this, type, schemas, schemaRefsStack);
    }

    schemas[type.name] = createSchema(type.schema, {
      openapi: '3.0.0',
    }).schema as SchemaObject;
    return type.name;
  };
  // @ts-ignore
  SchemaObjectFactory.prototype.__zodDtoPatched = true;
}
