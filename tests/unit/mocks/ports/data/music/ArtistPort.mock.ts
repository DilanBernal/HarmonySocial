import ArtistPort from "../../../../../../src/domain/ports/data/music/ArtistPort";
import Artist, { ArtistStatus } from "../../../../../../src/domain/models/music/Artist";
import { ArtistSearchFilters } from "../../../../../../src/application/dto/requests/Artist/ArtistSearchFilters";
import { ApplicationResponse } from "../../../../../../src/application/shared/ApplicationReponse";
import { ApplicationError, ErrorCodes } from "../../../../../../src/application/shared/errors/ApplicationError";
import PaginationRequest from "../../../../../../src/application/dto/utils/PaginationRequest";
import PaginationResponse from "../../../../../../src/application/dto/utils/PaginationResponse";

// Mock data for artists
const mockArtists: Artist[] = [
  {
    id: 1,
    artist_user_id: 1,
    artist_name: "Test Artist",
    biography: "A test artist biography",
    verified: true,
    formation_year: 2020,
    country_code: "US",
    status: ArtistStatus.ACTIVE,
    created_at: new Date("2023-01-01"),
    updated_at: new Date("2023-06-01"),
  },
  {
    id: 2,
    artist_user_id: 2,
    artist_name: "Pending Artist",
    biography: "Waiting for approval",
    verified: false,
    formation_year: 2021,
    country_code: "MX",
    status: ArtistStatus.PENDING,
    created_at: new Date("2023-02-01"),
    updated_at: undefined,
  },
  {
    id: 3,
    artist_user_id: undefined,
    artist_name: "Admin Created Artist",
    biography: "Created by admin",
    verified: true,
    formation_year: 2019,
    country_code: "CO",
    status: ArtistStatus.ACTIVE,
    created_at: new Date("2023-03-01"),
    updated_at: new Date("2023-07-01"),
  },
];

let nextId = 4;

const createArtistPortMock = (): jest.Mocked<ArtistPort> => {
  // Clone the array to avoid mutation between tests
  let artists = [...mockArtists];

  return {
    create: jest.fn().mockImplementation(
      async (artist: Omit<Artist, "id" | "created_at" | "updated_at">): Promise<ApplicationResponse<number>> => {
        // Validate required fields
        if (!artist.artist_name || !artist.formation_year) {
          return ApplicationResponse.failure(
            new ApplicationError("Datos de artista inválidos", ErrorCodes.VALIDATION_ERROR)
          );
        }

        // Check for duplicate artist name
        const exists = artists.some(
          (a) => a.artist_name.toLowerCase() === artist.artist_name.toLowerCase()
        );
        if (exists) {
          return ApplicationResponse.failure(
            new ApplicationError("Ya existe un artista con ese nombre", ErrorCodes.DATABASE_ERROR)
          );
        }

        // Create new artist
        const newArtist: Artist = {
          ...artist,
          id: nextId++,
          created_at: new Date(),
          updated_at: undefined,
        };

        artists.push(newArtist);
        return ApplicationResponse.success(newArtist.id);
      }
    ),

    update: jest.fn().mockImplementation(
      async (id: number, artist: Partial<Artist>): Promise<ApplicationResponse> => {
        const index = artists.findIndex((a) => a.id === id);
        if (index === -1) {
          return ApplicationResponse.failure(
            new ApplicationError("Artista no encontrado", ErrorCodes.VALUE_NOT_FOUND)
          );
        }

        // Update artist
        artists[index] = {
          ...artists[index],
          ...artist,
          updated_at: new Date(),
        };

        return ApplicationResponse.emptySuccess();
      }
    ),

    logicalDelete: jest.fn().mockImplementation(
      async (id: number): Promise<ApplicationResponse> => {
        const artist = artists.find((a) => a.id === id);
        if (!artist) {
          return ApplicationResponse.failure(
            new ApplicationError("Artista no encontrado", ErrorCodes.VALUE_NOT_FOUND)
          );
        }

        artist.status = ArtistStatus.DELETED;
        artist.updated_at = new Date();
        return ApplicationResponse.emptySuccess();
      }
    ),

    findById: jest.fn().mockImplementation(
      async (id: number): Promise<ApplicationResponse<Artist>> => {
        const artist = artists.find((a) => a.id === id);
        if (!artist) {
          return ApplicationResponse.failure(
            new ApplicationError("Artista no encontrado", ErrorCodes.VALUE_NOT_FOUND)
          );
        }

        return ApplicationResponse.success(artist);
      }
    ),

    searchPaginated: jest.fn().mockImplementation(
      async (
        filters: PaginationRequest<ArtistSearchFilters>
      ): Promise<ApplicationResponse<PaginationResponse<Artist>>> => {
        let filteredArtists = [...artists];

        // Apply filters
        if (filters.filters) {
          if (filters.filters.name) {
            filteredArtists = filteredArtists.filter((a) =>
              a.artist_name.toLowerCase().includes(filters.filters!.name!.toLowerCase())
            );
          }
          if (filters.filters.verified !== undefined) {
            filteredArtists = filteredArtists.filter((a) => a.verified === filters.filters!.verified);
          }
          if (filters.filters.country) {
            filteredArtists = filteredArtists.filter(
              (a) => a.country_code === filters.filters!.country
            );
          }
        }

        // Apply pagination
        const pageSize = filters.page_size ?? 10;
        const page = filters.page_number ?? 0;
        const start = page * pageSize;
        const paginatedArtists = filteredArtists.slice(start, start + pageSize);

        const response = PaginationResponse.create(
          paginatedArtists,
          paginatedArtists.length,
          filteredArtists.length
        );

        return ApplicationResponse.success(response);
      }
    ),

    existsById: jest.fn().mockImplementation(
      async (id: number): Promise<ApplicationResponse<boolean>> => {
        const exists = artists.some((a) => a.id === id);
        return ApplicationResponse.success(exists);
      }
    ),

    updateStatus: jest.fn().mockImplementation(
      async (id: number, status: ArtistStatus): Promise<ApplicationResponse> => {
        const artist = artists.find((a) => a.id === id);
        if (!artist) {
          return ApplicationResponse.failure(
            new ApplicationError("Artista no encontrado", ErrorCodes.VALUE_NOT_FOUND)
          );
        }

        artist.status = status;
        artist.updated_at = new Date();
        return ApplicationResponse.emptySuccess();
      }
    ),
  };
};

export default createArtistPortMock;
