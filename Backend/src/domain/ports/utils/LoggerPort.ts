import { ApplicationResponse } from "../../../application/shared/ApplicationReponse";

export default interface LoggerPort {
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
  fatal?(message: string, ...args: any[]): void;
  appInfo(appError: ApplicationResponse<any>): void;
  appWarn(appError: ApplicationResponse<any>): void;
  appError(appError: ApplicationResponse<any>): void;
  appDebug(appError: ApplicationResponse<any>): void;
  appFatal(appError: ApplicationResponse<any>): void;

  // Métodos para configurar el logger dinámicamente
  setLevel?(level: string): void;
  child?(bindings: Record<string, any>): LoggerPort;
}
