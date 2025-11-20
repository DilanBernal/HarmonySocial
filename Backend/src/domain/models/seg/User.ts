export default class User {
  private _id!: number;
  private _fullName?: string;
  private _email!: string;
  private _normalizedEmail!: string;
  private _username!: string;
  private _normalizedUsername!: string;
  private _password!: string;
  private _profileImage!: string;
  private _learningPoints!: number;
  private _status!: UserStatus;
  private _favoriteInstrument!: UserInstrument;
  private _concurrency_stamp!: string;
  private _securityStamp!: string;
  private _createdAt!: Date;
  private _updatedAt?: Date;
  constructor(
    id: number,
    full_name: string | undefined,
    email: string,
    username: string,
    password: string,
    profile_image: string,
    learning_points: number,
    status: UserStatus,
    favorite_instrument: UserInstrument,
    concurrency_stamp: string,
    security_stamp: string,
    updated_at?: Date,
    createdAt?: Date,
  ) {
    this.id = id;
    this.fullName = full_name;
    this.email = email;
    this.normalizedEmail = email.toUpperCase();
    this.username = username;
    this.normalizedUsername = username.toUpperCase();
    this.password = password;
    this.profileImage = profile_image;
    this.learningPoints = learning_points;
    this.status = status;
    this.favoriteInstrument = favorite_instrument;
    this.concurrencyStamp = concurrency_stamp;
    this.securityStamp = security_stamp;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updated_at;
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

  public get fullName(): string | undefined {
    return this._fullName;
  }
  public set fullName(value: string | undefined) {
    this._fullName = value;
  }

  public get email(): string {
    return this._email;
  }
  public set email(value: string) {
    if (!value.includes("@")) {
      throw new Error("El email no contiene un arroba");
    }
    this._email = value;
  }

  public get normalizedEmail(): string {
    return this._normalizedEmail;
  }
  public set normalizedEmail(value: string) {
    this._normalizedEmail = value;
  }

  public get username(): string {
    return this._username;
  }
  public set username(value: string) {
    this._username = value;
  }

  public get normalizedUsername(): string {
    return this._normalizedUsername;
  }
  public set normalizedUsername(value: string) {
    this._normalizedUsername = value;
  }

  public get password(): string {
    return this._password;
  }
  public set password(value: string) {
    this._password = value;
  }

  public get profileImage(): string {
    return this._profileImage;
  }
  public set profileImage(value: string) {
    this._profileImage = value;
  }

  public get learningPoints(): number {
    return this._learningPoints;
  }
  public set learningPoints(value: number) {
    this._learningPoints = value;
  }

  public get status(): UserStatus {
    return this._status;
  }
  public set status(value: UserStatus) {
    this._status = value;
  }

  public get favoriteInstrument(): UserInstrument {
    return this._favoriteInstrument;
  }
  public set favoriteInstrument(value: UserInstrument) {
    this._favoriteInstrument = value;
  }

  public get concurrencyStamp(): string {
    return this._concurrency_stamp;
  }
  public set concurrencyStamp(value: string) {
    this._concurrency_stamp = value;
  }

  public get securityStamp(): string {
    return this._securityStamp;
  }
  public set securityStamp(value: string) {
    this._securityStamp = value;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }
  public set createdAt(value: Date) {
    if (!this.id || this.id < 0) {
      throw new Error("No se puede asignar la fecha de creacion si ya tiene un id");
    }
    if (this.createdAt) {
      throw new Error("La fecha ya esta seteada");
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

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
  SUSPENDED = "SUSPENDED",
  FROZEN = "FROZEN",
}

export enum UserInstrument {
  GUITAR,
  PIANO,
  BASS,
}
