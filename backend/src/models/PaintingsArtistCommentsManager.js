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

  async modifyPaintingArtistComment(paintingId, comments) {
    const values = [];
    const queryTailArr = [];
    for (const [columnName, value] of Object.entries(comments)) {
      values.push(value);
      queryTailArr.push(`${columnName} = ?`);
    }
    const queryTail = queryTailArr.join(", ");
    values.push(paintingId);
    const queryBody = `UPDATE ${this.table} SET ${queryTail} WHERE paintings_id = ?`;
    return this.database.query(queryBody, values);
  }
}

module.exports = PaintingsArtistCommentsManager;
