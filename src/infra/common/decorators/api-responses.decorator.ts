import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiResponseOptions, getSchemaPath } from '@nestjs/swagger';

const getResponseModelsKey = (status: number) => `${status}:models`;

/**
 * Used to provide many variants of responses using 'oneOf'.
 * Available for both controller and handler.
 * @param statusCode
 * @param models Models to specify result
 * @param options
 */
export function ApiResponses(
  statusCode: number,
  models: Function[],
  options: ApiResponseOptions = {},
) {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    // For method
    if (propertyKey) {
      decorateApiResponses(statusCode, models, options, target, propertyKey, descriptor);
      Reflect.defineMetadata(getResponseModelsKey(statusCode), models, target[propertyKey]);
      return;
    }

    // For controller
    decorateApiResponses(statusCode, models, options, target);
    const propertyKeys = Object.getOwnPropertyNames(target.prototype);
    propertyKeys.forEach((propertyKey) => {
      const propertyModels: Function[] | undefined = Reflect.getMetadata(
        getResponseModelsKey(statusCode),
        target.prototype[propertyKey],
      );
      const descriptor = Object.getOwnPropertyDescriptor(target.prototype, propertyKey);
      if (!propertyModels) {
        return;
      }
      const allModels = [...propertyModels, ...models];
      decorateApiResponses(statusCode, allModels, options, target, propertyKey, descriptor);
    });
  };
}

function decorateApiResponses(
  status: number,
  models: Function[],
  options: ApiResponseOptions,
  target: any,
  propertyKey?: string,
  descriptor?: PropertyDescriptor,
): void {
  const schema = {
    oneOf: models.map((model) => ({
      $ref: getSchemaPath(model),
    })),
  };

  const decorator = applyDecorators(
    ApiExtraModels(...models),
    ApiResponse({ status, schema, ...options }),
  );
  decorator(target, propertyKey, descriptor);
}
