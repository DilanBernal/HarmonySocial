import { BlobServiceClient, RestError } from "@azure/storage-blob";
import { FilePayload } from "../../../application/dto/utils/FilePayload";
import { ApplicationResponse } from "../../../application/shared/ApplicationReponse";
import FilePort from "../../../domain/ports/data/FilesPort";
import envs from "../../config/environment-vars";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { ApplicationError, ErrorCodes } from "../../../application/shared/errors/ApplicationError";
import { FileUploadResponse } from "../../../application/dto/utils/FileUploadResponse";

// Permite inyección de dependencias para testabilidad
export default class FileAdapter implements FilePort {
  private readonly blobServiceClient: BlobServiceClient;
  private readonly imgContainerClient;
  private readonly songContainerClient;
  private readonly imageContainerName = "imagenes";
  private readonly songContainerName = "canciones";

  constructor(blobServiceClient?: BlobServiceClient) {
    this.blobServiceClient =
      blobServiceClient ??
      BlobServiceClient.fromConnectionString(envs.AZURE_STORAGE_CONNECTION_STRING);
    this.imgContainerClient = this.blobServiceClient.getContainerClient(this.imageContainerName);
    this.songContainerClient = this.blobServiceClient.getContainerClient(this.songContainerName);
  }

  async createImage(file: FilePayload): Promise<ApplicationResponse<FileUploadResponse>> {
    try {
      const extension = path.extname(file.filename);
      const blobName = `${uuidv4()}-${Date.now()}${extension}`;
      const blockBlobClient = this.imgContainerClient.getBlockBlobClient(blobName);
      const bufferData = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data);
      await blockBlobClient.uploadData(bufferData, {
        blobHTTPHeaders: { blobContentType: file.mimeType },
      });
      const imgUrl = blockBlobClient.url;
      return ApplicationResponse.success({ url: imgUrl, blobName });
    } catch (error: any) {
      return this.handleAzureError(error, "subir la imagen");
    }
  }
  // Obtiene una imagen del contenedor de imágenes por su nombre de blob (id)
  async getImageFile(id: string): Promise<ApplicationResponse<FilePayload | null>> {
    try {
      const blockBlobClient = this.imgContainerClient.getBlockBlobClient(id);
      const downloadBlockBlobResponse = await blockBlobClient.download();
      const chunks: Buffer[] = [];
      for await (const chunk of downloadBlockBlobResponse.readableStreamBody!) {
        if (typeof chunk === "string") {
          chunks.push(Buffer.from(chunk));
        } else {
          chunks.push(chunk);
        }
      }
      const data = Buffer.concat(chunks);
      const mimeType = downloadBlockBlobResponse.contentType || "application/octet-stream";
      const filePayload: FilePayload = { filename: id, data, mimeType };
      return ApplicationResponse.success(filePayload);
    } catch (error: any) {
      if (this.isBlobNotFound(error)) {
        return ApplicationResponse.failure(
          new ApplicationError(`La imagen no existe (id: ${id})`, ErrorCodes.BLOB_NOT_FOUND),
        );
      }
      return this.handleAzureError(error, "obtener la imagen");
    }
  }
  async getImageUrl(id: string): Promise<ApplicationResponse<string | null>> {
    try {
      const blockBlobClient = this.imgContainerClient.getBlockBlobClient(id);
      const exists = await blockBlobClient.exists();
      if (!exists) {
        return ApplicationResponse.failure(
          new ApplicationError(`La imagen no existe (id: ${id})`, ErrorCodes.BLOB_NOT_FOUND),
        );
      }
      const imgUrl = blockBlobClient.url;
      return ApplicationResponse.success(imgUrl);
    } catch (error: any) {
      return this.handleAzureError(error, "obtener la URL de la imagen");
    }
  }
  // Actualiza una imagen existente (sobrescribe el blob con el mismo id)
  async updateImage(id: string, file: FilePayload): Promise<ApplicationResponse> {
    try {
      const blockBlobClient = this.imgContainerClient.getBlockBlobClient(id);
      const bufferData = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data);
      await blockBlobClient.uploadData(bufferData, {
        blobHTTPHeaders: { blobContentType: file.mimeType },
      });
      return ApplicationResponse.emptySuccess();
    } catch (error: any) {
      if (this.isBlobNotFound(error)) {
        return ApplicationResponse.failure(
          new ApplicationError(
            `No se puede actualizar: la imagen no existe (id: ${id})`,
            ErrorCodes.BLOB_NOT_FOUND,
          ),
        );
      }
      return this.handleAzureError(error, "actualizar la imagen");
    }
  }
  // Elimina una imagen del contenedor de imágenes por su id (nombre de blob)
  async deleteImage(id: string): Promise<ApplicationResponse> {
    try {
      const blockBlobClient = this.imgContainerClient.getBlockBlobClient(id);
      const deleteResponse = await blockBlobClient.deleteIfExists();
      if (!deleteResponse.succeeded) {
        return ApplicationResponse.failure(
          new ApplicationError(
            `La imagen no existe o no se pudo eliminar (id: ${id})`,
            ErrorCodes.BLOB_NOT_FOUND,
          ),
        );
      }
      return ApplicationResponse.emptySuccess();
    } catch (error: any) {
      return this.handleAzureError(error, "eliminar la imagen");
    }
  }
  async createSong(file: FilePayload): Promise<ApplicationResponse<FileUploadResponse>> {
    try {
      const extension = path.extname(file.filename);
      const blobName = `${uuidv4()}-${Date.now()}${extension}`;
      const blockBlobClient = this.songContainerClient.getBlockBlobClient(blobName);
      const bufferData = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data);
      await blockBlobClient.uploadData(bufferData, {
        blobHTTPHeaders: { blobContentType: file.mimeType },
      });
      const songUrl = blockBlobClient.url;
      return ApplicationResponse.success({ url: songUrl, blobName });
    } catch (error: any) {
      return this.handleAzureError(error, "subir la canción");
    }
  }
  async getSongFile(id: string): Promise<ApplicationResponse<FilePayload | null>> {
    try {
      const blockBlobClient = this.songContainerClient.getBlockBlobClient(id);
      const downloadBlockBlobResponse = await blockBlobClient.download();
      const chunks: Buffer[] = [];
      for await (const chunk of downloadBlockBlobResponse.readableStreamBody!) {
        if (typeof chunk === "string") {
          chunks.push(Buffer.from(chunk));
        } else {
          chunks.push(chunk);
        }
      }
      const data = Buffer.concat(chunks);
      const mimeType = downloadBlockBlobResponse.contentType || "application/octet-stream";
      const filePayload: FilePayload = { filename: id, data, mimeType };
      return ApplicationResponse.success(filePayload);
    } catch (error: any) {
      if (this.isBlobNotFound(error)) {
        return ApplicationResponse.failure(
          new ApplicationError(`La canción no existe (id: ${id})`, ErrorCodes.BLOB_NOT_FOUND),
        );
      }
      return this.handleAzureError(error, "obtener la canción");
    }
  }
  async getSongUrl(id: string): Promise<ApplicationResponse<string | null>> {
    try {
      const blockBlobClient = this.songContainerClient.getBlockBlobClient(id);
      const exists = await blockBlobClient.exists();
      if (!exists) {
        return ApplicationResponse.failure(
          new ApplicationError(`La canción no existe (id: ${id})`, ErrorCodes.BLOB_NOT_FOUND),
        );
      }
      const songUrl = blockBlobClient.url;
      return ApplicationResponse.success(songUrl);
    } catch (error: any) {
      return this.handleAzureError(error, "obtener la URL de la canción");
    }
  }
  async updateSong(id: string, file: FilePayload): Promise<ApplicationResponse> {
    try {
      const blockBlobClient = this.songContainerClient.getBlockBlobClient(id);
      const bufferData = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data);
      await blockBlobClient.uploadData(bufferData, {
        blobHTTPHeaders: { blobContentType: file.mimeType },
      });
      return ApplicationResponse.emptySuccess();
    } catch (error: any) {
      if (this.isBlobNotFound(error)) {
        return ApplicationResponse.failure(
          new ApplicationError(
            `No se puede actualizar: la canción no existe (id: ${id})`,
            ErrorCodes.BLOB_NOT_FOUND,
          ),
        );
      }
      return this.handleAzureError(error, "actualizar la canción");
    }
  }
  async deleteSong(id: string): Promise<ApplicationResponse> {
    try {
      const blockBlobClient = this.songContainerClient.getBlockBlobClient(id);
      const deleteResponse = await blockBlobClient.deleteIfExists();
      if (!deleteResponse.succeeded) {
        return ApplicationResponse.failure(
          new ApplicationError(
            `La canción no existe o no se pudo eliminar (id: ${id})`,
            ErrorCodes.BLOB_NOT_FOUND,
          ),
        );
      }
      return ApplicationResponse.emptySuccess();
    } catch (error: any) {
      return this.handleAzureError(error, "eliminar la canción");
    }
  }

  /**
   * Mapea errores de Azure Blob Storage a ApplicationResponse con ErrorCodes específicos
   */
  private handleAzureError(error: any, operacion: string): ApplicationResponse<any> {
    if (this.isBlobNotFound(error)) {
      return ApplicationResponse.failure(
        new ApplicationError(
          `No se encontró el archivo al ${operacion}`,
          ErrorCodes.BLOB_NOT_FOUND,
          error,
        ),
      );
    }
    if (this.isPermissionDenied(error)) {
      return ApplicationResponse.failure(
        new ApplicationError(
          `Permiso denegado al ${operacion}`,
          ErrorCodes.BLOB_PERMISSION_DENIED,
          error,
        ),
      );
    }
    if (this.isBlobConflict(error)) {
      return ApplicationResponse.failure(
        new ApplicationError(`Conflicto al ${operacion}`, ErrorCodes.BLOB_CONFLICT, error),
      );
    }
    if (this.isNetworkError(error)) {
      return ApplicationResponse.failure(
        new ApplicationError(`Error de red al ${operacion}`, ErrorCodes.NETWORK_ERROR, error),
      );
    }
    // Error genérico de Azure Blob Storage
    if (error instanceof RestError) {
      return ApplicationResponse.failure(
        new ApplicationError(
          `Error de almacenamiento Azure al ${operacion}: ${error.message}`,
          ErrorCodes.BLOB_STORAGE_ERROR,
          error,
        ),
      );
    }
    // Error inesperado
    return ApplicationResponse.failure(
      new ApplicationError(
        `Error inesperado al ${operacion}: ${error.message ?? error}`,
        ErrorCodes.SERVER_ERROR,
        error,
      ),
    );
  }

  private isBlobNotFound(error: any): boolean {
    // Azure RestError: statusCode 404, code 'BlobNotFound'
    return (
      error?.statusCode === 404 ||
      error?.code === "BlobNotFound" ||
      error?.details?.errorCode === "BlobNotFound"
    );
  }
  private isPermissionDenied(error: any): boolean {
    // Azure RestError: statusCode 403, code 'AuthorizationFailure' o 'AuthenticationFailed'
    return (
      error?.statusCode === 403 ||
      error?.code === "AuthorizationFailure" ||
      error?.code === "AuthenticationFailed"
    );
  }
  private isBlobConflict(error: any): boolean {
    // Azure RestError: statusCode 409, code 'BlobAlreadyExists'
    return error?.statusCode === 409 || error?.code === "BlobAlreadyExists";
  }
  private isNetworkError(error: any): boolean {
    // Azure RestError: statusCode 408 (timeout) o code 'ENOTFOUND', 'ECONNREFUSED', etc.
    return (
      error?.statusCode === 408 ||
      error?.code === "ENOTFOUND" ||
      error?.code === "ECONNREFUSED" ||
      error?.code === "ETIMEDOUT"
    );
  }
}
