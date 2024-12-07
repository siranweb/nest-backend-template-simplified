import { defineError } from '@/shared/errors/utils/define-error';
import { z } from 'zod';

export class TokenInvalidError extends defineError('TOKEN_INVALID') {}
export class UserNotFoundError extends defineError('USER_NOT_FOUND') {}
export class UserWrongPasswordError extends defineError('USER_WRONG_PASSWORD') {}
export class UserLoginTakenError extends defineError('LOGIN_TAKEN', {
  login: z.string(),
}) {}
