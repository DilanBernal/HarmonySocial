import Result from "../../../../shared/Result";
import Artist, { ArtistStatus } from "../../../../models/music/Artist";

export default interface ArtistCommandPort {
  create(artist: Omit<Artist, "id" | "createdAt" | "updatedAt">): Promise<Result<number>>;
  update(id: number, artist: Partial<Artist>): Promise<Result<void>>;
  updateStatus(id: number, status: ArtistStatus): Promise<Result<void>>;
  logicalDelete(id: number): Promise<Result<void>>;
}
