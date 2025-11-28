export enum ArtistStatus {
  ACTIVE = "ACTIVE",
  DELETED = "DELETED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
}

export default class Artist {
  private _id!: number;
  private _artistUserId?: number;
  private _artistName!: string;
  private _biography?: string;
  private _verified!: boolean;
  private _formationYear!: number;
  private _countryCode?: string;
  private _status!: ArtistStatus;
  private _createdAt!: Date;
  private _updatedAt?: Date;

  constructor(
    id: number,
    artistUserId: number | undefined,
    artistName: string,
    biography: string | undefined,
    verified: boolean,
    formationYear: number,
    countryCode: string | undefined,
    status: ArtistStatus,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.artistUserId = artistUserId;
    this.artistName = artistName;
    this.biography = biography;
    this.verified = verified;
    this.formationYear = formationYear;
    this.countryCode = countryCode;
    this.status = status;
    // Only set createdAt for existing entities (id > 0)
    if (id > 0) {
      this._createdAt = createdAt ?? new Date();
    } else {
      this._createdAt = createdAt as any;
    }
    this.updatedAt = updatedAt;
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

  public get artistUserId(): number | undefined {
    return this._artistUserId;
  }
  public set artistUserId(value: number | undefined) {
    if (value !== undefined && value < 0) {
      throw new Error("El artist_user_id no puede ser menor a 0");
    }
    this._artistUserId = value;
  }

  public get artistName(): string {
    return this._artistName;
  }
  public set artistName(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("El nombre del artista no puede estar vacío");
    }
    this._artistName = value;
  }

  public get biography(): string | undefined {
    return this._biography;
  }
  public set biography(value: string | undefined) {
    this._biography = value;
  }

  public get verified(): boolean {
    return this._verified;
  }
  public set verified(value: boolean) {
    this._verified = value;
  }

  public get formationYear(): number {
    return this._formationYear;
  }
  public set formationYear(value: number) {
    const currentYear = new Date().getFullYear();
    if (value < 1900 || value > currentYear) {
      throw new Error(`El año de formación debe estar entre 1900 y ${currentYear}`);
    }
    this._formationYear = value;
  }

  public get countryCode(): string | undefined {
    return this._countryCode;
  }
  public set countryCode(value: string | undefined) {
    if (value !== undefined && (value.length !== 2 || !/^[A-Z]{2}$/.test(value))) {
      throw new Error("El código de país debe ser un código ISO de 2 letras mayúsculas");
    }
    this._countryCode = value;
  }

  public get status(): ArtistStatus {
    return this._status;
  }
  public set status(value: ArtistStatus) {
    this._status = value;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }
  public set createdAt(value: Date) {
    if (!this.id || this.id < 0) {
      throw new Error("No se puede asignar la fecha de creación si no tiene un id válido");
    }
    if (this._createdAt) {
      throw new Error("La fecha de creación ya está seteada");
    }
    this._createdAt = value;
  }

  public get updatedAt(): Date | undefined {
    return this._updatedAt;
  }
  public set updatedAt(value: Date | undefined) {
    this._updatedAt = value;
  }
}
