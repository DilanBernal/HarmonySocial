import Artist, { ArtistStatus } from "../../../../src/domain/models/music/Artist";
import ArtistPublicInfo from "../../../../src/domain/valueObjects/ArtistPublicInfo";

describe("ArtistPublicInfo", () => {
  describe("constructor", () => {
    it("should create an ArtistPublicInfo with all properties", () => {
      const artistPublicInfo = new ArtistPublicInfo(
        1,
        "Test Artist",
        "Test Biography",
        true,
        2000,
        "USA"
      );

      expect(artistPublicInfo.id).toBe(1);
      expect(artistPublicInfo.artistName).toBe("Test Artist");
      expect(artistPublicInfo.biography).toBe("Test Biography");
      expect(artistPublicInfo.verified).toBe(true);
      expect(artistPublicInfo.formationYear).toBe(2000);
      expect(artistPublicInfo.countryCode).toBe("USA");
    });

    it("should create an ArtistPublicInfo with undefined optional properties", () => {
      const artistPublicInfo = new ArtistPublicInfo(
        1,
        "Test Artist",
        undefined,
        false,
        1990,
        undefined
      );

      expect(artistPublicInfo.id).toBe(1);
      expect(artistPublicInfo.artistName).toBe("Test Artist");
      expect(artistPublicInfo.biography).toBeUndefined();
      expect(artistPublicInfo.verified).toBe(false);
      expect(artistPublicInfo.formationYear).toBe(1990);
      expect(artistPublicInfo.countryCode).toBeUndefined();
    });
  });

  describe("fromArtist", () => {
    it("should create an ArtistPublicInfo from an Artist domain model", () => {
      const artist = new Artist(
        1,
        100,
        "Test Artist",
        "Test Biography",
        true,
        2000,
        "USA",
        ArtistStatus.ACTIVE,
        new Date("2023-01-01"),
        new Date("2023-06-01")
      );

      const artistPublicInfo = ArtistPublicInfo.fromArtist(artist);

      expect(artistPublicInfo.id).toBe(1);
      expect(artistPublicInfo.artistName).toBe("Test Artist");
      expect(artistPublicInfo.biography).toBe("Test Biography");
      expect(artistPublicInfo.verified).toBe(true);
      expect(artistPublicInfo.formationYear).toBe(2000);
      expect(artistPublicInfo.countryCode).toBe("USA");
    });

    it("should exclude sensitive fields from Artist", () => {
      const artist = new Artist(
        1,
        100,
        "Test Artist",
        "Test Biography",
        true,
        2000,
        "USA",
        ArtistStatus.ACTIVE,
        new Date("2023-01-01"),
        new Date("2023-06-01")
      );

      const artistPublicInfo = ArtistPublicInfo.fromArtist(artist);

      // Verify that sensitive fields are not present in ArtistPublicInfo
      expect(artistPublicInfo).not.toHaveProperty("artistUserId");
      expect(artistPublicInfo).not.toHaveProperty("status");
      expect(artistPublicInfo).not.toHaveProperty("createdAt");
      expect(artistPublicInfo).not.toHaveProperty("updatedAt");
    });

    it("should handle Artist with undefined optional fields", () => {
      const artist = new Artist(
        2,
        undefined,
        "Minimal Artist",
        undefined,
        false,
        2010,
        undefined,
        ArtistStatus.PENDING,
        new Date("2023-01-01")
      );

      const artistPublicInfo = ArtistPublicInfo.fromArtist(artist);

      expect(artistPublicInfo.id).toBe(2);
      expect(artistPublicInfo.artistName).toBe("Minimal Artist");
      expect(artistPublicInfo.biography).toBeUndefined();
      expect(artistPublicInfo.verified).toBe(false);
      expect(artistPublicInfo.formationYear).toBe(2010);
      expect(artistPublicInfo.countryCode).toBeUndefined();
    });
  });
});
