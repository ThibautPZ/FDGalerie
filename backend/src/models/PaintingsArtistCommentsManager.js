const AbstractManager = require("./AbstractManager");

class PaintingsArtistCommentsManager extends AbstractManager {
  constructor() {
    super({ table: "paintings_artist_comments" });
  }

  async readAll() {
    return this.database.query(`SELECT name, id FROM ${this.table} `);
  }

  async createPaintingComment(paintingId, comment) {
    return this.database.query(
      `INSERT INTO ${this.table} (paintings_id, comment)
      VALUES (?, ?);`,
      [paintingId, comment]
    );
  }
}

module.exports = PaintingsArtistCommentsManager;
