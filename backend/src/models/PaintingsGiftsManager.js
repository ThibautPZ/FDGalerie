const AbstractManager = require("./AbstractManager");

class PaintingsGiftsManager extends AbstractManager {
  constructor() {
    super({ table: "painting_gifts" });
  }

  async readAll() {
    return this.database.query(`SELECT name, id FROM ${this.table} `);
  }

  async createPaintingGift(paintingId, date, userId, contactId) {
    return this.database.query(
      `INSERT INTO ${this.table} (date, paintings_id, users_id, contacts_id)
      VALUES (?, ?, ?, ?);`,
      [date, paintingId, userId, contactId]
    );
  }
}

module.exports = PaintingsGiftsManager;
