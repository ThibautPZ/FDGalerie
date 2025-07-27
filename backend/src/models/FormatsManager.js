const AbstractManager = require("./AbstractManager");

class FormatsManager extends AbstractManager {
  constructor() {
    super({ table: "formats" });
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

module.exports = FormatsManager;
