import { Request, Response } from "express";
import ArtistService from "../../application/services/ArtistService";
import Artist from "../../domain/models/Artist";

export default class ArtistController {
  constructor(private artistService: ArtistService) {}

  async regArtist(req: Request, res: Response) {
    const artistData: Artist = req.body;

    try {
      const response = await this.artistService.createArtist(artistData);

      if (response.success) {
        res.status(200).json(response.data);
      } else res.status(500).json(response.error?.message);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
