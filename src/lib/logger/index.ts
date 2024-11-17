import { pino, Logger as PinoLogger, LoggerOptions as PinoLoggerOptions } from 'pino';
import { ILogger, LoggerOptions } from '@/lib/logger/types/logger.interface';

export class Logger implements ILogger {
  private context: string;
  private readonly pinoLogger: PinoLogger;

  constructor(private readonly options: LoggerOptions = {}) {
    const { context, nodeEnv, asyncStorage } = this.options;
    const level = nodeEnv === 'development' ? 'trace' : 'info';
    const pretty = nodeEnv === 'development';

    const pinoConfig: PinoLoggerOptions = {
      level,
      formatters: {
        level: (label: string) => ({
          level: label,
        }),
      },
    };

    if (pretty) {
      pinoConfig.transport = {
        target: 'pino-pretty',
      };
    }

    if (asyncStorage) {
      pinoConfig.mixin = () => {
        return {
          requestId: asyncStorage.getStore()?.requestId,
        };
      };
    }


    this.pinoLogger = pino(pinoConfig);
    this.context = context ?? '';
  }

  public setContext(context: string): void {
    this.context = context;
  }

  public trace(message: string, data: Record<string, any> = {}): void {
    this.pinoLogger.trace(data, this.prepareMessage(message));
  }

  public debug(message: string, data: Record<string, any> = {}): void {
    this.pinoLogger.debug(data, this.prepareMessage(message));
  }

  public info(message: string, data: Record<string, any> = {}): void {
    this.pinoLogger.info(data, this.prepareMessage(message));
  }

  public warn(message: string, data: Record<string, any> = {}): void {
    this.pinoLogger.warn(data, this.prepareMessage(message));
  }

  public error(error: Error, message?: string, data: Record<string, any> = {}): void {
    this.pinoLogger.error(
      { ...data, error: this.getPlainError(error) },
      message ? this.prepareMessage(message) : '',
    );
  }

  public fatal(error: Error, message?: string, data: Record<string, any> = {}): void {
    this.pinoLogger.fatal(
      { ...data, error: this.getPlainError(error) },
      message ? this.prepareMessage(message) : ''
    );
  }

  private prepareMessage(message: string): string {
    return this.withContext(message);
  }

  private withContext(message: string): string {
    return this.context ? `[${this.context}] ${message}` : message;
  }

  private getPlainError(error: object): object {
    const plainError: object = { ...error };
    // @ts-ignore
    Object.getOwnPropertyNames(error).forEach((name) => (plainError[name] = error[name]));
    return plainError;
  }
}
