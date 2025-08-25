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

  async readWithDetails() {
    return this.database.query(
      `SELECT ps.id AS id, ps.name AS keyName, COUNT(p.id) AS nbPaintings
      FROM ${this.table} AS ps
      LEFT JOIN paintings AS p ON p.painting_sizes_id = ps.id
      GROUP BY ps.id, ps.name`
    );
  }

  async findOneAdminWithDetails(id) {
    return this.database.query(
      `SELECT ps.id AS id, ps.name AS keyName, COUNT(p.id) AS nbPaintings
      FROM ${this.table} AS ps
      LEFT JOIN paintings AS p ON p.painting_sizes_id = ps.id
      WHERE ps.id = ? GROUP BY ps.id, ps.name`,
      [id]
    );
  }

  async findPaintingsIdByPaintingSizeId({ paintingSizeId }) {
    return this.database.query(
      `SELECT p.id AS id
      FROM ${this.table} AS ps
      RIGHT JOIN paintings AS p ON p.painting_sizes_id = ps.id
      WHERE ps.id = ?;`,
      [paintingSizeId]
    );
  }

  async createOne(name) {
    return this.database.query(`INSERT INTO ${this.table} (name) VALUES (?);`, [
      name,
    ]);
  }

  async deleteById(id) {
    return this.database.query(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
  }
}

module.exports = PaintingSizesManager;
