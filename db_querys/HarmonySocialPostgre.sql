-- ==================================================
-- BASE DE DATOS: HarmonySocial
-- ==================================================
-- DROP DATABASE IF EXISTS harmonysocial;
-- CREATE DATABASE harmonysocial WITH ENCODING 'UTF8';

-- ==================================================
-- TABLA: USERS
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

CREATE TABLE app_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    full_name VARCHAR(200),
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255),
    status user_status DEFAULT 'FROZEN',
    favorite_instrument user_instrument NULL,
    learning_points INTEGER DEFAULT 0,
    is_artist BOOLEAN DEFAULT FALSE,
    security_stamp VARCHAR(36) NULL,
    concurrency_stamp VARCHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT UQ_user_username_status UNIQUE (username, status),
    CONSTRAINT UQ_user_email_status UNIQUE (email, status)
);

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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    verified_by_artist BOOLEAN DEFAULT FALSE,
    verified_by_users BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================
-- TABLA: POSTS
-- ==================================================
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    song_id INTEGER REFERENCES songs(id) ON DELETE CASCADE,
    publication_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(200),
    artist VARCHAR(100),
    description TEXT,
    short_description VARCHAR(255),
    likes_number INTEGER DEFAULT 0,
    comments_number INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================
-- TABLA: COMMENTS
-- ==================================================
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    song_id INTEGER REFERENCES songs(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================
-- TABLA: RATINGS
-- ==================================================
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    value INTEGER CHECK (value BETWEEN 1 AND 5),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    song_id INTEGER REFERENCES songs(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, song_id)
);

-- ==================================================
-- TABLA: FRIENDSHIPS
-- ==================================================
CREATE TABLE friendships (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    friend_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, friend_id)
);

-- ==================================================
-- TABLA: USER_FOLLOWS_ARTIST
-- ==================================================
CREATE TABLE user_follows_artist (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, artist_id)
);

-- ==================================================
-- TABLA: USER_FOLLOWS_USER
-- ==================================================
CREATE TABLE user_follows_user (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    followed_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
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

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON artists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON songs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_music_theory_updated_at BEFORE UPDATE ON music_theory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_friendships_updated_at BEFORE UPDATE ON friendships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
