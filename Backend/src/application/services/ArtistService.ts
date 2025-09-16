import Artist from "../../domain/models/Artist";
import ArtistPort from "../../domain/ports/data/ArtistPort";
import LoggerPort from "../../domain/ports/utils/LoggerPort";
import { ApplicationResponse } from "../shared/ApplicationReponse";

export default class ArtistService {
  constructor(
    private artistPort: ArtistPort,
    private logger: LoggerPort,
  ) {}

  async createArtist(artist: Omit<Artist, "id">): Promise<ApplicationResponse<any>> {
    const response = await this.artistPort.createNewArtist(artist);
    console.log(response);
    return ApplicationResponse.success(response);
  }
}
