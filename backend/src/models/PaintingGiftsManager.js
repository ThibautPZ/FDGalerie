const AbstractManager = require("./AbstractManager");

class PaintingGiftsManager extends AbstractManager {
  constructor() {
    super({ table: "painting_gifts" });
  }

  async readAll() {
    return this.database.query(`SELECT name, id FROM ${this.table} `);
  }

  async findAllGiftsByContactId(id) {
    return this.database.query(
      `SELECT pg.id AS giftNumber, date AS giftDate, p.id AS paintingId, title, ps.file_name AS fileName, ps.file_extension AS fileExtension FROM ${this.table} AS pg
      LEFT JOIN paintings AS p ON pg.paintings_id = p.id
      LEFT JOIN paintings_storages AS ps ON p.id = ps.paintings_id
      WHERE pg.contacts_id = ?`,
      [id]
    );
  }

  findGiftByPaintingId(id) {
    return this.database.query(
      `SELECT pg.id AS transactionNumber, pg.date AS date, pg.note AS note, pg.users_id AS userId, pg.contacts_id AS contactId,
      COALESCE(u.firstname, c.firstname) AS firstName,
      COALESCE(u.lastname,  c.lastname)  AS lastName
      FROM ${this.table} AS pg
      LEFT JOIN users AS u
      ON pg.users_id = u.users_id
      LEFT JOIN contacts AS c
      ON pg.contacts_id = c.contacts_id
      WHERE pg.paintings_id = ?;`,
      [id]
    );
  }

  async createPaintingGift(paintingId, date, note, userId, contactId) {
    return this.database.query(
      `INSERT INTO ${this.table} (date, paintings_id, note, users_id, contacts_id)
      VALUES (?, ?, ?, ?, ?);`,
      [date, paintingId, note, userId, contactId]
    );
  }

  async modifyPaintingGift(paintingId, giftData) {
    const values = [];
    const queryTailArr = [];
    for (const [columnName, value] of Object.entries(giftData)) {
      values.push(value);
      queryTailArr.push(`${columnName} = ?`);
    }
    const queryTail = queryTailArr.join(", ");
    values.push(paintingId);
    const queryBody = `UPDATE ${this.table} SET ${queryTail} WHERE paintings_id = ?`;
    return this.database.query(queryBody, values);
  }
}

module.exports = PaintingGiftsManager;
