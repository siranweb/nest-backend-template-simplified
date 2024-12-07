import { OpenAPIObject } from '@nestjs/swagger/dist/interfaces';
import { DocumentBuilder } from '@nestjs/swagger';
import { ACCESS_TOKEN_COOKIE_NAME } from '@/shared/constants';

export function getSwaggerConfig(): Omit<OpenAPIObject, 'paths'> {
  return new DocumentBuilder()
    .setTitle('Backend API')
    .setDescription('Backend public API')
    .setVersion('1.0')
    .setOpenAPIVersion('3.1.0')
    .addCookieAuth(
      ACCESS_TOKEN_COOKIE_NAME,
      {
        type: 'apiKey',
        name: ACCESS_TOKEN_COOKIE_NAME,
        in: 'cookie',
      },
      ACCESS_TOKEN_COOKIE_NAME,
    )
    .addBearerAuth({
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Enter token with prefix, like "Bearer YOUR_TOKEN"',
    })
    .build();
}
