const AbstractManager = require("./AbstractManager");

class PaintingSalesManager extends AbstractManager {
  constructor() {
    super({ table: "painting_sales" });
  }

  async findAllSalesByContactId(id) {
    return this.database.query(
      `SELECT ps.id AS saleNumber, price, date AS saleDate, p.id AS paintingId, title, pathname FROM ${this.table} AS ps LEFT JOIN paintings AS p ON ps.paintings_id = p.id WHERE ps.contacts_id = ?`,
      [id]
    );
  }
}

module.exports = PaintingSalesManager;
