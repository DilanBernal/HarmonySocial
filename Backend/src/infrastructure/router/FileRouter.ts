import { Router } from "express";
import multer from "multer";
import FilesController from "../controller/FilesController";
import LoggerAdapter from "../adapter/utils/LoggerAdapter";
import FileService from "../../application/services/FileService";
import FileAdapter from "../adapter/utils/FileAdapter";
import authenticateToken from "../middleware/authMiddleware";

const upload = multer();
upload.single("file");

const loggerAdapter: LoggerAdapter = new LoggerAdapter();
const fileAdapter: FileAdapter = new FileAdapter();

const fileService: FileService = new FileService(fileAdapter, loggerAdapter);

const filesController: FilesController = new FilesController(fileService);

const fileRouter = Router();

fileRouter.post("/image", authenticateToken, upload.single("file"), async (req, res) => {
  try {
    await filesController.uploadNewImage(req, res);
  } catch (error) {}
});

fileRouter.post("/song", authenticateToken, upload.single("file"), async (req, res) => {
  try {
    await filesController.uploadNewSong(req, res);
  } catch (error) {}
});

export default fileRouter;
