-- Active: 1689174540931@@127.0.0.1@3306@fannydeglave

CREATE TABLE IF NOT EXISTS `painting_sizes` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(64) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `techniques` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(128) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `families` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(128) NOT NULL,
    `description` VARCHAR(10000) NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `supports` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(64) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `user_types` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(64) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `genders` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(64) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `account_states` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(64) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `paintings_availabilities` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(64) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `paintings` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(128) NOT NULL,
    -- `pathname` VARCHAR(128) NOT NULL,
    -- `comment` VARCHAR(10000) NULL,
    `width` INT NOT NULL,
    `height` INT NOT NULL,
    `family_member` INT NULL,
    `families_id` INT NULL,
    `painting_sizes_id` INT NOT NULL,
    `supports_id` INT NOT NULL,
    `publicly_visible` TINYINT NOT NULL,
    `paintings_availabilities_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_paintings_families` FOREIGN KEY (`families_id`) REFERENCES `families` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `fk_paintings_painting_sizes` FOREIGN KEY (`painting_sizes_id`) REFERENCES `painting_sizes` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `fk_paintings_supports` FOREIGN KEY (`supports_id`) REFERENCES `supports` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `fk_paintings_availabilities` FOREIGN KEY (`paintings_availabilities_id`) REFERENCES `paintings_availabilities` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `paintings_has_techniques` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `paintings_id` INT NOT NULL,
    `techniques_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_paintings_has_techniques_paintings` FOREIGN KEY (`paintings_id`) REFERENCES `paintings` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `fk_paintings_has_techniques_techniques` FOREIGN KEY (`techniques_id`) REFERENCES `techniques` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `paintings_storages` (
    `paintings_id` INT NOT NULL,
    `file_name` VARCHAR(64) NOT NULL,
    `file_extension` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`paintings_id`),
    CONSTRAINT `fk_paintings_storages_paintings` FOREIGN KEY (`paintings_id`) REFERENCES `paintings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `users` (
    `users_id` INT NOT NULL AUTO_INCREMENT,
    `lastname` VARCHAR(128) NULL,
    `firstname` VARCHAR(128) NULL,
    `address` VARCHAR(128) NULL,
    `postal_code` VARCHAR(45) NULL,
    `city` VARCHAR(45) NULL,
    `phone_number1` VARCHAR(45) NULL,
    `phone_number2` VARCHAR(45) NULL,
    `email` VARCHAR(128) NOT NULL,
    `hashedPassword` VARCHAR(128) NOT NULL,
    `account_date` VARCHAR(64) NOT NULL,
    `language` VARCHAR(64) NULL,
    -- `ban_message_id` INT NULL,
    `gender_id` INT NULL,
    `user_types_id` INT NOT NULL,
    `account_states_id` INT NOT NULL,
    PRIMARY KEY (`users_id`),
    -- CONSTRAINT `fk_users_ban_message` FOREIGN KEY (`ban_message_id`) REFERENCES `ban_messages` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `fk_users_genders` FOREIGN KEY (`gender_id`) REFERENCES `genders` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `fk_users_user_types` FOREIGN KEY (`user_types_id`) REFERENCES `user_types` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `fk_users_account_states` FOREIGN KEY (`account_states_id`) REFERENCES `account_states` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `contacts` (
    `contacts_id` INT NOT NULL AUTO_INCREMENT,
    `lastname` VARCHAR(128) NULL,
    `firstname` VARCHAR(128) NULL,
    `address` VARCHAR(128) NULL,
    `postal_code` VARCHAR(45) NULL,
    `city` VARCHAR(45) NULL,
    `phone_number1` VARCHAR(45) NULL,
    `phone_number2` VARCHAR(45) NULL,
    `email` VARCHAR(128) NULL,
    `language` VARCHAR(64) NULL,
    `creation_date` VARCHAR(64) NOT NULL,
    PRIMARY KEY (`contacts_id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `painting_gifts` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `date` VARCHAR(64) NULL,
    `paintings_id` INT NOT NULL,
    `users_id` INT NULL,
    `contacts_id` INT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`users_id`) REFERENCES `users` (`users_id`),
    FOREIGN KEY (`contacts_id`) REFERENCES `contacts` (`contacts_id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `painting_sales` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `price` DECIMAL NOT NULL,
    `date` VARCHAR(45) NULL,
    `paintings_id` INT NOT NULL,
    `users_id` INT NULL,
    `contacts_id` INT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`users_id`) REFERENCES `users` (`users_id`),
    FOREIGN KEY (`contacts_id`) REFERENCES `contacts` (`contacts_id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `painting_reservations` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `price` DECIMAL NULL,
    `date` VARCHAR(45) NULL,
    `paintings_id` INT NOT NULL,
    `users_id` INT NULL,
    `contacts_id` INT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`users_id`) REFERENCES `users` (`users_id`),
    FOREIGN KEY (`contacts_id`) REFERENCES `contacts` (`contacts_id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `ban_messages` (
    `users_id` INT NOT NULL,
    `message` VARCHAR(10000) NOT NULL,
    PRIMARY KEY (`users_id`),
    CONSTRAINT `users_id` FOREIGN KEY (`users_id`) REFERENCES `users` (`users_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `favorite_paintings` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `paintings_id` INT NOT NULL,
    `users_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_paintings_has_users_paintings1` FOREIGN KEY (`paintings_id`) REFERENCES `paintings` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `fk_paintings_has_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`users_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `painting_user_comments` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `comment` VARCHAR(10000) NOT NULL,
    `date` VARCHAR(64) NOT NULL,
    `paintings_id` INT NOT NULL,
    `users_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_paintings_has_users_paintings2` FOREIGN KEY (`paintings_id`) REFERENCES `paintings` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `fk_paintings_has_users2` FOREIGN KEY (`users_id`) REFERENCES `users` (`users_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `paintings_artist_comments` (
    `paintings_id` INT NOT NULL,
    `comment` VARCHAR(10000) NOT NULL,
    PRIMARY KEY (`paintings_id`),
    CONSTRAINT `fk_artist_comments_paintings` FOREIGN KEY (`paintings_id`) REFERENCES `paintings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(128) NOT NULL,
    `created_at` VARCHAR(64) NOT NULL,
    `expires_at` VARCHAR(64) NOT NULL,
    `user_id` INT NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;