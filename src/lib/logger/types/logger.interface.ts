import { AsyncLocalStorage } from 'node:async_hooks';

export interface ILogger {
  setContext(context: string): void;
  trace(message: string, data?: Record<string, any>): void;
  debug(message: string, data?: Record<string, any>): void;
  info(message: string, data?: Record<string, any>): void;
  warn(message: string, data?: Record<string, any>): void;
  error(error: Error, message: string, data?: Record<string, any>): void;
  fatal(error: Error, message: string, data?: Record<string, any>): void;
}

export type TLoggerOptions = {
  context?: string;
  nodeEnv?: string;
  asyncStorage?: AsyncLocalStorage<{ requestId: string }>;
};
