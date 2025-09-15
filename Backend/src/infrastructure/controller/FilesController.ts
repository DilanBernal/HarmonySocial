import { Request, Response } from "express";
import FileService, { UploadResult } from "../../application/services/FileService";
import { FilePayload } from "../../application/dto/utils/FilePayload";

export default class FilesController {
  constructor(private readonly fileService: FileService) {}

  async uploadNewImage(req: Request, res: Response) {
    try {
      if (!req.file) return res.status(400).json({ message: "file requerido" });

      const payload: FilePayload = {
        filename: req.file.originalname,
        data: req.file.buffer, // 
        mimeType: req.file.mimetype || "image/jpeg",
      };

      const r: UploadResult = await this.fileService.uploadNewImage(payload);
      // r = { url, blobName }
      return res.status(201).json({ success: true, data: r });
    } catch (e: any) {
      console.error("[uploadNewImage]", e);
      if (!res.headersSent)
        return res
          .status(500)
          .json({ success: false, message: e?.message ?? "Upload error" });
    }
  }

  async uploadNewSong(req: Request, res: Response) {
    try {
      if (!req.file) return res.status(400).json({ message: "file requerido" });

      const payload: FilePayload = {
        filename: req.file.originalname,
        data: req.file.buffer, // <-- buffer de multer (memory storage)
        mimeType: req.file.mimetype || "audio/mpeg",
      };

      const r: UploadResult = await this.fileService.uploadNewSong(payload);
      // r = { url, blobName }
      return res.status(201).json({ success: true, data: r });
    } catch (e: any) {
      console.error("[uploadNewSong]", e);
      if (!res.headersSent)
        return res
          .status(500)
          .json({ success: false, message: e?.message ?? "Upload error" });
    }
  }
}
