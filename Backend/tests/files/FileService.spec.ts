import FileService from "../../src/application/services/FileService";
import FilePort from "../../src/domain/ports/data/FilesPort";
import LoggerAdapter from "../../src/infrastructure/adapter/utils/LoggerAdapter";
import { FilePayload } from "../../src/application/dto/utils/FilePayload";
import { ApplicationResponse } from "../../src/application/shared/ApplicationReponse";
import { FileUploadResponse } from "../../src/application/dto/utils/FileUploadResponse";

describe("FileService", () => {
  let filePortMock: jest.Mocked<FilePort>;
  let loggerMock: jest.Mocked<LoggerAdapter>;
  let service: FileService;

  beforeEach(() => {
    filePortMock = {
      createImage: jest.fn(),
      getImageFile: jest.fn(),
      getImageUrl: jest.fn(),
      updateImage: jest.fn(),
      deleteImage: jest.fn(),
      createSong: jest.fn(),
      getSongFile: jest.fn(),
      getSongUrl: jest.fn(),
      updateSong: jest.fn(),
      deleteSong: jest.fn(),
    } as any;
    loggerMock = {
      appWarn: jest.fn(),
    } as any;
    service = new FileService(filePortMock, loggerMock);
  });

  describe("uploadNewImage", () => {
    const file: FilePayload = {
      filename: "img.png",
      data: Buffer.from("abc"),
      mimeType: "image/png",
    };
    it("debe retornar ApplicationResponse de éxito y no loguear warning", async () => {
      const response: ApplicationResponse<FileUploadResponse> = ApplicationResponse.success({
        url: "url",
        blobName: "blob",
      });
      filePortMock.createImage.mockResolvedValue(response);
      const result = await service.uploadNewImage(file);
      expect(result).toStrictEqual(response);
      expect(loggerMock.appWarn).not.toHaveBeenCalled();
    });
    it("debe loguear warning si ApplicationResponse es error", async () => {
      const response: ApplicationResponse<FileUploadResponse> = ApplicationResponse.failure(
        {} as any,
      );
      filePortMock.createImage.mockResolvedValue(response);
      const result = await service.uploadNewImage(file);
      expect(result).toStrictEqual({ response });
      expect(loggerMock.appWarn).toHaveBeenCalledWith(response);
    });
    it("debe retornar ApplicationResponse de error si ocurre excepción", async () => {
      filePortMock.createImage.mockRejectedValue(new Error("fail"));
      const result = await service.uploadNewImage(file);
      expect(result.success).toBe(false);
      expect(loggerMock.appWarn).toHaveBeenCalled();
    });
  });

  describe("uploadNewSong", () => {
    const file: FilePayload = {
      filename: "song.mp3",
      data: Buffer.from("abc"),
      mimeType: "audio/mp3",
    };
    it("debe retornar ApplicationResponse de éxito y no loguear warning", async () => {
      const response: ApplicationResponse<FileUploadResponse> = ApplicationResponse.success({
        url: "url",
        blobName: "blob",
      });
      filePortMock.createSong.mockResolvedValue(response);
      const result = await service.uploadNewSong(file);
      expect(result).toStrictEqual(response);
      expect(loggerMock.appWarn).not.toHaveBeenCalled();
    });
    it("debe loguear warning si ApplicationResponse es error", async () => {
      const response: ApplicationResponse<FileUploadResponse> = ApplicationResponse.failure(
        {} as any,
      );
      filePortMock.createSong.mockResolvedValue(response);
      const result = await service.uploadNewSong(file);
      expect(result).toStrictEqual(response);
      expect(loggerMock.appWarn).toHaveBeenCalledWith(response);
    });
    it("debe retornar ApplicationResponse de error si ocurre excepción", async () => {
      filePortMock.createSong.mockRejectedValue(new Error("fail"));
      const result = await service.uploadNewSong(file);
      expect(result.success).toBe(false);
      expect(loggerMock.appWarn).toHaveBeenCalled();
    });
  });
});
