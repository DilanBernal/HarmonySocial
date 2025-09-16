import { Router } from "express";
import ArtistController from "../controller/ArtistController";
import ArtistService from "../../application/services/ArtistService";
import ArtistAdapter from "../adapter/data/ArtistAdapter";
import LoggerAdapter from "../adapter/utils/LoggerAdapter";

const artistRouter = Router();

const artistAdapter: ArtistAdapter = new ArtistAdapter();
const logger: LoggerAdapter = new LoggerAdapter();
const artistService: ArtistService = new ArtistService(artistAdapter, logger);
const artistController: ArtistController = new ArtistController(artistService);
artistRouter.post("/", async (req, res) => {
  await artistController.regArtist(req, res);
});

export default artistRouter;
