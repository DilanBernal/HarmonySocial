import { BlobServiceClient } from "@azure/storage-blob";
import { FilePayload } from "../../../application/dto/utils/FilePayload";
import { ApplicationResponse } from "../../../application/shared/ApplicationReponse";
import FilePort from "../../../domain/ports/data/FilesPort";
import envs from "../../config/environment-vars";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { ApplicationError, ErrorCodes } from "../../../application/shared/errors/ApplicationError";

export default class FileAdapter implements FilePort {
  private blobServiceClient;
  private imgContainerClient;
  private songContainerClient;
  private readonly imageContainerName = "imagenes";
  private readonly songContainerName = "canciones";

  constructor() {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      envs.AZURE_STORAGE_CONNECTION_STRING,
    );
    this.imgContainerClient = this.blobServiceClient.getContainerClient(this.imageContainerName);
    this.songContainerClient = this.blobServiceClient.getContainerClient(this.songContainerName);
  }

  async createImage(file: FilePayload): Promise<ApplicationResponse<string>> {
    try {
      const extension = path.extname(file.filename);
      console.log(extension);
      const blobName = `${uuidv4()}-${Date.now()}${extension}`;
      const blockBlobClient = this.imgContainerClient.getBlockBlobClient(blobName);

      await blockBlobClient.uploadData(file.data, {
        blobHTTPHeaders: { blobContentType: file.mimeType },
      });

      const imgUrl = blockBlobClient.url;

      // const connection = await getConnection();

      return ApplicationResponse.success(imgUrl);
    } catch (error: any) {
      return ApplicationResponse.failure(
        new ApplicationError(
          `Error al subir la imagen: ${error.message ?? error}`,
          ErrorCodes.SERVER_ERROR,
        ),
      );
    }
  }
  getImage(id: string): Promise<ApplicationResponse<FilePayload | null>> {
    throw new Error("Method not implemented.");
  }
  updateImage(id: string, file: FilePayload): Promise<ApplicationResponse> {
    throw new Error("Method not implemented.");
  }
  deleteImage(id: string): Promise<ApplicationResponse> {
    throw new Error("Method not implemented.");
  }
  createSong(file: FilePayload): Promise<ApplicationResponse<string>> {
    throw new Error("Method not implemented.");
  }
  getSong(id: string): Promise<ApplicationResponse<FilePayload | null>> {
    throw new Error("Method not implemented.");
  }
  updateSong(id: string, file: FilePayload): Promise<ApplicationResponse> {
    throw new Error("Method not implemented.");
  }
  deleteSong(id: string): Promise<ApplicationResponse> {
    throw new Error("Method not implemented.");
  }
}
