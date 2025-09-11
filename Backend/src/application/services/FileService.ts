import FilePort from "../../domain/ports/data/FilesPort";
import LoggerAdapter from "../../infrastructure/adapter/utils/LoggerAdapter";
import { FilePayload } from "../dto/utils/FilePayload";
import { ApplicationResponse } from "../shared/ApplicationReponse";
import { ApplicationError, ErrorCodes } from "../shared/errors/ApplicationError";

export default class FileService {
  private filePort: FilePort;

  constructor(
    filePort: FilePort,
    private loggerPort: LoggerAdapter,
  ) {
    this.filePort = filePort;
  }

  async uploadNewImage(file: FilePayload): Promise<ApplicationResponse<any>> {
    try {
      const response = await this.filePort.createImage(file);
      if (!response.success) {
        this.loggerPort.appWarn(response);
      }
      return response;
    } catch (error: any) {
      const appError = new ApplicationError(
        error?.message || "Error inesperado en uploadNewImage",
        ErrorCodes.SERVER_ERROR,
        error,
      );
      const errorResponse = ApplicationResponse.failure(appError);
      this.loggerPort.appWarn(errorResponse);
      return errorResponse;
    }
  }

  async uploadNewSong(file: FilePayload): Promise<ApplicationResponse<any>> {
    try {
      const response = await this.filePort.createSong(file);
      if (!response.success) {
        this.loggerPort.appWarn(response);
      }
      return response;
    } catch (error: any) {
      const appError = new ApplicationError(
        error?.message || "Error inesperado en uploadNewSong",
        ErrorCodes.SERVER_ERROR,
        error,
      );
      const errorResponse = ApplicationResponse.failure(appError);
      this.loggerPort.appWarn(errorResponse);
      return errorResponse;
    }
  }
}
