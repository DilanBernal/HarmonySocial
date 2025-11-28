export enum FrienshipStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACEPTED",
  REJECTED = "REJECTED",
}

export default class Friendship {
  private _id!: number;
  private _userId!: number;
  private _friendId!: number;
  private _status!: FrienshipStatus;
  private _createdAt!: Date;
  private _updatedAt?: Date;

  constructor(
    id: number,
    userId: number,
    friendId: number,
    status: FrienshipStatus,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.friendId = friendId;
    this.status = status;
    this._createdAt = createdAt ?? new Date();
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

  public get userId(): number {
    return this._userId;
  }
  public set userId(value: number) {
    if (value <= 0) {
      throw new Error("El userId debe ser mayor a 0");
    }
    this._userId = value;
  }

  public get friendId(): number {
    return this._friendId;
  }
  public set friendId(value: number) {
    if (value <= 0) {
      throw new Error("El friendId debe ser mayor a 0");
    }
    if (this._userId && value === this._userId) {
      throw new Error("No puedes ser amigo de ti mismo");
    }
    this._friendId = value;
  }

  public get status(): FrienshipStatus {
    return this._status;
  }
  public set status(value: FrienshipStatus) {
    this._status = value;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date | undefined {
    return this._updatedAt;
  }
  public set updatedAt(value: Date | undefined) {
    this._updatedAt = value;
  }

  public accept(): void {
    if (this._status !== FrienshipStatus.PENDING) {
      throw new Error("Solo se puede aceptar una solicitud pendiente");
    }
    this._status = FrienshipStatus.ACCEPTED;
    this._updatedAt = new Date();
  }

  public reject(): void {
    if (this._status !== FrienshipStatus.PENDING) {
      throw new Error("Solo se puede rechazar una solicitud pendiente");
    }
    this._status = FrienshipStatus.REJECTED;
    this._updatedAt = new Date();
  }

  public isPending(): boolean {
    return this._status === FrienshipStatus.PENDING;
  }

  public isAccepted(): boolean {
    return this._status === FrienshipStatus.ACCEPTED;
  }
}
