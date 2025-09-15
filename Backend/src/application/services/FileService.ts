import FilePort from "../../domain/ports/data/FilesPort";
import LoggerAdapter from "../../infrastructure/adapter/utils/LoggerAdapter";
import { FilePayload } from "../dto/utils/FilePayload";
import { ApplicationResponse } from "../shared/ApplicationReponse";
import { ApplicationError, ErrorCodes } from "../shared/errors/ApplicationError";

export type UploadResult = { url: string; blobName: string };

export default class FileService {
  constructor(
    private readonly filePort: FilePort,
    private readonly logger: LoggerAdapter
  ) {}

  /** Convierte ApplicationResponse<T> -> T o lanza ApplicationError */
  private unwrap<T>(resp: ApplicationResponse<T>): T {
    if (resp.success) return resp.data as T;
    const err =
      resp.error ??
      new ApplicationError("Error en FileService", ErrorCodes.SERVER_ERROR);
    // loguea el error estructurado
    this.logger.appWarn(resp);
    throw err;
  }

  async uploadNewImage(file: FilePayload): Promise<UploadResult> {
    try {
      const resp = await this.filePort.createImage(file);
      return this.unwrap(resp);
    } catch (e: any) {
      const appErr = new ApplicationError(
        e?.message || "Error en uploadNewImage",
        ErrorCodes.SERVER_ERROR,
        e
      );
      this.logger.appWarn(appErr as any);
      throw appErr;
    }
  }

  async uploadNewSong(file: FilePayload): Promise<UploadResult> {
    try {
      const resp = await this.filePort.createSong(file);
      return this.unwrap(resp);
    } catch (e: any) {
      const appErr = new ApplicationError(
        e?.message || "Error en uploadNewSong",
        ErrorCodes.SERVER_ERROR,
        e
      );
      this.logger.appWarn(appErr as any);
      throw appErr;
    }
  }
}
