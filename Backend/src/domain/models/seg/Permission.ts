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
  ARTIST_READ = "artist.read",
  ARTIST_READ_ALL = "artist.read_all",
  ARTIST_READ_BY_ID = "artist.read_by_id",
  // User management
  USER_READ = "user.read",
  USER_READ_ALL = "user.read_all",
  USER_READ_BY_ID = "user.read_by_id",
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
  // File management
  FILE_UPLOAD = "file.upload",
  FILE_OWN_DELETE = "file.own_delete",
  FILE_OWN_UPDATE = "file.own_update",
  // Song management
  SONG_CREATE = "song.create",
  SONG_UPDATE = "song.update",
  SONG_OWN_UPDATE = "song.own_update",
  SONG_DELETE = "song.delete",
  SONG_OWN_DELETE = "song.own_delete",
  SONG_READ = "song.read",
  SONG_READ_ALL = "song.read_all",
  // Album management
  ALBUM_CREATE = "album.create",
  ALBUM_OWN_UPDATE = "album.own_update",
  ALBUM_OWN_DELETE = "album.own_delete",
  ALBUM_READ = "album.read",
  ALBUM_READ_ALL = "album.read_all",
  // Follows management
  FOLLOW_CREATE_EXTERNAL = "follow.create_external",
  FOLLOW_UPDATE_EXTERNAL = "follow.update_external",
  FOLLOW_DELETE_EXTERNAL = "follow.delete_external",
  FOLLOW_READ_EXTERNAL = "follow.read_external",
  FOLLOW_CREATE = "follow.create",
  FOLLOW_UPDATE = "follow.update",
  FOLLOW_DELETE = "follow.delete",
  FOLLOW_READ = "follow.read",
  FOLLOW_READ_ALL = "follow.read_all",
  // Posts management
}

export const DefaultRolePermissionMapping: Record<string, CorePermission[]> = {
  admin: [
    ...Object.values(CorePermission)
  ],
  artist: [
    CorePermission.ARTIST_UPDATE,
    CorePermission.USER_READ,
    CorePermission.ARTIST_READ,
    CorePermission.FILE_UPLOAD,
    CorePermission.FILE_OWN_UPDATE,
    CorePermission.ALBUM_CREATE,
    CorePermission.ALBUM_OWN_UPDATE,
    CorePermission.ALBUM_OWN_DELETE,
    CorePermission.ALBUM_READ,
    CorePermission.SONG_OWN_UPDATE,
    CorePermission.SONG_OWN_DELETE,
    CorePermission.SONG_READ,
    CorePermission.SONG_CREATE
  ],
  common_user: [
    CorePermission.USER_READ,
    CorePermission.FILE_OWN_DELETE,
    CorePermission.FILE_OWN_UPDATE
  ],
};

export const CorePermissionsList: string[] = Object.values(CorePermission);
