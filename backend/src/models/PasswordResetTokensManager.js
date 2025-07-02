const AbstractManager = require("./AbstractManager");

class PasswordResetTokensManager extends AbstractManager {
  constructor() {
    // Call the constructor of the parent class (AbstractManager)
    // and pass the table name "item" as configuration
    super({ table: "password_reset_tokens" });
  }

  // The C of CRUD - Create operation

  async create(item) {
    // Execute the SQL INSERT query to add a new item to the "item" table
    const [result] = await this.database.query(
      `insert into ${this.table} (title) values (?)`,
      [item.title]
    );

    // Return the ID of the newly inserted item
    return result.insertId;
  }

  async createToken(id, token) {
    const createdAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 1000).toISOString();
    // function giveTodayDate() {
    //   const date = new Date();
    //   let month = date.getMonth().toString();
    //   if (month.length === 1) {
    //     month = "0".concat(month);
    //   }
    //   let day = date.getDate().toString();
    //   if (day.length === 1) {
    //     day = "0".concat(day);
    //   }
    //   return `${date.getFullYear()}-${month}-${day}`;
    // }

    return this.database.query(
      `INSERT INTO ${this.table} (token, created_at, expires_at, user_id) VALUES(?, ?, ?, ?)`,
      [token, createdAt, expiresAt, id]
    );
  }

  async deletePasswordResetTokens(id) {
    return this.database.query(`DELETE FROM ${this.table} WHERE user_id = ?`, [
      id,
    ]);
  }
  // The Rs of CRUD - Read operations

  async readPasswordResetToken(id) {
    return this.database.query(
      `SELECT token, expires_at FROM ${this.table} WHERE user_id = ? ORDER BY created_at DESC LIMIT 1;`,
      [id]
    );
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all items from the "item" table
    const [rows] = await this.database.query(`select * from ${this.table}`);

    // Return the array of items
    return rows;
  }

  // The U of CRUD - Update operation

  // async update(item) {
  //   ...
  // }

  // The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an item by its ID

  // async delete(id) {
  //   ...
  // }
}

module.exports = PasswordResetTokensManager;
