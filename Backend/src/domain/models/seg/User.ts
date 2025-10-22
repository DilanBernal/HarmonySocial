export default class User {
  private _id!: number
  private _full_name?: string
  private _email!: string
  private _normalized_email!: string
  private _username!: string
  private _normalized_username!: string
  private _password!: string
  private _profile_image!: string
  private _learning_points!: number
  private _status!: UserStatus
  private _favorite_instrument!: UserInstrument
  private _concurrency_stamp!: string
  private _security_stamp!: string
  private _created_at!: Date
  private _updated_at?: Date
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
    this.full_name = full_name;
    this.email = email;
    this.normalized_email = email.toUpperCase();
    this.username = username;
    this.normalized_username = username.toUpperCase();
    this.password = password;
    this.profile_image = profile_image;
    this.learning_points = learning_points;
    this.status = status;
    this.favorite_instrument = favorite_instrument;
    this.concurrency_stamp = concurrency_stamp;
    this.security_stamp = security_stamp;
    this.created_at = createdAt ?? new Date();
    this.updated_at = updated_at;
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

  public get full_name(): string | undefined {
    return this._full_name;
  }
  public set full_name(value: string | undefined) {
    this._full_name = value;
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

  public get normalized_email(): string {
    return this._normalized_email;
  }
  public set normalized_email(value: string) {
    this._normalized_email = value;
  }

  public get username(): string {
    return this._username;
  }
  public set username(value: string) {
    this._username = value;
  }

  public get normalized_username(): string {
    return this._normalized_username;
  }
  public set normalized_username(value: string) {
    this._normalized_username = value;
  }

  public get password(): string {
    return this._password;
  }
  public set password(value: string) {
    this._password = value;
  }

  public get profile_image(): string {
    return this._profile_image;
  }
  public set profile_image(value: string) {
    this._profile_image = value;
  }

  public get learning_points(): number {
    return this._learning_points;
  }
  public set learning_points(value: number) {
    this._learning_points = value;
  }

  public get status(): UserStatus {
    return this._status;
  }
  public set status(value: UserStatus) {
    this._status = value;
  }

  public get favorite_instrument(): UserInstrument {
    return this._favorite_instrument;
  }
  public set favorite_instrument(value: UserInstrument) {
    this._favorite_instrument = value;
  }

  public get concurrency_stamp(): string {
    return this._concurrency_stamp;
  }
  public set concurrency_stamp(value: string) {
    this._concurrency_stamp = value;
  }

  public get security_stamp(): string {
    return this._security_stamp;
  }
  public set security_stamp(value: string) {
    this._security_stamp = value;
  }

  public get created_at(): Date {
    return this._created_at;
  }
  public set created_at(value: Date) {
    if (!this.id || this.id < 0) {
      throw new Error("No se puede asignar la fecha de creacion si ya tiene un id");
    }
    if (!this.created_at) {
      throw new Error("La fecha ya esta seteada");
    }
    this._created_at = value;
  }

  public get updated_at(): Date | undefined {
    return this._updated_at;
  }
  public set updated_at(value: Date | undefined) {
    this._updated_at = value;
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
