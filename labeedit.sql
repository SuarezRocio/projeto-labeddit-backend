-- Active: 1686423775968@@127.0.0.1@3306

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL
    );

INSERT INTO
    users (id, name, email, password, role)
VALUES (
        'u001',
        'Martin',
        'martin@email.com',
        '$2a$12$8/RfJNMCPKiYEcii0gl9YOW63o67FmB93raqtjbgOyi1nYzQFCzXq',
        'NORMAL'
    ), (
        'u002',
        'Ana',
        'ana@email.com',
        '$2a$12$wXQZt0eeer9QyFBoXQVzluw5i4dCQF9YPygUnTNIa.cP137XTNYs.',
        'NORMAL'
    ), (
        'u003',
        'Lucrecia',
        'lucrecia@email.com',
        '$2a$12$njT4g/iSh9e/uKED35a2HOp5r4TZUDxYzd9sKZk6hQ9US.V5Cfg36',
        'ADMIN'
    );

DROP TABLE users;

SELECT * FROM users;

CREATE TABLE
    post (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        dislikes INTEGER DEFAULT (0) NOT NULL,
        likes INTEGER DEFAULT (0) NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL,
        update_at TEXT DEFAULT (DATETIME()) NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
    );

/*   creator_name TEXT NOT NULL,
 FOREIGN KEY (creator_name) REFERENCES users(name)
 ON UPDATE CASCADE
 ON DELETE CASCADE
 */

/* ON UPDATE CASCADE
 ON DELETE CASCADE
 */

/*  dislikes INTEGER DEFAULT (0) NOT NULL, 
 likes INTEGER DEFAULT (0) NOT NULL, 
 */

INSERT INTO
    post (id, creator_id, content)
VALUES ('p001', 'u001', 'kkkkkk'), (
        'p002',
        'u002',
        'maravilhoso :)'
    ), (
        'p003',
        'u003',
        'obrigado, Parabéns!'
    );

DROP TABLE post;

SELECT * FROM post;

CREATE TABLE
    likes_dislikes (
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        likes INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES post(id) ON UPDATE CASCADE ON DELETE CASCADE
    );

/*   ON UPDATE CASCADE
 ON DELETE CASCADE
 */

INSERT INTO
    likes_dislikes (user_id, post_id, likes)
VALUES ('u001', 'p003', 1), ('u002', 'p001', 2), ('u003', 'p002', 3);

DROP TABLE likes_dislikes;

SELECT * FROM likes_dislikes;

CREATE TABLE
    comment (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        post_id TEXT NOT NULL,
        creator_id TEXT NOT NULL,
        dislikes INTEGER DEFAULT (0) NOT NULL,
        likes INTEGER DEFAULT (0) NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL,
        update_at TEXT DEFAULT (DATETIME()) NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES post(id) ON UPDATE CASCADE ON DELETE CASCADE
    );

INSERT INTO
    comment (
        post_id,
        id,
        creator_id,
        content
    )
VALUES (
        'p001',
        'c001',
        'u001',
        'perfeito'
    ), (
        'p002',
        'c002',
        'u002',
        'visto :)'
    ), (
        'p003',
        'c003',
        'u003',
        'muiito bom'
    );

DROP TABLE comment;

SELECT * FROM comment;

/*
 CREATE TABLE
 post_comment (
 comment_id TEXT NOT NULL,
 post_id TEXT NOT NULL,
 content TEXT NOT NULL,
 FOREIGN KEY (comment_id) REFERENCES comment(id) ON UPDATE CASCADE ON DELETE CASCADE,
 FOREIGN KEY (post_id) REFERENCES post(id) ON UPDATE CASCADE ON DELETE CASCADE
 );
 INSERT INTO
 post_comment (post_id, comment_id, content)
 VALUES ('p001', 'c001', 'perfeito'), ('p002', 'c002', 'visto :)'), ('p003', 'c003', 'muiito bom');
 SELECT * FROM post_comment;
 DROP TABLE post_comment;
 */

CREATE TABLE
    likes_dislikes_comment (
        user_id TEXT NOT NULL,
        comment_id TEXT NOT NULL,
        likes INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (comment_id) REFERENCES comment(id) ON UPDATE CASCADE ON DELETE CASCADE
    );

INSERT INTO
    likes_dislikes_comment (user_id, comment_id, likes)
VALUES ('u001', 'c003', 4), ('u002', 'c001', 3), ('u003', 'c002', 6);

DROP TABLE likes_dislikes_comment;

SELECT * FROM likes_dislikes_comment;

/*CREATE TABLE post_comment (
 post_id TEXT NOT NULL, 
 comment_id TEXT NOT NULL,
 likes INTEGER NOT NULL,
 FOREIGN KEY (post_id) REFERENCES post(id)
 ON UPDATE CASCADE
 ON DELETE CASCADE,
 FOREIGN KEY (comment_id) REFERENCES comment(id)
 ON UPDATE CASCADE
 ON DELETE CASCADE
 );
 DROP TABLE post_comment;
 SELECT * FROM post_comment;
 INSERT INTO post_comment
 (post_id, comment_id, likes)
 VALUES 
 ('p001', 'c003' , 4),
 ('p002', 'c001' , 3),
 ('p003', 'c002' , 6);*/

---------------------------------------------------------

/*POST*/

UPDATE post SET likes = 2, dislikes = 0 WHERE id = 'p001';

UPDATE post SET likes = 1, dislikes = 1 WHERE id = 'p002';

UPDATE post SET likes = 5, dislikes = 4 WHERE id = 'p003';

--------------------------------------------------------------------------------

/*COMMENT*/

UPDATE comment SET likes = 2, dislikes = 0 WHERE id = 'c001';

UPDATE comment SET likes = 1, dislikes = 1 WHERE id = 'c002';

UPDATE comment SET likes = 5, dislikes = 4 WHERE id = 'c003';