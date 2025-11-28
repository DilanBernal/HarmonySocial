import Result from "../../../../shared/Result";
import Song from "../../../../models/music/Song";

export default interface SongCommandPort {
  create(song: Omit<Song, "id" | "createdAt" | "updatedAt">): Promise<Result<number>>;
  update(id: number, song: Partial<Song>): Promise<Result<void>>;
  delete(id: number): Promise<Result<boolean>>;
}
