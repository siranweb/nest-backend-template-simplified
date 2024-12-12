import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiResponseOptions, getSchemaPath } from '@nestjs/swagger';
import { TDecoratorFunc } from '@/shared/types';

const getResponseModelsKey = (status: number) => `${status}:models`;

/**
 * Используется для передачи нескольких вариантов ответа API.
 * Генерирует "oneOf" в схеме.
 * Доступно для контроллеров и хэндлеров.
 */
export function ApiResponses(statusCode: number, options?: ApiResponseOptions): TDecoratorFunc;
export function ApiResponses(
  statusCode: number,
  models: Function[],
  options?: ApiResponseOptions,
): TDecoratorFunc;
export function ApiResponses(
  statusCode: number,
  modelsOrOptions?: Function[] | ApiResponseOptions,
  optionsOrNothing?: ApiResponseOptions,
): TDecoratorFunc {
  return (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
    const isModels = Array.isArray(modelsOrOptions);
    const models = isModels ? modelsOrOptions : [];
    const options = (isModels ? optionsOrNothing : modelsOrOptions) ?? {};

    // For method
    if (propertyKey) {
      decorateApiResponses(statusCode, models ?? [], options, target, propertyKey, descriptor);
      Reflect.defineMetadata(getResponseModelsKey(statusCode), models, target[propertyKey]);
      return;
    }

    // For controller
    decorateApiResponses(statusCode, models ?? [], options, target);
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
      const allModels = [...propertyModels, ...(models ?? [])];
      decorateApiResponses(statusCode, allModels, options, target, propertyKey, descriptor);
    });
  };
}

function decorateApiResponses(
  status: number,
  models: Function[],
  options: ApiResponseOptions,
  target: any,
  propertyKey?: string | symbol,
  descriptor?: PropertyDescriptor,
): void {
  let schema = undefined;

  if (models.length > 0) {
    schema = {
      oneOf: models.map((model) => ({
        $ref: getSchemaPath(model),
      })),
    };
  }

  const decorator = applyDecorators(
    ApiExtraModels(...models),
    ApiResponse({ status, schema, ...options }),
  );
  decorator(target, propertyKey, descriptor);
}
