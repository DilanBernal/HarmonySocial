-- Migration Script: Roles & User Roles, Artist linkage, Cleanup is_artist
-- Idempotent approach using IF NOT EXISTS patterns (PostgreSQL specific)

-- 1. Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL
);

-- 2. Create user_roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- 3. Seed default roles (insert if not exists)
INSERT INTO roles (name, description)
SELECT 'common_user', 'Default role for normal registered users'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'common_user');

INSERT INTO roles (name, description)
SELECT 'artist', 'Role for accepted artist profiles'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'artist');

INSERT INTO roles (name, description)
SELECT 'admin', 'Administrative role with elevated privileges'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'admin');

-- 4. Backfill: assign common_user role to users missing any role
WITH common_role AS (
  SELECT id FROM roles WHERE name = 'common_user'
), users_without_role AS (
  SELECT u.id AS user_id, (SELECT id FROM common_role) AS role_id
  FROM app_user u
  WHERE NOT EXISTS (
    SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id
  )
)
INSERT INTO user_roles (user_id, role_id)
SELECT user_id, role_id FROM users_without_role;

-- 5. Add user_id column to artists if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'artists' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE artists ADD COLUMN user_id INT NULL REFERENCES app_user(id) ON DELETE SET NULL;
  END IF;
END$$;

-- 6. Migrate legacy artist_user references (manual step)
-- If there was a relationship between artist_user and artists, map it here.
-- Example (uncomment & adapt if needed):
-- UPDATE artists a SET user_id = au.id
-- FROM artist_user au
-- WHERE a.artist_user_id IS NOT NULL AND a.artist_user_id = au.id; -- Adjust if column existed

-- 6.b (Optional) Backfill artist role for users that previously were flagged via legacy data
-- This tries two strategies:
--  (1) If legacy table artist_user exists, grant artist role to those users.
--  (2) If (before drop) a backup column app_user.is_artist_flag_backup exists and is true, grant artist role.
DO $$
DECLARE
  artist_role_id INT;
BEGIN
  SELECT id INTO artist_role_id FROM roles WHERE name = 'artist';
  IF artist_role_id IS NULL THEN
    RAISE NOTICE 'Artist role not found, skipping backfill.';
    RETURN;
  END IF;

  -- Strategy 1: legacy artist_user table
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'artist_user') THEN
    INSERT INTO user_roles (user_id, role_id)
    SELECT au.id, artist_role_id
    FROM artist_user au
    WHERE NOT EXISTS (
      SELECT 1 FROM user_roles ur WHERE ur.user_id = au.id AND ur.role_id = artist_role_id
    );
  END IF;

  -- Strategy 2: backup column is_artist_flag_backup
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'app_user' AND column_name = 'is_artist_flag_backup'
  ) THEN
    INSERT INTO user_roles (user_id, role_id)
    SELECT u.id, artist_role_id
    FROM app_user u
    WHERE COALESCE(u.is_artist_flag_backup, false) = true
      AND NOT EXISTS (
        SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id AND ur.role_id = artist_role_id
      );
  END IF;
END$$;

-- 7. Drop is_artist column from app_user if exists (already removed at code level)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'app_user' AND column_name = 'is_artist'
  ) THEN
    ALTER TABLE app_user DROP COLUMN is_artist;
  END IF;
END$$;

-- 8. (Optional) Mark artist_user table deprecated
-- COMMENT ON TABLE artist_user IS 'DEPRECATED: Legacy table retained for historic data.';

-- 9. Future (permissions) placeholder: create permissions & role_permissions tables
-- Execute later when implementing permissions (tasks 15+)
-- CREATE TABLE permissions (...);
-- CREATE TABLE role_permissions (...);

-- 10. Verification queries (run manually)
-- SELECT * FROM roles;
-- SELECT * FROM user_roles LIMIT 20;
-- SELECT a.id, a.artist_name, a.user_id FROM artists a LIMIT 20;
-- \d app_user
-- \d artists
-- \d roles
-- \d user_roles

-- End of migration
