import { Request, Response, Router } from "express";
import SearchBarController from "../../controller/SearchBarController";
import SearchBarService from "../../../application/services/util/SearchBarService";
import UserPublicProfileQueryAdapter from "../../adapter/data/seg/queries/UserPublicProfileQueryAdapter";
import UserPublicProfileQueryPort from "../../../domain/ports/data/seg/query/UserPublicProfileQueryPort";
import ArtistPublicInfoQueryPort from "../../../domain/ports/data/music/query/ArtistPublicInfoQueryPort";
import SongPublicInfoQueryPort from "../../../domain/ports/data/music/query/SongPublicInfoQueryPort";
import ArtistPublicInfoQueryAdapter from "../../adapter/data/music/ArtistPublicInfoQueryAdapter";
import SongPublicInfoQueryAdapter from "../../adapter/data/music/SongPublicInfoQueryAdapter";

const router = Router();

const userQueryPort: UserPublicProfileQueryPort = new UserPublicProfileQueryAdapter();
const artistQueryPort: ArtistPublicInfoQueryPort = new ArtistPublicInfoQueryAdapter();
const songQueryPort: SongPublicInfoQueryPort = new SongPublicInfoQueryAdapter();
const searchBarService: SearchBarService = new SearchBarService(userQueryPort, artistQueryPort, songQueryPort);
const searchBarController: SearchBarController = new SearchBarController(searchBarService);

router.get("", async (req: Request, res: Response) => {
  await searchBarController.search(req, res);
});

export default router;