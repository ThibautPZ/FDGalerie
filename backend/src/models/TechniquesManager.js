const AbstractManager = require("./AbstractManager");

class TechniquesManager extends AbstractManager {
  constructor() {
    super({ table: "techniques" });
  }

  async readAll() {
    return this.database.query(`SELECT name, id FROM ${this.table} `);
  }

  async readByPaintingId(id) {
    return this.database.query(
      `SELECT t.name AS technique FROM ${this.table} AS t LEFT JOIN paintings_has_techniques AS pht ON t.id = pht.techniques_id WHERE pht.paintings_id = ?`,
      [id]
    );
  }
}

module.exports = TechniquesManager;
