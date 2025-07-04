const AbstractManager = require("./AbstractManager");

class PaintingGiftsManager extends AbstractManager {
  constructor() {
    super({ table: "painting_gifts" });
  }

  async findAllGiftsByContactId(id) {
    return this.database.query(
      `SELECT pg.id AS giftNumber, date AS giftDate, p.id AS paintingId, title, pathname FROM ${this.table} AS pg LEFT JOIN paintings AS p ON pg.paintings_id = p.id WHERE pg.contacts_id = ?`,
      [id]
    );
  }
}

module.exports = PaintingGiftsManager;
