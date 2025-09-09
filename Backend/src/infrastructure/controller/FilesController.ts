import { FilePayload } from "../../application/dto/utils/FilePayload";
import FileService from "../../application/services/FileService";
import { Request, Response } from "express";

export default class FilesController {
  constructor(private fileService: FileService) {}

  async uploadNewImage(req: Request, res: Response) {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePayload: FilePayload = {
      data: file.buffer,
      filename: file.originalname,
      mimeType: file.mimetype,
    };
    const response = await this.fileService.uploadNewImage(filePayload);
    res.status(200).json(response);
  }
}
