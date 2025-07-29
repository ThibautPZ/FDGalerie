const AbstractManager = require("./AbstractManager");

class supportsManager extends AbstractManager {
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

  async createOne({ name }) {
    return this.database.query(`INSERT INTO ${this.table} (name) VALUES (?)`, [
      name,
    ]);
  }

  async deleteById({ id }) {
    return this.database.query(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
  }
}

module.exports = supportsManager;
