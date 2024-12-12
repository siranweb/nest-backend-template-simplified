import { AsyncLocalStorage } from 'node:async_hooks';
import { Logger as PinoLogger } from 'pino';

export interface ILogger {
  readonly pinoLogger: PinoLogger;
  setContext(context: string): void;
  trace(message: string, data?: Record<string, any>): void;
  debug(message: string, data?: Record<string, any>): void;
  info(message: string, data?: Record<string, any>): void;
  warn(message: string, data?: Record<string, any>): void;
  error(message: string, data?: Record<string, any>): void;
  error(error: Error, message: string, data?: Record<string, any>): void;
  fatal(message: string, data?: Record<string, any>): void;
  fatal(error: Error, message: string, data?: Record<string, any>): void;
}

export type TLoggerOptions = {
  context?: string;
  nodeEnv?: string;
  asyncStorage?: AsyncLocalStorage<{ requestId: string }>;
  parent?: ILogger;
};
