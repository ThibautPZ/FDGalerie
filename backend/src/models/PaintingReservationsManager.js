const AbstractManager = require("./AbstractManager");

class PaintingReservationsManager extends AbstractManager {
  constructor() {
    super({ table: "painting_reservations" });
  }

  async readAll() {
    return this.database.query(`SELECT name, id FROM ${this.table} `);
  }

  async findAllReservationsByContactId(id) {
    return this.database.query(
      `SELECT pr.id AS reservationNumber, price, date AS reservationDate, p.id AS paintingId, title, ps.file_name AS fileName, ps.file_extension AS fileExtension FROM ${this.table} AS pr
      LEFT JOIN paintings AS p ON pr.paintings_id = p.id
      LEFT JOIN paintings_storages AS ps ON p.id = ps.paintings_id
      WHERE pr.contacts_id = ?`,
      [id]
    );
  }

  async findReservationByPaintingId(id) {
    return this.database.query(
      `SELECT pr.id AS transactionNumber, pr.price, pr.date AS date, pr.users_id AS userId, pr.contacts_id AS contactId,
      COALESCE(u.firstname, c.firstname) AS firstName,
      COALESCE(u.lastname,  c.lastname)  AS lastName
      FROM ${this.table} AS pr
      LEFT JOIN users AS u
      ON pr.users_id = u.users_id
      LEFT JOIN contacts AS c
      ON pr.contacts_id = c.contacts_id
      WHERE pr.paintings_id = ?;`,
      [id]
    );
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

module.exports = PaintingReservationsManager;
