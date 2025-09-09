import { FilePayload } from "../../../application/dto/utils/FilePayload";
import { ApplicationResponse } from "../../../application/shared/ApplicationReponse";

export default interface FilePort {
  // ----------- IMÁGENES -----------
  createImage(file: FilePayload): Promise<ApplicationResponse<string>>;
  getImage(id: string): Promise<ApplicationResponse<FilePayload | null>>;
  updateImage(id: string, file: FilePayload): Promise<ApplicationResponse>;
  deleteImage(id: string): Promise<ApplicationResponse>;

  // ----------- CANCIONES -----------
  createSong(file: FilePayload): Promise<ApplicationResponse<string>>;
  getSong(id: string): Promise<ApplicationResponse<FilePayload | null>>;
  updateSong(id: string, file: FilePayload): Promise<ApplicationResponse>;
  deleteSong(id: string): Promise<ApplicationResponse>;
}
