-- ==================================================
-- BASE DE DATOS: HarmonySocial
-- ==================================================
-- DROP DATABASE IF EXISTS harmonysocial;
-- CREATE DATABASE harmonysocial WITH ENCODING 'UTF8';

-- ==================================================
-- TABLA: app_user
-- ==================================================

CREATE TYPE user_status AS ENUM (
    'ACTIVE',
    'BLOCKED',
    'DELETED', 
    'SUSPENDED',
    'FROZEN'
);


CREATE TYPE user_instrument AS ENUM (
    'GUITAR',
    'PIANO',
    'BASS'
);

CREATE TABLE IF NOT EXISTS public.app_app_user
(
    id integer NOT NULL DEFAULT nextval('app_user_id_seq'::regclass),
    username character varying(50) COLLATE pg_catalog."default" NOT NULL,
    full_name character varying COLLATE pg_catalog."default" NOT NULL,
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    profile_image character varying(255) COLLATE pg_catalog."default" NOT NULL,
    status app_user_status_enum NOT NULL DEFAULT 'ACTIVE'::app_user_status_enum,
    favorite_instrument app_user_favorite_instrument_enum NOT NULL,
    learning_points integer NOT NULL,
    is_artist boolean NOT NULL,
    concurrency_stamp character varying(36) COLLATE pg_catalog."default" NOT NULL DEFAULT gen_random_uuid(),
    security_stamp character varying(36) COLLATE pg_catalog."default" NOT NULL DEFAULT gen_random_uuid(),
    normalized_email character varying(100) COLLATE pg_catalog."default",
    normalized_username character varying(50) COLLATE pg_catalog."default",
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PK_APP_USER" PRIMARY KEY (id)
)


-- DROP INDEX IF EXISTS public."IDX_user_email_status";

CREATE UNIQUE INDEX IF NOT EXISTS "IDX_user_email_status"
    ON public.app_user USING btree
    (email COLLATE pg_catalog."default" ASC NULLS LAST, status ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: IDX_user_username_status

-- DROP INDEX IF EXISTS public."IDX_user_username_status";

CREATE UNIQUE INDEX IF NOT EXISTS "IDX_user_username_status"
    ON public.app_user USING btree
    (username COLLATE pg_catalog."default" ASC NULLS LAST, status ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE OR REPLACE FUNCTION normalize_user_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Si normalized_email no fue especificado, lo seteamos con el valor de email en mayúsculas
  IF NEW.normalized_email IS NULL OR NEW.normalized_email = '' THEN
    NEW.normalized_email := UPPER(NEW.email);
  END IF;

  -- Si normalized_username no fue especificado, lo seteamos con el valor de username en mayúsculas
  IF NEW.normalized_username IS NULL OR NEW.normalized_username = '' THEN
    NEW.normalized_username := UPPER(NEW.username);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER normalize_user_fields_trigger
BEFORE INSERT OR UPDATE ON app_user
FOR EACH ROW
EXECUTE FUNCTION normalize_user_fields();

-- ==================================================
-- TABLA: ARTISTS
-- ==================================================
CREATE TABLE artists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    biography TEXT,
    verified BOOLEAN DEFAULT FALSE,
    formation_year INTEGER,
    country VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL
);

-- ==================================================
-- TABLA: SONGS
-- ==================================================
CREATE TABLE songs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    audio_url VARCHAR(255) NOT NULL,
    duration INTEGER,
    bpm INTEGER,
    key_note VARCHAR(10),
    album VARCHAR(100),
    decade VARCHAR(20),
    genre VARCHAR(50),
    country VARCHAR(50),
    instruments JSONB,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('EASY','INTERMEDIATE','HARD')),
    artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES app_user(id) ON DELETE SET NULL,
    verified_by_artist BOOLEAN DEFAULT FALSE,
    verified_by_users BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL
);

-- ==================================================
-- TABLA: MUSIC_THEORY (1:1 con SONGS)
-- ==================================================
CREATE TABLE music_theory (
    id SERIAL PRIMARY KEY,
    song_id INTEGER UNIQUE REFERENCES songs(id) ON DELETE CASCADE,
    tonic VARCHAR(10),
    circle_of_fifths TEXT,
    chords TEXT,
    scale VARCHAR(50),
    progression VARCHAR(100),
    difficulty VARCHAR(20) CHECK (difficulty IN ('EASY','INTERMEDIATE','HARD')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL
);

-- ==================================================
-- TABLA: POSTS
-- ==================================================
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES app_user(id) ON DELETE CASCADE,
    song_id INTEGER REFERENCES songs(id) ON DELETE CASCADE,
    publication_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(200),
    artist VARCHAR(100),
    description TEXT,
    short_description VARCHAR(255),
    likes_number INTEGER DEFAULT 0,
    comments_number INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL
);

-- ==================================================
-- TABLA: COMMENTS
-- ==================================================
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    user_id INTEGER REFERENCES app_user(id) ON DELETE CASCADE,
    song_id INTEGER REFERENCES songs(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL
);

-- ==================================================
-- TABLA: RATINGS
-- ==================================================
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    value INTEGER CHECK (value BETWEEN 1 AND 5),
    user_id INTEGER REFERENCES app_user(id) ON DELETE CASCADE,
    song_id INTEGER REFERENCES songs(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, song_id)
);

-- ==================================================
-- TABLA: FRIENDSHIPS
-- ==================================================
CREATE TYPE friendship_status AS ENUM (
    'ACEPTED',
    'REJECTED',
    'PENDING'
);

CREATE TABLE friendships (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES app_user(id) ON DELETE CASCADE,
    friend_id INTEGER REFERENCES app_user(id) ON DELETE CASCADE,
    status friendship_status not null DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    UNIQUE (user_id, friend_id)
);

-- ==================================================
-- TABLA: USER_FOLLOWS_ARTIST
-- ==================================================
CREATE TABLE user_follows_artist (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES app_user(id) ON DELETE CASCADE,
    artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, artist_id)
);

-- ==================================================
-- TABLA: USER_FOLLOWS_USER
-- ==================================================
CREATE TABLE user_follows_user (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER REFERENCES app_user(id) ON DELETE CASCADE,
    followed_id INTEGER REFERENCES app_user(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (follower_id, followed_id)
);

-- ==================================================
-- TRIGGERS PARA ACTUALIZAR updated_at
-- ==================================================
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON app_user FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON artists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON songs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_music_theory_updated_at BEFORE UPDATE ON music_theory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_friendships_updated_at BEFORE UPDATE ON friendships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
