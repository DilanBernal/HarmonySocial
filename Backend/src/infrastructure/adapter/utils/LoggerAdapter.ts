import { ApplicationResponse } from "../../../application/shared/ApplicationReponse";
import LoggerPort from "../../../domain/ports/utils/LoggerPort";
import pino, { Logger, LoggerOptions } from "pino";
import path from "path";
import loggerConfig from "../../config/LoggerConfig";

export default class LoggerAdapter implements LoggerPort {
  private logger: Logger;
  private errorLogger: Logger;

  constructor(options?: LoggerOptions) {
    this.logger = pino(options ?? loggerConfig);


    const errorLogPath = path.join(process.cwd(), "logs", "error.log");
    const errorStream = pino.destination({
      dest: errorLogPath,
      sync: true,
      mkdir: true,
    });
    this.errorLogger = pino({ level: "error" }, errorStream);
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

  appInfo(appError: ApplicationResponse<any>): void {
    this.logger.info({ msg: appError.error?.message, appError });
  }

  appWarn(appError: ApplicationResponse<any>): void {
    this.logger.warn({ msg: appError.error?.message, appError });
  }

  appError(appError: ApplicationResponse<any>): void {
    this.logger.error({ msg: appError.error?.message, appError });
    this.errorLogger.error({ msg: appError.error?.message, appError });
  }

  appDebug(appError: ApplicationResponse<any>): void {
    this.logger.debug({ msg: appError.error?.message, appError });
  }
  appFatal(appError: ApplicationResponse<any>): void {
    this.logger.fatal({ msg: appError.error?.message, appError });
  }

  child(bindings: Record<string, any>): LoggerPort {
    const childLogger = this.logger.child(bindings);
    const adapter = new LoggerAdapter();
    adapter.logger = childLogger;
    return adapter;
  }
}
