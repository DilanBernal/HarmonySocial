export default interface Permission {
  id: number;
  name: string; // machine-readable identifier e.g. artist.accept
  description?: string;
  created_at: Date;
  updated_at?: Date;
}

export enum CorePermission {
  // Artist management
  ARTIST_CREATE = "artist.create",
  ARTIST_UPDATE = "artist.update",
  ARTIST_DELETE = "artist.delete",
  ARTIST_ACCEPT = "artist.accept",
  ARTIST_REJECT = "artist.reject",
  // User management
  USER_READ = "user.read",
  USER_UPDATE = "user.update",
  USER_DELETE = "user.delete",
  // Role management
  ROLE_READ = "role.read",
  ROLE_CREATE = "role.create",
  ROLE_UPDATE = "role.update",
  ROLE_DELETE = "role.delete",
  ROLE_ASSIGN = "role.assign",
  // Permissions management
  PERMISSION_READ = "permission.read",
  PERMISSION_CREATE = "permission.create",
  PERMISSION_UPDATE = "permission.update",
  PERMISSION_DELETE = "permission.delete",
  ROLE_PERMISSION_ASSIGN = "role-permission.assign",
}

export const DefaultRolePermissionMapping: Record<string, CorePermission[]> = {
  admin: [
    CorePermission.ARTIST_CREATE,
    CorePermission.ARTIST_UPDATE,
    CorePermission.ARTIST_DELETE,
    CorePermission.ARTIST_ACCEPT,
    CorePermission.ARTIST_REJECT,
    CorePermission.USER_READ,
    CorePermission.USER_UPDATE,
    CorePermission.USER_DELETE,
    CorePermission.ROLE_READ,
    CorePermission.ROLE_CREATE,
    CorePermission.ROLE_UPDATE,
    CorePermission.ROLE_DELETE,
    CorePermission.ROLE_ASSIGN,
    CorePermission.PERMISSION_READ,
    CorePermission.PERMISSION_CREATE,
    CorePermission.PERMISSION_UPDATE,
    CorePermission.PERMISSION_DELETE,
    CorePermission.ROLE_PERMISSION_ASSIGN,
  ],
  artist: [CorePermission.ARTIST_UPDATE, CorePermission.USER_READ],
  common_user: [CorePermission.USER_READ],
};

export const CorePermissionsList: string[] = Object.values(CorePermission);
