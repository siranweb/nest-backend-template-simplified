import { FastifyRequest } from 'fastify';
import { ACCESS_TOKEN_COOKIE_NAME } from '@/shared/constants';

export function getAccessTokenFromHeader(request: FastifyRequest): string | null {
  const header = request.headers.authorization;
  if (!header || !header.startsWith('Bearer')) {
    return null;
  }

  return header.split('Bearer ')[1] ?? null;
}

export function getAccessTokenFromCookies(request: FastifyRequest): string | null {
  return request.cookies[ACCESS_TOKEN_COOKIE_NAME] ?? null;
}
