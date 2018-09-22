DROP TABLE IF EXISTS codestore;
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
    coder_id INTEGER NOT NULL REFERENCES users(id),
    codetext VARCHAR not null
);
