const AbstractManager = require("./AbstractManager");

class PaintingsReservationsManager extends AbstractManager {
  constructor() {
    super({ table: "painting_reservations" });
  }

  async readAll() {
    return this.database.query(`SELECT name, id FROM ${this.table} `);
  }

  async createPaintingReservation(price, paintingId, date, userId, contactId) {
    return this.database.query(
      `INSERT INTO ${this.table} (price, date, paintings_id, users_id, contacts_id)
      VALUES (?, ?, ?, ?, ?);`,
      [price, date, paintingId, userId, contactId]
    );
  }

  async deletePaintingReservationByPaintingId(paintingId) {
    return this.database.query(
      `DELETE FROM ${this.table} WHERE paintings_id = ?`,
      [paintingId]
    );
  }
}

module.exports = PaintingsReservationsManager;
