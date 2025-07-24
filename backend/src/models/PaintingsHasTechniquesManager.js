const AbstractManager = require("./AbstractManager");

class PaintingsHasTechniquesManager extends AbstractManager {
  constructor() {
    super({ table: "paintings_has_techniques" });
  }

  async readAll() {
    return this.database.query(`SELECT name, id FROM ${this.table} `);
  }

  async createNewPaintingTechniques(paintingId, techniques) {
    const queryHead = `INSERT INTO ${this.table} (paintings_id, techniques_id) VALUES`;
    let queryBody = "";
    const queryValue = " (?, ?)";
    const values = [];

    techniques.forEach((techniqueId, index) => {
      values.push(paintingId, techniqueId);
      if (index > 0) {
        queryBody = `${queryBody},`;
      }
      queryBody = `${queryBody}${queryValue}`;
    });

    return this.database.query(`${queryHead}${queryBody};`, values);
  }
}

module.exports = PaintingsHasTechniquesManager;
