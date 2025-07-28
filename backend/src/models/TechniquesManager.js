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

  async readByName({ name }) {
    return this.database.query(
      `SELECT id, name FROM ${this.table} WHERE name = ?`,
      [name]
    );
  }

  async countByIds({ ids }) {
    let query = `SELECT COUNT(name) FROM ${this.table} WHERE id IN (?`;
    for (let i = 1; i < ids.length; i += 1) {
      query += `, ?`;
    }
    query += `);`;

    return this.database.query(query, [...ids]);
  }

  async insertTechnique(techniqueKey) {
    return this.database.query(`INSERT INTO ${this.table} (name) VALUES (?)`, [
      techniqueKey,
    ]);
  }

  async deleteById(id) {
    return this.database.query(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
  }
}

module.exports = TechniquesManager;
