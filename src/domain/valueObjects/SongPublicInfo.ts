import Song, { SongDifficultyLevel } from "../models/music/Song";

/**
 * Value object representing public song information.
 * Excludes sensitive fields: created_at, updated_at.
 */
export default class SongPublicInfo {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly audioUrl: string,
    public readonly description: string | null | undefined,
    public readonly duration: number | null | undefined,
    public readonly bpm: number | null | undefined,
    public readonly keyNote: string | null | undefined,
    public readonly album: string | null | undefined,
    public readonly decade: string | null | undefined,
    public readonly genre: string | null | undefined,
    public readonly country: string | null | undefined,
    public readonly instruments: unknown | null | undefined,
    public readonly difficultyLevel: SongDifficultyLevel | null | undefined,
    public readonly artistId: number | null | undefined,
    public readonly userId: number | null | undefined,
    public readonly verifiedByArtist: boolean,
    public readonly verifiedByUsers: boolean,
  ) {}

  /**
   * Creates a SongPublicInfo from a Song domain model
   * @param song The song domain model
   * @returns SongPublicInfo value object
   */
  static fromSong(song: Song): SongPublicInfo {
    return new SongPublicInfo(
      song.id,
      song.title,
      song.audioUrl,
      song.description,
      song.duration,
      song.bpm,
      song.keyNote,
      song.album,
      song.decade,
      song.genre,
      song.country,
      song.instruments,
      song.difficultyLevel,
      song.artistId,
      song.userId,
      song.verifiedByArtist,
      song.verifiedByUsers,
    );
  }
}
