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
}

module.exports = supportsManager;
