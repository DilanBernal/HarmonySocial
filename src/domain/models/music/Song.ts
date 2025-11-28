export enum SongDifficultyLevel {
  EASY = "EASY",
  INTERMEDIATE = "INTERMEDIATE",
  HARD = "HARD",
}

export default class Song {
  private _id!: number;
  private _title!: string;
  private _audioUrl!: string;
  private _description?: string | null;
  private _duration?: number | null;
  private _bpm?: number | null;
  private _keyNote?: string | null;
  private _album?: string | null;
  private _decade?: string | null;
  private _genre?: string | null;
  private _country?: string | null;
  private _instruments?: unknown | null;
  private _difficultyLevel?: SongDifficultyLevel | null;
  private _artistId?: number | null;
  private _userId?: number | null;
  private _verifiedByArtist!: boolean;
  private _verifiedByUsers!: boolean;
  private _createdAt!: Date;
  private _updatedAt?: Date | null;

  constructor(
    id: number,
    title: string,
    audioUrl: string,
    verifiedByArtist: boolean = false,
    verifiedByUsers: boolean = false,
    createdAt?: Date,
    updatedAt?: Date | null,
    description?: string | null,
    duration?: number | null,
    bpm?: number | null,
    keyNote?: string | null,
    album?: string | null,
    decade?: string | null,
    genre?: string | null,
    country?: string | null,
    instruments?: unknown | null,
    difficultyLevel?: SongDifficultyLevel | null,
    artistId?: number | null,
    userId?: number | null,
  ) {
    this.id = id;
    this.title = title;
    this.audioUrl = audioUrl;
    this.verifiedByArtist = verifiedByArtist;
    this.verifiedByUsers = verifiedByUsers;
    this._createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt;
    this.description = description;
    this.duration = duration;
    this.bpm = bpm;
    this.keyNote = keyNote;
    this.album = album;
    this.decade = decade;
    this.genre = genre;
    this.country = country;
    this.instruments = instruments;
    this.difficultyLevel = difficultyLevel;
    this.artistId = artistId;
    this.userId = userId;
  }

  public get id(): number {
    return this._id;
  }
  public set id(value: number) {
    if (value < 0) {
      throw new Error("El id no puede ser menor a 0");
    }
    this._id = value;
  }

  public get title(): string {
    return this._title;
  }
  public set title(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("El título de la canción no puede estar vacío");
    }
    if (value.trim().length > 200) {
      throw new Error("El título de la canción no puede exceder 200 caracteres");
    }
    this._title = value.trim();
  }

  public get audioUrl(): string {
    return this._audioUrl;
  }
  public set audioUrl(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("La URL del audio no puede estar vacía");
    }
    this._audioUrl = value.trim();
  }

  public get description(): string | null | undefined {
    return this._description;
  }
  public set description(value: string | null | undefined) {
    if (value && value.length > 1000) {
      throw new Error("La descripción no puede exceder 1000 caracteres");
    }
    this._description = value;
  }

  public get duration(): number | null | undefined {
    return this._duration;
  }
  public set duration(value: number | null | undefined) {
    if (value !== null && value !== undefined && value < 0) {
      throw new Error("La duración no puede ser negativa");
    }
    this._duration = value;
  }

  public get bpm(): number | null | undefined {
    return this._bpm;
  }
  public set bpm(value: number | null | undefined) {
    if (value !== null && value !== undefined) {
      if (value < 20 || value > 300) {
        throw new Error("El BPM debe estar entre 20 y 300");
      }
    }
    this._bpm = value;
  }

  public get keyNote(): string | null | undefined {
    return this._keyNote;
  }
  public set keyNote(value: string | null | undefined) {
    this._keyNote = value;
  }

  public get album(): string | null | undefined {
    return this._album;
  }
  public set album(value: string | null | undefined) {
    this._album = value;
  }

  public get decade(): string | null | undefined {
    return this._decade;
  }
  public set decade(value: string | null | undefined) {
    this._decade = value;
  }

  public get genre(): string | null | undefined {
    return this._genre;
  }
  public set genre(value: string | null | undefined) {
    this._genre = value;
  }

  public get country(): string | null | undefined {
    return this._country;
  }
  public set country(value: string | null | undefined) {
    if (value !== null && value !== undefined && value.length !== 2) {
      throw new Error("El código de país debe ser un código ISO de 2 letras");
    }
    this._country = value;
  }

  public get instruments(): unknown | null | undefined {
    return this._instruments;
  }
  public set instruments(value: unknown | null | undefined) {
    this._instruments = value;
  }

  public get difficultyLevel(): SongDifficultyLevel | null | undefined {
    return this._difficultyLevel;
  }
  public set difficultyLevel(value: SongDifficultyLevel | null | undefined) {
    this._difficultyLevel = value;
  }

  public get artistId(): number | null | undefined {
    return this._artistId;
  }
  public set artistId(value: number | null | undefined) {
    if (value !== null && value !== undefined && value < 0) {
      throw new Error("El artistId no puede ser menor a 0");
    }
    this._artistId = value;
  }

  public get userId(): number | null | undefined {
    return this._userId;
  }
  public set userId(value: number | null | undefined) {
    if (value !== null && value !== undefined && value < 0) {
      throw new Error("El userId no puede ser menor a 0");
    }
    this._userId = value;
  }

  public get verifiedByArtist(): boolean {
    return this._verifiedByArtist;
  }
  public set verifiedByArtist(value: boolean) {
    this._verifiedByArtist = value;
  }

  public get verifiedByUsers(): boolean {
    return this._verifiedByUsers;
  }
  public set verifiedByUsers(value: boolean) {
    this._verifiedByUsers = value;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date | null | undefined {
    return this._updatedAt;
  }
  public set updatedAt(value: Date | null | undefined) {
    this._updatedAt = value;
  }
}
