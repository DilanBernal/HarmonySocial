import FilePort from "../../domain/ports/data/FilesPort";
import LoggerAdapter from "../../infrastructure/adapter/utils/LoggerAdapter";
import { FilePayload } from "../dto/utils/FilePayload";
import { ApplicationResponse } from "../shared/ApplicationReponse";
import { ApplicationError, ErrorCodes } from "../shared/errors/ApplicationError";
import NotFoundError from "../shared/errors/NotFoundError";
import NotFoundResponse from "../shared/responses/NotFoundResponse";

export type UploadResult = { url: string; blobName: string };

export default class FileService {
  constructor(
    private readonly filePort: FilePort,
    private readonly logger: LoggerAdapter,
  ) { }

  /** Convierte ApplicationResponse<T> -> T o lanza ApplicationError */
  private unwrap<T>(resp: ApplicationResponse<T>): T {
    if (resp.success) return resp.data as T;
    const err = resp.error ?? new ApplicationError("Error en FileService", ErrorCodes.SERVER_ERROR);
    // loguea el error estructurado
    this.logger.appWarn(resp);
    throw err;
  }

  async uploadNewImage(file: FilePayload): Promise<ApplicationResponse<UploadResult>> {
    try {
      const resp = await this.filePort.createImage(file);
      return ApplicationResponse.success(this.unwrap(resp));
    } catch (e: any) {
      const appErr = new ApplicationError(
        e?.message || "Error en uploadNewImage",
        ErrorCodes.SERVER_ERROR,
        e,
      );
      this.logger.appWarn(appErr as any);
      throw appErr;
    }
  }

  async uploadNewSong(file: FilePayload): Promise<ApplicationResponse<UploadResult>> {
    try {
      const resp = await this.filePort.createSong(file);
      return ApplicationResponse.success(this.unwrap(resp));
    } catch (e: any) {
      const appErr = new ApplicationError(
        e?.message || "Error en uploadNewSong",
        ErrorCodes.SERVER_ERROR,
        e,
      );
      this.logger.appWarn(appErr as any);
      throw appErr;
    }
  }

  async getFileSong(id: number): Promise<ApplicationResponse<FilePayload>> {
    try {
      const resp = await this.filePort.getSongFile("");

      if (!resp.success) {
        switch (resp.error?.code) {
          case ErrorCodes.BLOB_NOT_FOUND:
            return new NotFoundResponse(new NotFoundError({ message: "No se encontro el blob de la cancion" }));
          default:
            return ApplicationResponse.failure(resp.error!);
        }
      }

      if (resp.data) {
        const payload: FilePayload =
        {
          data: resp.data.data,
          filename: resp.data.filename,
          mimeType: resp.data.mimeType
        }

        return ApplicationResponse.success(payload);
      }

      return ApplicationResponse.failure(resp.error!);

    } catch (error: any) {
      return ApplicationResponse.failure(error);

    }
  }
}
