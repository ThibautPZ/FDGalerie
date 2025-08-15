const AbstractManager = require("./AbstractManager");

class PaintingsHasTechniquesManager extends AbstractManager {
  constructor() {
    super({ table: "paintings_has_techniques" });
  }

  async readAll() {
    return this.database.query(`SELECT name, id FROM ${this.table} `);
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
