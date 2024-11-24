import { defineError } from '@/shared/errors/utils/define-error';
import { z } from 'zod';

export class HttpError extends defineError('HTTP') {}
export class UnknownError extends defineError('UNKNOWN') {}
export class ValidationError extends defineError('VALIDATION', {
  issues: z.array(z.record(z.string(), z.any())).openapi({ title: 'Array of Zod issues' }),
}) {}
