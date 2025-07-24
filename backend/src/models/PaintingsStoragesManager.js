const AbstractManager = require("./AbstractManager");

class PaintingsStoragesManager extends AbstractManager {
  constructor() {
    super({ table: "paintings_storages" });
  }

  async readAll() {
    return this.database.query(`SELECT name, id FROM ${this.table} `);
  }

  async createNewPaintingStorage(paintingId, fileName, fileExtension) {
    return this.database.query(
      `INSERT INTO ${this.table} ( paintings_id, file_name, file_extension)
      VALUES (?, ?, ?);`,
      [paintingId, fileName, fileExtension]
    );
  }
}

module.exports = PaintingsStoragesManager;
