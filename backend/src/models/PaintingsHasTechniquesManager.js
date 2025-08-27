const AbstractManager = require("./AbstractManager");

class PaintingsHasTechniquesManager extends AbstractManager {
  constructor() {
    super({ table: "paintings_has_techniques" });
  }

  async readAll() {
    return this.database.query(`SELECT name, id FROM ${this.table} `);
  }

  async findPaintingsIdByTechniqueId({ techniqueId }) {
    return this.database.query(
      `SELECT pht.paintings_id AS id
      FROM ${this.table} AS pht
      WHERE pht.techniques_id = ?`,
      [techniqueId]
    );
  }

  async findAllPaintingsByTechniqueId(techniqueId) {
    return this.database.query(
      `SELECT p.id AS id, p.title AS title, p.width AS width, p.height AS height, p.paintings_availabilities_id AS oeuvreAvailability, p.publicly_visible AS publiclyVisible,
      pa.name AS availabilityName, p.family_member AS familyMember, p.families_id AS familyId, JSON_ARRAYAGG(t.name) AS techniques,
      f.name AS family, ps.name AS format, s.name as support,
      pst.file_name AS fileName, pst.file_extension AS fileExtension, pac.fr_comment AS artistCommentFr, pac.en_US_comment AS artistCommentEnUS, pac.en_GB_comment AS artistCommentEnGB
      FROM ${this.table} AS pht
      LEFT JOIN paintings AS p ON pht.paintings_id = p.id
      LEFT JOIN painting_sizes AS ps ON p.painting_sizes_id = ps.id
      LEFT JOIN families AS f ON p.families_id = f.id
      LEFT JOIN supports AS s ON p.supports_id = s.id
      LEFT JOIN paintings_artist_comments AS pac ON p.id = pac.paintings_id
      LEFT JOIN paintings_availabilities AS pa ON p.paintings_availabilities_id = pa.id
      LEFT JOIN techniques AS t ON pht.techniques_id = t.id
      LEFT JOIN paintings_storages AS pst ON p.id = pst.paintings_id
      GROUP BY p.id
      HAVING SUM(pht.techniques_id = ?) > 0;`,
      [techniqueId]
    );
  }

  async createPaintingTechniqueRelationsByPaintingId(paintingId, techniques) {
    const values = [];
    const queryTail = techniques
      .map((techId) => {
        values.push(paintingId, techId);
        return `(?, ?)`;
      })
      .join(", ");
    const queryBody = `INSERT INTO ${this.table} (paintings_id, techniques_id) VALUES ${queryTail};`;

    return this.database.query(queryBody, values);
  }

  async deletePaintingTechniqueRelationsByPaintingIdAndTechniqueIds(
    paintingId,
    techniques
  ) {
    const queryTail = techniques.map(() => `?`).join(", ");
    const queryBody = `DELETE FROM ${this.table} WHERE paintings_id = ? AND techniques_id IN (${queryTail});`;
    const queryValues = [paintingId, ...techniques];

    return this.database.query(queryBody, queryValues);
  }
}

module.exports = PaintingsHasTechniquesManager;
