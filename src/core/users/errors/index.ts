import { defineError } from '@/shared/errors/utils/define-error';
import { z } from 'zod';

export const TokenInvalidError = defineError('TOKEN_INVALID');
export const UserNotFoundError = defineError('USER_NOT_FOUND');
export const UserWrongPasswordError = defineError('USER_WRONG_PASSWORD');
export const UserLoginTakenError = defineError('LOGIN_TAKEN', {
  login: z.string(),
});
