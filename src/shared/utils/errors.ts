import { InternalError } from '@/shared/errors/common-errors';

export function normalizeError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

export function throwInternalError(error: unknown): never {
  const internalError = new InternalError();
  internalError.cause = normalizeError(error);
  throw internalError;
}

export async function withInternalError<T>(clb: () => T): Promise<T> {
  try {
    return await clb();
  } catch (e: unknown) {
    throwInternalError(e);
  }
}
