DROP TABLE IF EXISTS codestore;
DROP TABLE IF EXISTS chats;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL primary key,
    fname VARCHAR(255) not null,
    lname VARCHAR(255) not null,
    email VARCHAR(255) not null UNIQUE,
    password  VARCHAR(255) not NULL
);

CREATE TABLE codestore (
    id SERIAL primary key,
    coder_id INTEGER NOT NULL REFERENCES users(id) UNIQUE,
    codetext VARCHAR not null,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chats(
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    send_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message VARCHAR(1000) not null
);
