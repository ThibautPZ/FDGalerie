
INSERT INTO
    `painting_sizes` (`name`)
VALUES ('MINI'),
    ('MEDIUM'),
    ('MAXI');

INSERT INTO
    `techniques` (`name`)
VALUES ('ACRYLIQUE'),
    ('AQUARELLE'),
    ('HUILE'),
    ('CRAYON_À_PAPIER'),
    ('ENCRE'),
    ('COLLAGE'),
    ('CRAYONS_GRAS');

INSERT INTO `supports` (`name`) VALUES ('PAPIER'), ('TOILE');

INSERT INTO `paintings_availabilities` (`name`)
VALUES ('given'),
    ('sold'),
    ('reserved'),
    ('available'),
    ('unavailable');

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
VALUES ('TRIO_DE_PETITES_SIRÈNES'),
    ('GRENOUILLES_ET_CANARIS');

INSERT INTO
    `paintings` (
        `title`,
        -- `pathname`,
        -- `comment`,
        `width`,
        `height`,
        -- `sold`,
        `family_member`,
        `families_id`,
        `painting_sizes_id`,
        `supports_id`,
        `publicly_visible`,
        `paintings_availabilities_id`
    )
VALUES (
        'Coeur',
        50,
        70,
        NULL,
        NULL,
        3,
        1,
        TRUE,
        4
    ),
    (
        'Peter Pan',
        25,
        31,
        NULL,
        NULL,
        1,
        1,
        TRUE,
        4
    ),
    (
        'Fillette De Profil',
        15,
        20,
        NULL,
        NULL,
        1,
        1,
        TRUE,
        4
    ),
    (
        'Sainte',
        10,
        15,
        NULL,
        NULL,
        1,
        1,
        TRUE,
        4
    ),
    (
        'La Petite Cycliste',
        14,
        14,
        NULL,
        NULL,
        1,
        1,
        TRUE,
        4
    ),
    (
        'Petite Fée',
        20,
        26,
        NULL,
        NULL,
        2,
        1,
        TRUE,
        4
    ),
    (
        'Fleur de Cristal',
        50,
        70,
        NULL,
        NULL,
        3,
        1,
        TRUE,
        4
    ),
    (
        "Winnie l'Ourson",
        50,
        70,
        NULL,
        NULL,
        3,
        1,
        TRUE,
        4
    ),
    (
        'Le Petit Chaperon Rouge Et Le Loup',
        15,
        20,
        NULL,
        NULL,
        1,
        1,
        TRUE,
        4
    ),
    (
        'La Boudeuse',
        17,
        22,
        NULL,
        NULL,
        1,
        1,
        TRUE,
        4
    ),
    (
        'Cigale White Ghost',
        60,
        40,
        NULL,
        NULL,
        2,
        1,
        TRUE,
        4
    ),
    (
        'Entraînement De Natation',
        24,
        30,
        NULL,
        NULL,
        2,
        1,
        TRUE,
        4
    ),
    (
        'La Petite Marquise',
        17,
        22,
        NULL,
        NULL,
        1,
        1,
        TRUE,
        4
    ),
    (
        'Low/High Binding',
        55,
        45,
        NULL,
        NULL,
        2,
        1,
        TRUE,
        4
    ),
    (
        'Petite Sirène Bleue',
        9,
        12,
        NULL,
        NULL,
        1,
        1,
        TRUE,
        4
    ),
    (
        'Broyer Du Noir',
        15,
        22,
        NULL,
        NULL,
        1,
        1,
        TRUE,
        4
    ),
    (
        'Le Poulpe',
        50,
        70,
        NULL,
        NULL,
        3,
        2,
        TRUE,
        4
    ),
    (
        'Maman Baleine Et Son Petit',
        50,
        70,
        NULL,
        NULL,
        3,
        2,
        TRUE,
        4
    ),
    (
        'Coccinelle',
        14,
        18,
        NULL,
        NULL,
        1,
        1,
        TRUE,
        4
    ),
    (
        'Ours Blanc Qui Baille',
        20,
        28,
        NULL,
        NULL,
        2,
        1,
        TRUE,
        4
    ),
    (
        'Pivoine',
        15,
        17,
        NULL,
        NULL,
        2,
        1,
        TRUE,
        4
    ),
    (
        'Petit Chien Sur Fond Rose',
        20,
        30,
        NULL,
        NULL,
        2,
        1,
        TRUE,
        4
    ),
    (
        'Face Au Vent',
        50,
        50,
        NULL,
        NULL,
        2,
        1,
        TRUE,
        4
    ),
    (
        'Petit Nageur',
        40,
        40,
        NULL,
        NULL,
        2,
        1,
        TRUE,
        4
    ),
    (
        'La Famille Dragon',
        70,
        50,
        NULL,
        NULL,
        3,
        2,
        TRUE,
        4
    ),
    (
        'Trio De Petites Sirènes 1',
        9,
        15,
        1,
        1,
        1,
        1,
        TRUE,
        4
    ),
    (
        'Trio De Petites Sirènes 2',
        9,
        15,
        2,
        1,
        1,
        1,
        TRUE,
        4
    ),
    (
        'Trio De Petites Sirènes 3',
        9,
        15,
        3,
        1,
        1,
        1,
        TRUE,
        4
    ),
    (
        'Les Grenouilles',
        50,
        70,
        1,
        2,
        3,
        2,
        TRUE,
        4
    ),
    (
        'Les Canaris',
        50,
        70,
        2,
        2,
        3,
        2,
        TRUE,
        4
    ),
    (
        'Homme Se Baignant',
        50,
        70,
        NULL,
        NULL,
        3,
        2,
        TRUE,
        4
    ),
    (
        "La Transformation d'Ariel",
        19,
        19,
        NULL,
        NULL,
        1,
        1,
        TRUE,
        4
    );

INSERT INTO
    `paintings_storages` (
        `paintings_id`,
        `file_name`,
        `file_extension`
    )
VALUES (
        1,
        'IMG_20201105_170131',
        'jpg'
    ),
    (
        2,
        'IMG_20201105_170209',
        'jpg'
    ),
    (
        3,
        'IMG_20201105_170214',
        'jpg'
    ),
    (
        4,
        'IMG_20201105_170229',
        'jpg'
    ),
    (
        5,
        'IMG_20201105_170302',
        'jpg'
    ),
    (
        6,
        'IMG_20201105_170330',
        'jpg'
    ),
    (
        7,
        'IMG_20210311_075425',
        'jpg'
    ),
    (
        8,
        'IMG_20210521_104729',
        'jpg'
    ),
    (
        9,
        'IMG_20210523_110619',
        'jpg'
    ),
    (
        10,
        'IMG_20210913_173411',
        'jpg'
    ),
    (
        11,
        'IMG_20211009_182603',
        'jpg'
    ),
    (
        12,
        'IMG_20211127_123027',
        'jpg'
    ),
    (
        13,
        'IMG_20220205_185328',
        'jpg'
    ),
    (
        14,
        'IMG_20220307_095839',
        'jpg'
    ),
    (
        15,
        'IMG_20220325_154300',
        'jpg'
    ),
    (
        16,
        'IMG_20220325_154356',
        'jpg'
    ),
    (
        17,
        'IMG_20220819_182819~2',
        'jpg'
    ),
    (
        18,
        'IMG_20221005_115339~2',
        'jpg'
    ),
    (
        19,
        'IMG_20220827_115914~2',
        'jpg'
    ),
    (
        20,
        'IMG_20221009_171709~3',
        'jpg'
    ),
    (
        21,
        'IMG_20221010_204428~2',
        'jpg'
    ),
    (
        22,
        'IMG_20230103_110624~2',
        'jpg'
    ),
    (
        23,
        'IMG_20230226_101355~2',
        'jpg'
    ),
    (
        24,
        'IMG_20230401_180823~2',
        'jpg'
    ),
    (
        25,
        'IMG_20230725_193138~2',
        'jpg'
    ),
    (
        26,
        'IMG_20230728_183456',
        'jpg'
    ),
    (
        27,
        'IMG_20230728_183532',
        'jpg'
    ),
    (
        28,
        'IMG_20230728_183548',
        'jpg'
    ),
    (
        29,
        'IMG_20230923_174804',
        'jpg'
    ),
    (
        30,
        'IMG_20230923_174732',
        'jpg'
    ),
    (
        31,
        'IMG_20230923_231539~2',
        'jpg'
    ),
    (
        32,
        'IMG_20230926_192303',
        'jpg'
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


INSERT INTO
    `paintings_artist_comments` (`paintings_id`, `fr_comment`)
VALUES (
        16,
        'Inspirée par l\'oeuvre de Guillaume Bianco "Billy Brouillard".'
    );