import { ApplicationResponse } from "../../application/shared/ApplicationReponse";
import LoggerPort from "../../domain/ports/extras/LoggerPort";
import pino, { Logger, LoggerOptions } from "pino";

export default class LoggerAdapter implements LoggerPort {
  private logger: Logger;

  constructor(options?: LoggerOptions) {
    this.logger = pino(options);
  }

  info(message: string, ...args: any[]): void {
    this.logger.info({ msg: message, args });
  }

  warn(message: string, ...args: any[]): void {
    this.logger.warn({ msg: message, args });
  }

  error(message: string, ...args: any[]): void {
    this.logger.error({ msg: message, args });
  }

  debug(message: string, ...args: any[]): void {
    this.logger.debug({ msg: message, args });
  }

  fatal(message: string, ...args: any[]): void {
    this.logger.fatal({ msg: message, args });
  }

  setLevel(level: string): void {
    this.logger.level = level;
  }

  appInfo(appError: ApplicationResponse): void {
    this.logger.info({ msg: appError.error?.message, appError });
  }

  appWarn(appError: ApplicationResponse): void {
    this.logger.warn({ msg: appError.error?.message, appError });
  }

  appError(appError: ApplicationResponse): void {
    this.logger.error({ msg: appError.error?.message, appError });
  }

  appDebug(appError: ApplicationResponse): void {
    this.logger.debug({ msg: appError.error?.message, appError });
  }
  appFatal(appError: ApplicationResponse): void {
    this.logger.fatal({ msg: appError.error?.message, appError });
  }

  child(bindings: Record<string, any>): LoggerPort {
    const childLogger = this.logger.child(bindings);
    const adapter = new LoggerAdapter();
    adapter.logger = childLogger;
    return adapter;
  }
}