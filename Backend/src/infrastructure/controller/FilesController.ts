import { Request, Response } from "express";
import FileService, { UploadResult } from "../../application/services/FileService";
import { FilePayload } from "../../application/dto/utils/FilePayload";
import { ApplicationResponse } from "../../application/shared/ApplicationReponse";

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

      const r: ApplicationResponse<UploadResult> = await this.fileService.uploadNewImage(payload);
      // r = { url, blobName }
      if (r.success && r.data) {
        return res.status(201).json({ success: true, data: r });
      }
      return res.status(400).json({ data: r.data });
    } catch (e: any) {
      console.error("[uploadNewImage]", e);
      if (!res.headersSent)
        return res.status(500).json({ success: false, message: e?.message ?? "Upload error" });
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

      const r: ApplicationResponse<UploadResult> = await this.fileService.uploadNewSong(payload);
      // r = { url, blobName }
      if (r.success && r.data) {
        return res.status(201).json({ success: true, data: r });
      }
      return res.status(400).json({ message: "ocurrio un error" });
    } catch (e: any) {
      console.error("[uploadNewSong]", e);
      if (!res.headersSent)
        return res.status(500).json({ success: false, message: e?.message ?? "Upload error" });
    }
  }
}
