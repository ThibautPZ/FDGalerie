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
}

module.exports = FamiliesManager;
