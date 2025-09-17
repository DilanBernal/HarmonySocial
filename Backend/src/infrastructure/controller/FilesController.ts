import { Request, Response } from "express";
import FileService, { UploadResult } from "../../application/services/FileService";
import { FilePayload } from "../../application/dto/utils/FilePayload";
import { ApplicationResponse } from "../../application/shared/ApplicationReponse";

export default class FilesController {
  constructor(private readonly fileService: FileService) {}

  // Opcional: si definiste BLOB_PUBLIC_BASE, reescribe 127.0.0.1 -> IP LAN
  private fixPublicUrl(result: UploadResult): UploadResult {
    const PUB = process.env.BLOB_PUBLIC_BASE; // ej: http://192.168.1.5:10000/devstoreaccount1
    if (PUB && result?.url?.startsWith("http://127.0.0.1:10000/devstoreaccount1")) {
      return {
        ...result,
        url: result.url.replace("http://127.0.0.1:10000/devstoreaccount1", PUB),
      };
    }
    return result;
  }

  async uploadNewImage(req: Request, res: Response) {
    try {
      if (!req.file) return res.status(400).json({ message: "file requerido" });

      const payload: FilePayload = {
        filename: req.file.originalname,
        data: req.file.buffer,
        mimeType: req.file.mimetype || "image/jpeg",
      };

      const r: ApplicationResponse<UploadResult> = await this.fileService.uploadNewImage(payload);
      // r = { success, data: { url, blobName } }
      if (r.success && r.data) {
        const data = this.fixPublicUrl(r.data); // opcional
        return res.status(201).json({ success: true, data }); // devolvemos r.data (no r)
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
        data: req.file.buffer,
        mimeType: req.file.mimetype || "audio/mpeg",
      };

      const r: ApplicationResponse<UploadResult> = await this.fileService.uploadNewSong(payload);
      // r = { success, data: { url, blobName } }
      if (r.success && r.data) {
        const data = this.fixPublicUrl(r.data); // opcional
        return res.status(201).json({ success: true, data }); // devolvemos r.data (no r)
      }
      return res.status(400).json({ message: "ocurrio un error" });
    } catch (e: any) {
      console.error("[uploadNewSong]", e);
      if (!res.headersSent)
        return res.status(500).json({ success: false, message: e?.message ?? "Upload error" });
    }
  }
}
