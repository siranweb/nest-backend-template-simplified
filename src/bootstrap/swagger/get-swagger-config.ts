import { OpenAPIObject } from '@nestjs/swagger/dist/interfaces';
import { DocumentBuilder } from '@nestjs/swagger';

export function getSwaggerConfig(): Omit<OpenAPIObject, 'paths'> {
  return new DocumentBuilder()
    .setTitle('Backend API')
    .setDescription('Backend public API')
    .setVersion('1.0')
    .setOpenAPIVersion('3.1.0')
    .build();
}
