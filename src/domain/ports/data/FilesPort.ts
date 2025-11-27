import { FilePayload } from "../../../application/dto/utils/FilePayload";
import { ApplicationResponse } from "../../../application/shared/ApplicationReponse";

import { FileUploadResponse } from "../../../application/dto/utils/FileUploadResponse";
import FileStream from "../../../application/dto/utils/FileStream";

export default interface FilePort {
  // ----------- IMÁGENES -----------
  createImage(file: FilePayload): Promise<ApplicationResponse<FileUploadResponse>>;
  getImageFile(id: string): Promise<ApplicationResponse<FilePayload | null>>;
  getImageUrl(id: string): Promise<ApplicationResponse<string | null>>;
  updateImage(id: string, file: FilePayload): Promise<ApplicationResponse>;
  deleteImage(id: string): Promise<ApplicationResponse>;

  // ----------- CANCIONES -----------
  createSong(file: FilePayload): Promise<ApplicationResponse<FileUploadResponse>>;
  getSongFile(id: string): Promise<ApplicationResponse<FilePayload | null>>;
  getSongUrl(id: string): Promise<ApplicationResponse<string | null>>;
  getSongFileStream(id: string): Promise<ApplicationResponse<FileStream>>;
  updateSong(id: string, file: FilePayload): Promise<ApplicationResponse>;
  deleteSong(id: string): Promise<ApplicationResponse>;
}
