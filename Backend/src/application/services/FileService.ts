import FilePort from "../../domain/ports/data/FilesPort";
import LoggerAdapter from "../../infrastructure/adapter/utils/LoggerAdapter";
import { FilePayload } from "../dto/utils/FilePayload";
import { ApplicationResponse } from "../shared/ApplicationReponse";

export default class FileService {
  private filePort: FilePort;

  constructor(
    filePort: FilePort,
    private loggerPort: LoggerAdapter,
  ) {
    this.filePort = filePort;
  }

  async uploadNewImage(file: FilePayload) {
    try {
      const response = await this.filePort.createImage(file);
      if (!response.success) {
        this.loggerPort.appWarn(response as ApplicationResponse);
      }
      return response;
    } catch (error) {}
  }
}
