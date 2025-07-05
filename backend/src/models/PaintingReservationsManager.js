const AbstractManager = require("./AbstractManager");

class PaintingReservationsManager extends AbstractManager {
  constructor() {
    super({ table: "painting_reservations" });
  }

  async findAllReservationsByContactId(id) {
    return this.database.query(
      `SELECT pr.id AS reservationNumber, price, date AS reservationDate, p.id AS paintingId, title, pathname FROM ${this.table} AS pr LEFT JOIN paintings AS p ON pr.paintings_id = p.id WHERE pr.contacts_id = ?`,
      [id]
    );
  }
}

module.exports = PaintingReservationsManager;
