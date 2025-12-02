import Artist from "../../../domain/models/music/Artist";
import Song from "../../../domain/models/music/Song";
import ArtistQueryPort from "../../../domain/ports/data/music/query/ArtistQueryPort";
import SongQueryPort from "../../../domain/ports/data/music/query/SongQueryPort";
import UserPublicProfileQueryPort from "../../../domain/ports/data/seg/query/UserPublicProfileQueryPort";
import UserPublicProfile from "../../../domain/valueObjects/UserPublicProfile";

export default class SearchBarService {
  constructor(private readonly userQueryPort: UserPublicProfileQueryPort,
    private readonly artistQueryPort: ArtistQueryPort,
    private readonly songQueryPort: SongQueryPort) { }

  async search(req: string) {
    try {
      const promises: Promise<any>[] = [
        this.userQueryPort.searchUsersPublicProfileByFilters({ username: req, includeFilters: false }),
        this.artistQueryPort.searchByFilters({ includeFilters: false, artistName: req })
      ];

      const [userResult, artistResult] = await Promise.allSettled(promises);

      let users: UserPublicProfile[] = [];
      let artists: Artist[] = [];

      if (userResult.status === "fulfilled" && userResult.value.isSuccess === true) {
        users = userResult.value.value;
      }
      if (artistResult.status === "fulfilled" && artistResult.value) {
        artists = artistResult.value;
      }
      let results: {
        users: UserPublicProfile[],
        artists: Artist[],
        songs: Song[]
      } = {
        users: [],
        artists: [],
        songs: []
      };
      results.users = users;
      return results;
    } catch (error) {
      console.log(error);
    }
  }
}