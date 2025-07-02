-- Active: 1689174540931@@127.0.0.1@3306@fannydeglave

INSERT INTO
    `painting_sizes` (`name`)
VALUES ('Mini'),
    ('Medium'),
    ('Maxi');

INSERT INTO
    `techniques` (`name`)
VALUES ('Acrylique'),
    ('Aquarelle'),
    ('Huile'),
    ('Crayon à papier'),
    ('Encre'),
    ('Collage'),
    ('Crayons gras');

INSERT INTO `supports` (`name`) VALUES ('Papier'), ('Toile');

INSERT INTO
    `user_types` (`name`)
VALUES ('User'),
    ('Administrator');

INSERT INTO
    `account_states` (`name`)
VALUES ('Active'),
    ('Warned'),
    ('Banned'),
    ('Deleted'),
    ('Unsubscribed');

INSERT INTO
    `genders` (`name`)
VALUES ('Femme'),
    ('Homme'),
    ('Non binaire'),
    ('Non renseigné');

INSERT INTO
    `users` (
        `lastname`,
        `firstname`,
        `address`,
        `postal_code`,
        `city`,
        `phone_number1`,
        `phone_number2`,
        `email`,
        `hashedPassword`,
        `account_date`,
        `gender_id`,
        `user_types_id`,
        `account_states_id`
    )
VALUES (
        'D.',
        'Fanny',
        '01 route exemple',
        "31000",
        'ville',
        '0102030405',
        '1112131415',
        "fanny@toto.com",
        "$argon2id$v=19$m=65536,t=5,p=1$iH2/MZlmCRwnmGYcgFD34Q$RZpjT5J5J8d9Cgm6oX+ZxWrfxraK6W2NC3eZ55t0ZA8",
        'September 27, 2023 12:00:00',
        1,
        2,
        1
    ),
    (
        'Doe',
        'John',
        '01 route exemple',
        "31000",
        'ville',
        '0102030405',
        '1112131415',
        "john@toto.com",
        "$argon2id$v=19$m=65536,t=5,p=1$iH2/MZlmCRwnmGYcgFD34Q$RZpjT5J5J8d9Cgm6oX+ZxWrfxraK6W2NC3eZ55t0ZA8",
        'September 27, 2023 12:00:00',
        2,
        1,
        1
    );

INSERT INTO
    `contacts` (
        `lastname`,
        `firstname`,
        `address`,
        `postal_code`,
        `city`,
        `phone_number1`,
        `phone_number2`,
        `email`,
        `language`,
        `creation_date`
    )
VALUES (
        'Amala',
        'Axala',
        '01 route exemple',
        "31000",
        'ville',
        '0102030405',
        '1112131415',
        "axala@toto.com",
        "fr",
        'September 27, 2023 12:00:00'
    );

INSERT INTO
    `families` (`name`)
VALUES ('Trio De Petites Sirènes'),
    ('Grenouilles Et Canaris');

INSERT INTO
    `paintings` (
        `title`,
        `pathname`,
        `comment`,
        `width`,
        `height`,
        `sold`,
        `family_member`,
        `families_id`,
        `painting_sizes_id`,
        `supports_id`
    )
VALUES (
        'Coeur',
        'IMG_20201105_170131.jpg',
        NULL,
        50,
        70,
        FALSE,
        NULL,
        NULL,
        3,
        1
    ),
    (
        'Peter Pan',
        'IMG_20201105_170209.jpg',
        NULL,
        25,
        31,
        FALSE,
        NULL,
        NULL,
        1,
        1
    ),
    (
        'Fillette De Profil',
        'IMG_20201105_170214.jpg',
        NULL,
        15,
        20,
        FALSE,
        NULL,
        NULL,
        1,
        1
    ),
    (
        'Sainte',
        'IMG_20201105_170229.jpg',
        NULL,
        10,
        15,
        FALSE,
        NULL,
        NULL,
        1,
        1
    ),
    (
        'La Petite Cycliste',
        'IMG_20201105_170302.jpg',
        NULL,
        14,
        14,
        FALSE,
        NULL,
        NULL,
        1,
        1
    ),
    (
        'Petite Fée',
        'IMG_20201105_170330.jpg',
        NULL,
        20,
        26,
        FALSE,
        NULL,
        NULL,
        2,
        1
    ),
    (
        'Fleur de Cristal',
        'IMG_20210311_075425.jpg',
        NULL,
        50,
        70,
        TRUE,
        NULL,
        NULL,
        3,
        1
    ),
    (
        "Winnie l'Ourson",
        'IMG_20210521_104729.jpg',
        NULL,
        50,
        70,
        TRUE,
        NULL,
        NULL,
        3,
        1
    ),
    (
        'Le Petit Chaperon Rouge Et Le Loup',
        'IMG_20210523_110619.jpg',
        NULL,
        15,
        20,
        FALSE,
        NULL,
        NULL,
        1,
        1
    ),
    (
        'La Boudeuse',
        'IMG_20210913_173411.jpg',
        NULL,
        17,
        22,
        FALSE,
        NULL,
        NULL,
        1,
        1
    ),
    (
        'Cigale White Ghost',
        'IMG_20211009_182603.jpg',
        null,
        60,
        40,
        TRUE,
        NULL,
        NULL,
        2,
        1
    ),
    (
        'Entraînement De Natation',
        'IMG_20211127_123027.jpg',
        NULL,
        24,
        30,
        FALSE,
        NULL,
        NULL,
        2,
        1
    ),
    (
        'La Petite Marquise',
        'IMG_20220205_185328.jpg',
        NULL,
        17,
        22,
        TRUE,
        NULL,
        NULL,
        1,
        1
    ),
    (
        'Low/High Binding',
        'IMG_20220307_095839.jpg',
        NULL,
        55,
        45,
        TRUE,
        NULL,
        NULL,
        2,
        1
    ),
    (
        'Petite Sirène Bleue',
        'IMG_20220325_154300.jpg',
        NULL,
        9,
        12,
        FALSE,
        NULL,
        NULL,
        1,
        1
    ),
    (
        'Broyer Du Noir',
        'IMG_20220325_154356.jpg',
        'Inspirée par l\'oeuvre de Guillaume Bianco "Billy Brouillard".',
        15,
        22,
        FALSE,
        NULL,
        NULL,
        1,
        1
    ),
    (
        'Le Poulpe',
        'IMG_20220819_182819~2.jpg',
        NULL,
        50,
        70,
        FALSE,
        NULL,
        NULL,
        3,
        2
    ),
    (
        'Maman Baleine Et Son Petit',
        'IMG_20220827_115914~2.jpg',
        NULL,
        50,
        70,
        FALSE,
        NULL,
        NULL,
        3,
        2
    ),
    (
        'Coccinelle',
        'IMG_20221005_115339~2.jpg',
        NULL,
        14,
        18,
        FALSE,
        NULL,
        NULL,
        1,
        1
    ),
    (
        'Ours Blanc Qui Baille',
        'IMG_20221009_171709~3.jpg',
        NULL,
        20,
        28,
        FALSE,
        NULL,
        NULL,
        2,
        1
    ),
    (
        'Pivoine',
        'IMG_20221010_204428~2.jpg',
        NULL,
        15,
        17,
        FALSE,
        NULL,
        NULL,
        2,
        1
    ),
    (
        'Petit Chien Sur Fond Rose',
        'IMG_20230103_110624~2.jpg',
        NULL,
        20,
        30,
        FALSE,
        NULL,
        NULL,
        2,
        1
    ),
    (
        'Face Au Vent',
        'IMG_20230226_101355~2.jpg',
        NULL,
        50,
        50,
        FALSE,
        NULL,
        NULL,
        2,
        1
    ),
    (
        'Petit Nageur',
        'IMG_20230401_180823~2.jpg',
        NULL,
        40,
        40,
        TRUE,
        NULL,
        NULL,
        2,
        1
    ),
    (
        'La Famille Dragon',
        'IMG_20230725_193138~2.jpg',
        NULL,
        70,
        50,
        TRUE,
        NULL,
        NULL,
        3,
        2
    ),
    (
        'Trio De Petites Sirènes 1',
        'IMG_20230728_183456.jpg',
        NULL,
        9,
        15,
        TRUE,
        1,
        1,
        1,
        1
    ),
    (
        'Trio De Petites Sirènes 2',
        'IMG_20230728_183532.jpg',
        NULL,
        9,
        15,
        TRUE,
        2,
        1,
        1,
        1
    ),
    (
        'Trio De Petites Sirènes 3',
        'IMG_20230728_183548.jpg',
        NULL,
        9,
        15,
        TRUE,
        3,
        1,
        1,
        1
    ),
    (
        'Les Grenouilles',
        'IMG_20230923_174804.jpg',
        NULL,
        50,
        70,
        FALSE,
        1,
        2,
        3,
        2
    ),
    (
        'Les Canaris',
        'IMG_20230923_174732.jpg',
        NULL,
        50,
        70,
        FALSE,
        2,
        2,
        3,
        2
    ),
    (
        'Homme Se Baignant',
        'IMG_20230923_231539~2.jpg',
        NULL,
        50,
        70,
        FALSE,
        NULL,
        NULL,
        3,
        2
    ),
    (
        "La Transformation d'Ariel",
        'IMG_20230926_192303.jpg',
        NULL,
        19,
        19,
        FALSE,
        NULL,
        NULL,
        1,
        1
    );

INSERT INTO
    `paintings_has_techniques` (
        `paintings_id`,
        `techniques_id`
    )
VALUES (1, 2),
    (2, 2),
    (2, 4),
    (3, 4),
    (4, 4),
    (5, 4),
    (6, 2),
    (6, 4),
    (7, 2),
    (7, 5),
    (8, 2),
    (9, 2),
    (9, 4),
    (9, 5),
    (9, 6),
    (10, 4),
    (11, 2),
    (12, 2),
    (12, 5),
    (13, 2),
    (14, 2),
    (14, 4),
    (14, 5),
    (15, 2),
    (16, 4),
    (16, 5),
    (16, 7),
    (17, 2),
    (18, 2),
    (18, 4),
    (19, 2),
    (19, 5),
    (20, 2),
    (20, 4),
    (21, 2),
    (22, 2),
    (23, 1),
    (24, 1),
    (25, 2),
    (25, 5),
    (26, 2),
    (26, 5),
    (27, 2),
    (27, 5),
    (28, 2),
    (28, 5),
    (29, 1),
    (30, 1),
    (31, 1),
    (32, 2);