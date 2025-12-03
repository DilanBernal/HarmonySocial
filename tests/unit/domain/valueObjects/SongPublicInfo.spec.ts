import Song, { SongDifficultyLevel } from "../../../../src/domain/models/music/Song";
import SongPublicInfo from "../../../../src/domain/valueObjects/SongPublicInfo";

describe("SongPublicInfo", () => {
  describe("constructor", () => {
    it("should create a SongPublicInfo with all properties", () => {
      const songPublicInfo = new SongPublicInfo(
        1,
        "Test Song",
        "https://example.com/audio.mp3",
        "Test Description",
        180,
        120,
        "C Major",
        "Test Album",
        "2020s",
        "Rock",
        "US",
        ["guitar", "drums"],
        SongDifficultyLevel.INTERMEDIATE,
        10,
        100,
        true,
        false
      );

      expect(songPublicInfo.id).toBe(1);
      expect(songPublicInfo.title).toBe("Test Song");
      expect(songPublicInfo.audioUrl).toBe("https://example.com/audio.mp3");
      expect(songPublicInfo.description).toBe("Test Description");
      expect(songPublicInfo.duration).toBe(180);
      expect(songPublicInfo.bpm).toBe(120);
      expect(songPublicInfo.keyNote).toBe("C Major");
      expect(songPublicInfo.album).toBe("Test Album");
      expect(songPublicInfo.decade).toBe("2020s");
      expect(songPublicInfo.genre).toBe("Rock");
      expect(songPublicInfo.country).toBe("US");
      expect(songPublicInfo.instruments).toEqual(["guitar", "drums"]);
      expect(songPublicInfo.difficultyLevel).toBe(SongDifficultyLevel.INTERMEDIATE);
      expect(songPublicInfo.artistId).toBe(10);
      expect(songPublicInfo.userId).toBe(100);
      expect(songPublicInfo.verifiedByArtist).toBe(true);
      expect(songPublicInfo.verifiedByUsers).toBe(false);
    });

    it("should create a SongPublicInfo with null/undefined optional properties", () => {
      const songPublicInfo = new SongPublicInfo(
        1,
        "Test Song",
        "https://example.com/audio.mp3",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        false,
        false
      );

      expect(songPublicInfo.id).toBe(1);
      expect(songPublicInfo.title).toBe("Test Song");
      expect(songPublicInfo.audioUrl).toBe("https://example.com/audio.mp3");
      expect(songPublicInfo.description).toBeNull();
      expect(songPublicInfo.duration).toBeNull();
      expect(songPublicInfo.bpm).toBeNull();
      expect(songPublicInfo.keyNote).toBeNull();
      expect(songPublicInfo.album).toBeNull();
      expect(songPublicInfo.decade).toBeNull();
      expect(songPublicInfo.genre).toBeNull();
      expect(songPublicInfo.country).toBeNull();
      expect(songPublicInfo.instruments).toBeNull();
      expect(songPublicInfo.difficultyLevel).toBeNull();
      expect(songPublicInfo.artistId).toBeNull();
      expect(songPublicInfo.userId).toBeNull();
      expect(songPublicInfo.verifiedByArtist).toBe(false);
      expect(songPublicInfo.verifiedByUsers).toBe(false);
    });
  });

  describe("fromSong", () => {
    it("should create a SongPublicInfo from a Song domain model", () => {
      const song = new Song(
        1,
        "Test Song",
        "https://example.com/audio.mp3",
        true,
        false,
        new Date("2023-01-01"),
        new Date("2023-06-01"),
        "Test Description",
        180,
        120,
        "C Major",
        "Test Album",
        "2020s",
        "Rock",
        "US",
        ["guitar", "drums"],
        SongDifficultyLevel.HARD,
        10,
        100
      );

      const songPublicInfo = SongPublicInfo.fromSong(song);

      expect(songPublicInfo.id).toBe(1);
      expect(songPublicInfo.title).toBe("Test Song");
      expect(songPublicInfo.audioUrl).toBe("https://example.com/audio.mp3");
      expect(songPublicInfo.description).toBe("Test Description");
      expect(songPublicInfo.duration).toBe(180);
      expect(songPublicInfo.bpm).toBe(120);
      expect(songPublicInfo.keyNote).toBe("C Major");
      expect(songPublicInfo.album).toBe("Test Album");
      expect(songPublicInfo.decade).toBe("2020s");
      expect(songPublicInfo.genre).toBe("Rock");
      expect(songPublicInfo.country).toBe("US");
      expect(songPublicInfo.instruments).toEqual(["guitar", "drums"]);
      expect(songPublicInfo.difficultyLevel).toBe(SongDifficultyLevel.HARD);
      expect(songPublicInfo.artistId).toBe(10);
      expect(songPublicInfo.userId).toBe(100);
      expect(songPublicInfo.verifiedByArtist).toBe(true);
      expect(songPublicInfo.verifiedByUsers).toBe(false);
    });

    it("should exclude sensitive fields from Song", () => {
      const song = new Song(
        1,
        "Test Song",
        "https://example.com/audio.mp3",
        true,
        false,
        new Date("2023-01-01"),
        new Date("2023-06-01"),
        "Test Description",
        180,
        120,
        "C Major",
        "Test Album",
        "2020s",
        "Rock",
        "US",
        ["guitar", "drums"],
        SongDifficultyLevel.EASY,
        10,
        100
      );

      const songPublicInfo = SongPublicInfo.fromSong(song);

      // Verify that sensitive fields are not present in SongPublicInfo
      expect(songPublicInfo).not.toHaveProperty("createdAt");
      expect(songPublicInfo).not.toHaveProperty("updatedAt");
    });

    it("should handle Song with null optional fields", () => {
      const song = new Song(
        2,
        "Minimal Song",
        "https://example.com/minimal.mp3",
        false,
        false,
        new Date("2023-01-01"),
        null
      );

      const songPublicInfo = SongPublicInfo.fromSong(song);

      expect(songPublicInfo.id).toBe(2);
      expect(songPublicInfo.title).toBe("Minimal Song");
      expect(songPublicInfo.audioUrl).toBe("https://example.com/minimal.mp3");
      expect(songPublicInfo.description).toBeUndefined();
      expect(songPublicInfo.duration).toBeUndefined();
      expect(songPublicInfo.bpm).toBeUndefined();
      expect(songPublicInfo.keyNote).toBeUndefined();
      expect(songPublicInfo.album).toBeUndefined();
      expect(songPublicInfo.decade).toBeUndefined();
      expect(songPublicInfo.genre).toBeUndefined();
      expect(songPublicInfo.country).toBeUndefined();
      expect(songPublicInfo.instruments).toBeUndefined();
      expect(songPublicInfo.difficultyLevel).toBeUndefined();
      expect(songPublicInfo.artistId).toBeUndefined();
      expect(songPublicInfo.userId).toBeUndefined();
      expect(songPublicInfo.verifiedByArtist).toBe(false);
      expect(songPublicInfo.verifiedByUsers).toBe(false);
    });
  });
});
