const AbstractManager = require("./AbstractManager");

class PaintingsSalesManager extends AbstractManager {
  constructor() {
    super({ table: "painting_sales" });
  }

  async readAll() {
    return this.database.query(`SELECT name, id FROM ${this.table} `);
  }

  async createPaintingSale(price, paintingId, date, userId, contactId) {
    return this.database.query(
      `INSERT INTO ${this.table} (price, date, paintings_id, users_id, contacts_id)
      VALUES (?, ?, ?, ?, ?);`,
      [price, date, paintingId, userId, contactId]
    );
  }
}

module.exports = PaintingsSalesManager;
