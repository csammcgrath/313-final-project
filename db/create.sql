-- DROP command for future needs
DROP TABLE users CASCADE;

CREATE TABLE users
(
    id              SERIAL              PRIMARY KEY,
    username        VARCHAR(75)         NOT NULL UNIQUE,
    password        VARCHAR(255)        NOT NULL,
    isMod           BOOLEAN             NOT NULL
);