const AbstractManager = require("./AbstractManager");

class PaintingSizesManager extends AbstractManager {
  constructor() {
    super({ table: "painting_sizes" });
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

module.exports = PaintingSizesManager;
