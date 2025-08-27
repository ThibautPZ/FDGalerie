const AbstractManager = require("./AbstractManager");

class PaintingSalesManager extends AbstractManager {
  constructor() {
    super({ table: "painting_sales" });
  }

  async readAll() {
    return this.database.query(`SELECT name, id FROM ${this.table} `);
  }

  async findAllSalesByContactId(id) {
    return this.database.query(
      `SELECT ps.id AS saleNumber, price, date AS saleDate, p.id AS paintingId, title, pst.file_name AS fileName, pst.file_extension AS fileExtension FROM ${this.table} AS ps
      LEFT JOIN paintings AS p ON ps.paintings_id = p.id
      LEFT JOIN paintings_storages AS pst ON p.id = pst.paintings_id
      WHERE ps.contacts_id = ?`,
      [id]
    );
  }

  async findSaleByPaintingId(id) {
    return this.database.query(
      `SELECT ps.id AS transactionNumber, ps.price, ps.date AS date, ps.note AS note, ps.users_id AS userId, ps.contacts_id AS contactId,
      COALESCE(u.firstname, c.firstname) AS firstName,
      COALESCE(u.lastname,  c.lastname)  AS lastName
      FROM ${this.table} AS ps
      LEFT JOIN users AS u
      ON ps.users_id = u.users_id
      LEFT JOIN contacts AS c
      ON ps.contacts_id = c.contacts_id
      WHERE ps.paintings_id = ?;`,
      [id]
    );
  }

  async findAllSalesWithDetails() {
    return this.database.query(
      `SELECT psl.id AS saleNumber, psl.price AS price, psl.date AS date, psl.note AS note, psl.users_id AS userId, psl.contacts_id AS contactId,
    ps.file_name AS fileName, ps.file_extension AS fileExtension, p.id as paintingId, p.title AS paintingTitle, 
    COALESCE(u.firstname, c.firstname) AS firstName,
    COALESCE(u.lastname,  c.lastname)  AS lastName
    FROM ${this.table} AS psl
    LEFT JOIN users AS u ON psl.users_id = u.users_id
    LEFT JOIN contacts AS c ON psl.contacts_id = c.contacts_id
    LEFT JOIN paintings_storages AS ps ON psl.paintings_id = ps.paintings_id
    LEFT JOIN paintings AS p ON psl.paintings_id = p.id;`
    );
  }

  async createPaintingSale(price, paintingId, date, note, userId, contactId) {
    return this.database.query(
      `INSERT INTO ${this.table} (price, date, note, paintings_id, users_id, contacts_id)
      VALUES (?, ?, ?, ?, ?, ?);`,
      [price, date, note, paintingId, userId, contactId]
    );
  }

  async modifyPaintingSale(paintingId, saleData) {
    const values = [];
    const queryTailArr = [];
    for (const [columnName, value] of Object.entries(saleData)) {
      values.push(value);
      queryTailArr.push(`${columnName} = ?`);
    }
    const queryTail = queryTailArr.join(", ");
    values.push(paintingId);
    const queryBody = `UPDATE ${this.table} SET ${queryTail} WHERE paintings_id = ?`;
    return this.database.query(queryBody, values);
  }
}

module.exports = PaintingSalesManager;
