import Artist from "../models/music/Artist";

/**
 * Value object representing public artist information.
 * Excludes sensitive fields: created_at, updated_at, user_id (artistUserId), and status.
 */
export default class ArtistPublicInfo {
  constructor(
    public readonly id: number,
    public readonly artistName: string,
    public readonly biography: string | undefined,
    public readonly verified: boolean,
    public readonly formationYear: number,
    public readonly countryCode: string | undefined,
  ) {}

  /**
   * Creates an ArtistPublicInfo from an Artist domain model
   * @param artist The artist domain model
   * @returns ArtistPublicInfo value object
   */
  static fromArtist(artist: Artist): ArtistPublicInfo {
    return new ArtistPublicInfo(
      artist.id,
      artist.artistName,
      artist.biography,
      artist.verified,
      artist.formationYear,
      artist.countryCode,
    );
  }
}
