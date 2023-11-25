DROP TABLE IF EXISTS Users;
CREATE TABLE Users (
    username varchar(20) PRIMARY KEY,
    password varchar(20) NOT NULL,
    firstName varchar(20) DEFAULT NULL,
    lastName varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES Users WRITE;
ALTER TABLE Users DISABLE KEYS;
INSERT INTO Users (username, password, firstName, lastName)
    VALUES ('lunaria', 'password', 'Luna', 'Lee');
ALTER TABLE Users ENABLE KEYS;
UNLOCK TABLES;

DROP TABLE IF EXISTS Dreams;
CREATE TABLE Dreams (
    dreamID int(11) PRIMARY KEY,
    title varchar(255) NOT NULL,
    content text NOT NULL,
    dateCreated DATETIME DEFAULT NULL,
    dateEdited DATETIME DEFAULT NULL,
    username varchar(20) NOT NULL,
    FOREIGN KEY (username) REFERENCES Users(username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES Dreams WRITE;
ALTER TABLE Dreams DISABLE KEYS;
INSERT INTO Dreams (dreamID, title, content, dateCreated, dateEdited, username)
    VALUES (1, 'title', 'blablablah', CURDATE(), NULL, 'lunaria');
ALTER TABLE Dreams ENABLE KEYS;
UNLOCK TABLES;
