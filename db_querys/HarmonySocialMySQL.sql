-- ==================================================
-- BASE DE DATOS: HarmonySocial (MySQL)
-- ==================================================
DROP DATABASE IF EXISTS harmonysocial;
CREATE DATABASE harmonysocial CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE harmonysocial;

-- ==================================================
-- TABLA: USER
-- ==================================================
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    full_name varchar(200),
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255),
    status ENUM('ACTIVE',
        'BLOCKED', 
        'DELETED',
        'SUSPENDED',
        'FROZEN') default 'frozen' not null,
    favorite_instrument ENUM('GUITAR',
    'PIANO',
    'BASS') null,
    learning_points INT DEFAULT 0,
    is_artist BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT UQ_user_username_status unique (username, status),
    CONSTRAINT UQ_user_email_status 
    UNIQUE (email, status);
);

-- ==================================================
-- TABLA: ARTISTS
-- ==================================================
CREATE TABLE artists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    biography TEXT,
    verified BOOLEAN DEFAULT FALSE,
    formation_year INT,
    country VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==================================================
-- TABLA: SONGS
-- ==================================================
CREATE TABLE songs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    audio_url VARCHAR(255) NOT NULL,
    duration INT,
    bpm INT,
    key_note VARCHAR(10),
    album VARCHAR(100),
    decade VARCHAR(20),
    genre VARCHAR(50),
    country VARCHAR(50),
    instruments JSON,
    difficulty_level ENUM('EASY','INTERMEDIATE','HARD'),
    artist_id INT,
    user_id INT,
    verified_by_artist BOOLEAN DEFAULT FALSE,
    verified_by_users BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_songs_artist FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE,
    CONSTRAINT fk_songs_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL
);

-- ==================================================
-- TABLA: MUSIC_THEORY
-- ==================================================
CREATE TABLE music_theory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    song_id INT UNIQUE,
    tonic VARCHAR(10),
    circle_of_fifths TEXT,
    chords TEXT,
    scale VARCHAR(50),
    progression VARCHAR(100),
    difficulty ENUM('EASY','INTERMEDIATE','HARD'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_music_theory_song FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
);

-- ==================================================
-- TABLA: POSTS
-- ==================================================
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    song_id INT,
    publication_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(200),
    artist VARCHAR(100),
    description TEXT,
    short_description VARCHAR(255),
    likes_number INT DEFAULT 0,
    comments_number INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_posts_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT fk_posts_song FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
);

-- ==================================================
-- TABLA: COMMENTS
-- ==================================================
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    user_id INT,
    song_id INT,
    post_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_song FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- ==================================================
-- TABLA: RATINGS
-- ==================================================
CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    value INT CHECK (value BETWEEN 1 AND 5),
    user_id INT,
    song_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_song (user_id, song_id),
    CONSTRAINT fk_ratings_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT fk_ratings_song FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
);

-- ==================================================
-- TABLA: FRIENDSHIPS
-- ==================================================
CREATE TABLE friendships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    friend_id INT,
    status ENUM('PENDING','ACCEPTED','REJECTED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_friendship (user_id, friend_id),
    CONSTRAINT fk_friendships_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT fk_friendships_friend FOREIGN KEY (friend_id) REFERENCES user(id) ON DELETE CASCADE
);

-- ==================================================
-- TABLA: USER_FOLLOWS_ARTIST
-- ==================================================
CREATE TABLE user_follows_artist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    artist_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_follow_artist (user_id, artist_id),
    CONSTRAINT fk_user_follows_artist_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_follows_artist_artist FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

-- ==================================================
-- TABLA: USER_FOLLOWS_USER
-- ==================================================
CREATE TABLE user_follows_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    follower_id INT,
    followed_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_follow_user (follower_id, followed_id),
    CONSTRAINT fk_user_follows_user_follower FOREIGN KEY (follower_id) REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_follows_user_followed FOREIGN KEY (followed_id) REFERENCES user(id) ON DELETE CASCADE
);
