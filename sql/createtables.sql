DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL primary key,
    fname VARCHAR(255) not null,
    lname VARCHAR(255) not null,
    email VARCHAR(255) not null UNIQUE,
    password  VARCHAR(255) not NULL
);
