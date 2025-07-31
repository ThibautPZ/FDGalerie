const AbstractManager = require("./AbstractManager");

class FamiliesManager extends AbstractManager {
  constructor() {
    super({ table: "families" });
  }

  async readAll() {
    return this.database.query(`SELECT name, id FROM ${this.table} `);
  }

  async readMaxFamilyNumber(familyId) {
    return this.database.query(
      `SELECT MAX(p.family_member) AS maxFamilyMember FROM ${this.table} AS f
      LEFT JOIN paintings AS p ON f.id = p.families_id
      WHERE f.id = ?`,
      [familyId]
    );
  }

  async readByName({ name }) {
    return this.database.query(
      `SELECT id, name FROM ${this.table} WHERE name = ?`,
      [name]
    );
  }

  async createOne(familyName) {
    return this.database.query(`INSERT INTO ${this.table} (name) VALUES (?)`, [
      familyName,
    ]);
  }

  async deleteById(id) {
    return this.database.query(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
  }
}

module.exports = FamiliesManager;
