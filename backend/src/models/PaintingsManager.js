const AbstractManager = require("./AbstractManager");

class PaintingsManager extends AbstractManager {
  constructor() {
    super({ table: "paintings" });
  }

  async readByTitle(title) {
    return this.database.query(
      `SELECT  p.id, p.title, p.width, p.height, p.family_member AS familyMember, p.families_id AS familyId, f.name AS family, ps.name AS format, s.name as support
      FROM ${this.table} AS p LEFT JOIN painting_sizes AS ps ON p.painting_sizes_id = ps.id
      LEFT JOIN families AS f ON p.families_id = f.id
      LEFT JOIN supports AS s ON p.supports_id = s.id
      WHERE p.title = ?`,
      [title]
    );
  }

  async readPublicByTitle(title) {
    return this.database.query(
      `SELECT  p.id, p.title, p.width, p.height, p.paintings_availabilities_id AS oeuvreAvailability, pa.name AS availabilityName, p.family_member AS familyMember, p.families_id AS familyId, f.name AS family, ps.name AS format, s.name as support, pst.file_name AS filename, pst.file_extension AS fileExtension, pac.comment AS artistComment
      FROM ${this.table} AS p LEFT JOIN painting_sizes AS ps ON p.painting_sizes_id = ps.id
      LEFT JOIN families AS f ON p.families_id = f.id
      LEFT JOIN supports AS s ON p.supports_id = s.id
      LEFT JOIN paintings_storages AS pst ON p.id = pst.paintings_id
      LEFT JOIN paintings_artist_comments AS pac ON p.id = pac.paintings_id
      LEFT JOIN paintings_availabilities AS pa ON p.paintings_availabilities_id = pa.id
      WHERE p.title = ? AND p.publicly_visible = ?`,
      [title, true]
    );
  }

  async readAllPublicMinimalInfos() {
    return this.database.query(
      `SELECT  p.id, p.title, pst.file_name AS filename, pst.file_extension AS fileExtension
      FROM ${this.table} AS p LEFT JOIN paintings_storages AS pst ON p.id = pst.paintings_id
      WHERE p.publicly_visible = ?`,
      [true]
    );
  }

  async findByTitle({ title }) {
    return this.database.query(
      `SELECT title FROM ${this.table} WHERE title = ? `,
      [title]
    );
  }

  async findById({ id }) {
    return this.database.query(
      `SELECT p.id, p.title
    FROM ${this.table} AS p
    WHERE p.id = ?`,
      [id]
    );
  }

  async findAllFamilyMembers(familyId, currentMemberId) {
    return this.database.query(
      `SELECT p.id AS id, p.title AS title, p.family_member AS familyMember FROM ${this.table} AS p LEFT JOIN families AS f ON p.families_id = f.id WHERE f.id = ? AND p.id <> ?`,
      [familyId, currentMemberId]
    );
  }

  async readAssociatedSizes() {
    return this.database.query(
      `SELECT DISTINCT ps.name AS format FROM ${this.table} AS p LEFT JOIN painting_sizes AS ps ON p.painting_sizes_id = ps.id`
    );
  }

  async readAssociatedTechniques() {
    return this.database.query(
      `SELECT DISTINCT t.name AS technique FROM paintings_has_techniques AS pht LEFT JOIN ${this.table} AS p ON pht.paintings_id = p.id LEFT JOIN techniques AS t ON pht.techniques_id = t.id; `
    );
  }

  async readPublicPaintingByTech(technique) {
    return this.database.query(
      `SELECT p.id, p.title, pst.file_name AS filename, pst.file_extension AS fileExtension
      FROM ${this.table} AS p RIGHT JOIN paintings_has_techniques AS pht ON pht.paintings_id = p.id
      RIGHT JOIN techniques AS t ON pht.techniques_id = t.id
      LEFT JOIN paintings_storages AS pst ON p.id = pst.paintings_id
      WHERE t.name = ? AND p.publicly_visible = ?`,
      [technique, true]
    );
  }

  async readPaintingBySize(format) {
    return this.database.query(
      `SELECT p.id, p.title, p.pathname FROM ${this.table} AS p LEFT JOIN painting_sizes AS ps ON p.painting_sizes_id = ps.id WHERE ps.name = ?`,
      [format]
    );
  }

  async readPublicPaintingBySize(formatName) {
    return this.database.query(
      `SELECT p.id, p.title, pst.file_name AS filename, pst.file_extension AS fileExtension
      FROM ${this.table} AS p
      RIGHT JOIN painting_sizes AS ps ON p.painting_sizes_id = ps.id
      LEFT JOIN paintings_storages AS pst ON p.id = pst.paintings_id
      WHERE ps.name = ? AND p.publicly_visible = ?`,
      [formatName, true]
    );
  }

  async readAdminWithDetails() {
    return this.database.query(
      `SELECT p.id, p.title, p.width, p.height, p.paintings_availabilities_id AS oeuvreAvailability, p.publicly_visible AS publiclyVisible, pa.name AS availabilityName, p.family_member AS familyMember, p.families_id AS familyId,  JSON_ARRAYAGG(t.name) AS techniques,
      f.name AS family, ps.name AS format, s.name as support, pst.file_name AS fileName, pst.file_extension AS fileExtension, pac.fr_comment AS artistCommentFr, pac.en_US_comment AS artistCommentEnUS, pac.en_GB_comment AS artistCommentEnGB, GROUP_CONCAT(pg.id SEPARATOR "|") AS giftNumber, GROUP_CONCAT(pg.date SEPARATOR "|") AS giftDate, GROUP_CONCAT(pg.users_id SEPARATOR "|") AS giftUserId, GROUP_CONCAT(pg.contacts_id SEPARATOR "|") AS giftContactId, GROUP_CONCAT(psl.id SEPARATOR "|") AS saleNumber, GROUP_CONCAT(psl.price SEPARATOR "|") AS salePrice, GROUP_CONCAT(psl.date SEPARATOR "|") AS saleDate, GROUP_CONCAT(psl.users_id SEPARATOR "|") AS saleUserId, GROUP_CONCAT(psl.contacts_id SEPARATOR "|") AS saleContactId,
      GROUP_CONCAT(pg.id SEPARATOR "|") AS giftNumber, GROUP_CONCAT(pg.date SEPARATOR "|") AS giftDate, GROUP_CONCAT(pg.users_id SEPARATOR "|") AS giftUserId, GROUP_CONCAT(pg.contacts_id SEPARATOR "|") AS giftContactId, GROUP_CONCAT(psl.id SEPARATOR "|") AS saleNumber, GROUP_CONCAT(psl.price SEPARATOR "|") AS salePrice, GROUP_CONCAT(psl.date SEPARATOR "|") AS saleDate, GROUP_CONCAT(psl.users_id SEPARATOR "|") AS saleUserId, GROUP_CONCAT(psl.contacts_id SEPARATOR "|") AS saleContactId,
      GROUP_CONCAT(pr.id SEPARATOR "|") AS reservationNumber, GROUP_CONCAT(pr.price SEPARATOR "|") AS reservationPrice, GROUP_CONCAT(pr.date SEPARATOR "|") AS reservationDate, GROUP_CONCAT(pr.users_id SEPARATOR "|") AS reservationUserId, GROUP_CONCAT(pr.contacts_id SEPARATOR "|") AS reservationContactId
      FROM ${this.table} AS p LEFT JOIN painting_sizes AS ps ON p.painting_sizes_id = ps.id
      LEFT JOIN families AS f ON p.families_id = f.id
      LEFT JOIN supports AS s ON p.supports_id = s.id
      LEFT JOIN paintings_has_techniques AS pht ON p.id = pht.paintings_id
      LEFT JOIN techniques AS t ON pht.techniques_id = t.id
      LEFT JOIN paintings_storages AS pst ON p.id = pst.paintings_id
      LEFT JOIN paintings_artist_comments AS pac ON p.id = pac.paintings_id
      LEFT JOIN paintings_availabilities AS pa ON p.paintings_availabilities_id = pa.id
      LEFT JOIN painting_gifts AS pg ON p.id = pg.paintings_id
      LEFT JOIN painting_sales AS psl ON p.id = psl.paintings_id
      LEFT JOIN painting_reservations AS pr ON p.id = pr.paintings_id
      GROUP BY p.id;`
    );
  }

  async findOneAdminWithDetails(id) {
    return this.database.query(
      `SELECT p.id, p.title, p.width, p.height, p.paintings_availabilities_id AS oeuvreAvailability, pa.name AS availabilityName, p.publicly_visible AS publiclyVisible, p.family_member AS familyMember, p.families_id AS familyId, JSON_ARRAYAGG(JSON_OBJECT('id', t.id, 'name', t.name)) AS techniques,
      f.name AS family, ps.name AS format, ps.id AS formatId, s.name as support, s.id AS supportId, pst.file_name AS fileName, pst.file_extension AS fileExtension, pac.fr_comment AS artistCommentFr, pac.en_US_comment AS artistCommentEnUS, pac.en_GB_comment AS artistCommentEnGB
      FROM ${this.table} AS p LEFT JOIN painting_sizes AS ps ON p.painting_sizes_id = ps.id
      LEFT JOIN families AS f ON p.families_id = f.id
      LEFT JOIN supports AS s ON p.supports_id = s.id
      LEFT JOIN paintings_has_techniques AS pht ON p.id = pht.paintings_id
      LEFT JOIN techniques AS t ON pht.techniques_id = t.id
      LEFT JOIN paintings_storages AS pst ON p.id = pst.paintings_id
      LEFT JOIN paintings_artist_comments AS pac ON p.id = pac.paintings_id
      LEFT JOIN paintings_availabilities AS pa ON p.paintings_availabilities_id = pa.id
      WHERE p.id = ? GROUP BY p.id;`,
      [id]
    );
  }

  async findAllPaintingsBySupportId(supportId) {
    return this.database.query(
      `SELECT p.id, p.title,  p.width, p.height, p.paintings_availabilities_id AS oeuvreAvailability, pa.name AS availabilityName, p.publicly_visible AS publiclyVisible,
      p.family_member AS familyMember, p.families_id AS familyId, JSON_ARRAYAGG(t.name) AS techniques, f.name AS family, ps.name AS format, ps.id AS formatId,
      s.name as support, s.id AS supportId, pst.file_name AS fileName, pst.file_extension AS fileExtension, pac.fr_comment AS artistCommentFr, pac.en_US_comment AS artistCommentEnUS,
      pac.en_GB_comment AS artistCommentEnGB
      FROM ${this.table} AS p LEFT JOIN painting_sizes AS ps ON p.painting_sizes_id = ps.id
      LEFT JOIN families AS f ON p.families_id = f.id
      LEFT JOIN supports AS s ON p.supports_id = s.id
      LEFT JOIN paintings_has_techniques AS pht ON p.id = pht.paintings_id
      LEFT JOIN techniques AS t ON pht.techniques_id = t.id
      LEFT JOIN paintings_storages AS pst ON p.id = pst.paintings_id
      LEFT JOIN paintings_artist_comments AS pac ON p.id = pac.paintings_id
      LEFT JOIN paintings_availabilities AS pa ON p.paintings_availabilities_id = pa.id
      WHERE p.supports_id = ? GROUP BY p.id;`,
      [supportId]
    );
  }

  async findAllPaintingsBySize(sizeId) {
    return this.database.query(
      `SELECT p.id, p.title,  p.width, p.height, p.paintings_availabilities_id AS oeuvreAvailability, pa.name AS availabilityName, p.publicly_visible AS publiclyVisible,
      p.family_member AS familyMember, p.families_id AS familyId, JSON_ARRAYAGG(t.name) AS techniques, f.name AS family, ps.name AS format, ps.id AS formatId,
      s.name as support, s.id AS supportId, pst.file_name AS fileName, pst.file_extension AS fileExtension, pac.fr_comment AS artistCommentFr, pac.en_US_comment AS artistCommentEnUS,
      pac.en_GB_comment AS artistCommentEnGB
      FROM ${this.table} AS p LEFT JOIN painting_sizes AS ps ON p.painting_sizes_id = ps.id
      LEFT JOIN families AS f ON p.families_id = f.id
      LEFT JOIN supports AS s ON p.supports_id = s.id
      LEFT JOIN paintings_has_techniques AS pht ON p.id = pht.paintings_id
      LEFT JOIN techniques AS t ON pht.techniques_id = t.id
      LEFT JOIN paintings_storages AS pst ON p.id = pst.paintings_id
      LEFT JOIN paintings_artist_comments AS pac ON p.id = pac.paintings_id
      LEFT JOIN paintings_availabilities AS pa ON p.paintings_availabilities_id = pa.id
      WHERE p.painting_sizes_id = ? GROUP BY p.id;`,
      [sizeId]
    );
  }

  async findAllPaintingsByFamilyId(familyId) {
    return this.database.query(
      `SELECT p.id, p.title,  p.width, p.height, p.paintings_availabilities_id AS oeuvreAvailability, pa.name AS availabilityName, p.publicly_visible AS publiclyVisible,
      p.family_member AS familyMember, p.families_id AS familyId, JSON_ARRAYAGG(t.name) AS techniques, f.name AS family, ps.name AS format, ps.id AS formatId,
      s.name as support, s.id AS supportId, pst.file_name AS fileName, pst.file_extension AS fileExtension, pac.fr_comment AS artistCommentFr, pac.en_US_comment AS artistCommentEnUS,
      pac.en_GB_comment AS artistCommentEnGB
      FROM ${this.table} AS p LEFT JOIN painting_sizes AS ps ON p.painting_sizes_id = ps.id
      LEFT JOIN families AS f ON p.families_id = f.id
      LEFT JOIN supports AS s ON p.supports_id = s.id
      LEFT JOIN paintings_has_techniques AS pht ON p.id = pht.paintings_id
      LEFT JOIN techniques AS t ON pht.techniques_id = t.id
      LEFT JOIN paintings_storages AS pst ON p.id = pst.paintings_id
      LEFT JOIN paintings_artist_comments AS pac ON p.id = pac.paintings_id
      LEFT JOIN paintings_availabilities AS pa ON p.paintings_availabilities_id = pa.id
      WHERE p.families_id = ? GROUP BY p.id;`,
      [familyId]
    );
  }

  async createNewPainting({
    oeuvreTitle,
    oeuvreWidth,
    oeuvreHeight,
    familyMember,
    oeuvreFamily,
    oeuvreFormat,
    oeuvreSupport,
    oeuvreVisibility,
    oeuvreAvailability,
  }) {
    return this.database.query(
      `INSERT INTO ${this.table} (title, width, height, family_member, families_id, painting_sizes_id, supports_id, publicly_visible, paintings_availabilities_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        oeuvreTitle,
        oeuvreWidth,
        oeuvreHeight,
        familyMember,
        oeuvreFamily,
        oeuvreFormat,
        oeuvreSupport,
        oeuvreVisibility,
        oeuvreAvailability,
      ]
    );
  }

  async modifyPaintingById(paintingData, paintingId) {
    const queryTailArr = [];
    const queryValues = [];

    for (const [columnName, value] of Object.entries(paintingData)) {
      queryTailArr.push(`${columnName} = ?`);
      queryValues.push(value);
    }
    const queryTail = queryTailArr.join(", ");
    queryValues.push(paintingId);
    const queryBody = `UPDATE ${this.table} SET ${queryTail} WHERE id = ?;`;

    return this.database.query(queryBody, queryValues);
  }

  async deletePaintingById(paintingId) {
    return this.database.query(`DELETE FROM ${this.table} WHERE id = ?`, [
      paintingId,
    ]);
  }
}

module.exports = PaintingsManager;
