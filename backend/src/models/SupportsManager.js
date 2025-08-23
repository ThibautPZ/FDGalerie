const AbstractManager = require("./AbstractManager");

class SupportsManager extends AbstractManager {
  constructor() {
    super({ table: "supports" });
  }

  async readAll() {
    return this.database.query(`SELECT name, id FROM ${this.table} `);
  }

  async readById({ id }) {
    return this.database.query(
      `SELECT name, id FROM ${this.table} WHERE id = ?`,
      [id]
    );
  }

  async readByName({ name }) {
    return this.database.query(
      `SELECT name, id FROM ${this.table} WHERE name = ?`,
      [name]
    );
  }

  async readWithDetails() {
    return this.database.query(
      `SELECT s.id AS id, s.name AS name, COUNT(p.id) AS nbPaintings
      FROM ${this.table} AS s
      LEFT JOIN paintings AS p ON p.supports_id = s.id
      GROUP BY s.id, s.name`
    );
  }

  async findOneAdminWithDetails(id) {
    return this.database.query(
      `SELECT s.id AS id, s.name AS name, COUNT(p.id) AS nbPaintings
      FROM ${this.table} AS s
      LEFT JOIN paintings AS p ON p.supports_id = s.id
      WHERE s.id = ? GROUP BY s.id, s.name`,
      [id]
    );
  }

  async createOne(name) {
    return this.database.query(`INSERT INTO ${this.table} (name) VALUES (?)`, [
      name,
    ]);
  }

  async deleteById(id) {
    return this.database.query(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
  }
}

module.exports = SupportsManager;
