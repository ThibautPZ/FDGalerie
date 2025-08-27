const AbstractManager = require("./AbstractManager");

class PaintingsAvailabilitiesManager extends AbstractManager {
  constructor() {
    super({ table: "paintings_availabilities" });
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

module.exports = PaintingsAvailabilitiesManager;
