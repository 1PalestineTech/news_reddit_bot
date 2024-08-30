DROP TABLE urls;
DROP TABLE admins;
DROP TABLE head_admin;
CREATE TABLE urls (
    url TEXT,
    sub TEXT,
    date NUMERIC DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE admins (
    id TEXT,
    username TEXT,
    password TEXT,
    PRIMARY KEY(id)
);
CREATE TABLE head_admin (
    id TEXT,
    FOREIGN KEY (id) REFERENCES admins(id)
);
INSERT INTO admins(id,username,password) VALUES (
    'JjbRfZ9BYFG78acKrmAA',
    'admin',
    'scrypt:32768:8:1$WVpVGNZBNeXggdAb$c6e1b34cca523ff4cc0e59914a0734e3cd60b2c6248c729e860d947e688f88a1c7ded077c487502cf4091c4a693880a1b80c899ab7c21887b9b285ec407a9620'
);
INSERT INTO head_admin (id) VALUES ('JjbRfZ9BYFG78acKrmAA');
