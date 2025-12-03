import ArtistPublicInfoQueryPort from "../../../domain/ports/data/music/query/ArtistPublicInfoQueryPort";
import SongPublicInfoQueryPort from "../../../domain/ports/data/music/query/SongPublicInfoQueryPort";
import UserPublicProfileQueryPort from "../../../domain/ports/data/seg/query/UserPublicProfileQueryPort";
import ArtistPublicInfo from "../../../domain/valueObjects/ArtistPublicInfo";
import SongPublicInfo from "../../../domain/valueObjects/SongPublicInfo";
import UserPublicProfile from "../../../domain/valueObjects/UserPublicProfile";

export default class SearchBarService {
  constructor(
    private readonly userQueryPort: UserPublicProfileQueryPort,
    private readonly artistQueryPort: ArtistPublicInfoQueryPort,
    private readonly songQueryPort: SongPublicInfoQueryPort,
  ) {}

  async search(req: string) {
    try {
      const promises: Promise<any>[] = [
        this.userQueryPort.searchUsersPublicProfileByFilters({ username: req, includeFilters: true }),
        this.artistQueryPort.searchArtistsPublicInfoByFilters({ includeFilters: true, artistName: req }),
        this.songQueryPort.searchSongsPublicInfoByFilters({ includeFilters: false, genre: req, title: req }),
      ];

      const [userResult, artistResult, songResult] = await Promise.allSettled(promises);

      let users: UserPublicProfile[] = [];
      let artists: ArtistPublicInfo[] = [];
      let songs: SongPublicInfo[] = [];

      if (userResult.status === "fulfilled" && userResult.value.isSuccess === true) {
        users = userResult.value.value;
      }

      if (artistResult.status === "fulfilled" && artistResult.value.isSuccess === true) {
        artists = artistResult.value.value;
      }
      if (songResult.status === "fulfilled" && songResult.value.isSuccess === true) {
        songs = songResult.value.value;
      }
      let results: {
        users: UserPublicProfile[];
        artists: ArtistPublicInfo[];
        songs: SongPublicInfo[];
      } = {
        users: [],
        artists: [],
        songs: [],
      };
      results.users = users;
      results.artists = artists;
      results.songs = songs;
      return results;
    } catch (error) {
      console.log(error);
    }
  }
}