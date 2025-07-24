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
      `SELECT  p.id, p.title, p.width, p.height, p.paintings_availabilities_id AS oeuvreAvailability, p.family_member AS familyMember, p.families_id AS familyId, f.name AS family, ps.name AS format, s.name as support, pst.file_name AS filename, pst.file_extension AS fileExtension, pac.comment AS artistComment
      FROM ${this.table} AS p LEFT JOIN painting_sizes AS ps ON p.painting_sizes_id = ps.id
      LEFT JOIN families AS f ON p.families_id = f.id
      LEFT JOIN supports AS s ON p.supports_id = s.id
      LEFT JOIN paintings_storages AS pst ON p.id = pst.paintings_id
      LEFT JOIN paintings_artist_comments AS pac ON p.id = pac.paintings_id
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

  async findByTitle(title) {
    return this.database.query(
      `SELECT title FROM ${this.table} WHERE title = ? `,
      [title]
    );
  }

  async findAllFamilyMembers(familyId, currentMemberId) {
    return this.database.query(
      `SELECT  p.title AS sister FROM ${this.table} AS p LEFT JOIN families AS f ON p.families_id = f.id WHERE f.id = ? AND p.id <> ?`,
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
      `SELECT  p.id, p.title, p.width, p.height, p.paintings_availabilities_id AS oeuvreAvailability, p.family_member AS familyMember, p.families_id AS familyId, f.name AS family, ps.name AS format, s.name as support, pst.file_name AS filename, pst.file_extension AS fileExtension, pac.comment AS artistComment, GROUP_CONCAT(t.name SEPARATOR "|") AS techniques
      FROM ${this.table} AS p LEFT JOIN painting_sizes AS ps ON p.painting_sizes_id = ps.id
      LEFT JOIN families AS f ON p.families_id = f.id
      LEFT JOIN supports AS s ON p.supports_id = s.id
      LEFT JOIN paintings_has_techniques AS pht ON p.id = pht.paintings_id
      LEFT JOIN techniques AS t ON pht.techniques_id = t.id
      LEFT JOIN paintings_storages AS pst ON p.id = pst.paintings_id
      LEFT JOIN paintings_artist_comments AS pac ON p.id = pac.paintings_id
      GROUP BY p.id
      `
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

  async deletePaintingById(paintingId) {
    return this.database.query(`DELETE FROM ${this.table} WHERE id = ?`, [
      paintingId,
    ]);
  }
}

module.exports = PaintingsManager;
