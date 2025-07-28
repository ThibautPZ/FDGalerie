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

  async readByName({ name }) {
    return this.database.query(
      `SELECT id, name FROM ${this.table} WHERE name = ?`,
      [name]
    );
  }

  async createOne(name) {
    return this.database.query(`INSERT INTO ${this.table} (name) VALUES (?);`, [
      name,
    ]);
  }
}

module.exports = PaintingSizesManager;
