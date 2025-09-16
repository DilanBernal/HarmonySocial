import { Router } from "express";
import multer from "multer";
import FilesController from "../controller/FilesController";
import LoggerAdapter from "../adapter/utils/LoggerAdapter";
import FileService from "../../application/services/FileService";
import FileAdapter from "../adapter/utils/FileAdapter";
import authenticateToken from "../middleware/authMiddleware";

const upload = multer({
  storage: multer.memoryStorage(),         
  limits: { fileSize: 50 * 1024 * 1024 },  
});

const loggerAdapter = new LoggerAdapter();
const fileAdapter = new FileAdapter();
const fileService = new FileService(fileAdapter, loggerAdapter);
const filesController = new FilesController(fileService);

const fileRouter = Router();

fileRouter.post(
  "/image",
  authenticateToken,
  upload.single("file"),
  (req, res) => filesController.uploadNewImage(req, res)
);

fileRouter.post(
  "/song",
  authenticateToken,
  upload.single("file"),
  (req, res) => filesController.uploadNewSong(req, res)   
);

export default fileRouter;
