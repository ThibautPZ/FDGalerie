const AbstractManager = require("./AbstractManager");

class PaintingsArtistCommentsManager extends AbstractManager {
  constructor() {
    super({ table: "paintings_artist_comments" });
  }

  async readAll() {
    return this.database.query(`SELECT name, id FROM ${this.table} `);
  }

  async createPaintingComment(
    paintingId,
    frComment,
    enUSComment = null,
    enGBComment = null
  ) {
    return this.database.query(
      `INSERT INTO ${this.table} (paintings_id, fr_comment, en_US_comment, en_GB_comment)
      VALUES (?, ?, ?, ?)`,
      [paintingId, frComment, enUSComment, enGBComment]
    );
  }
}

module.exports = PaintingsArtistCommentsManager;
