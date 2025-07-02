const AbstractManager = require("./AbstractManager");

class BanMessagesManager extends AbstractManager {
  constructor() {
    super({ table: "ban_messages" });
  }

  async read() {
    return this.database.query(
      `SELECT id, firstname, lastname, address, postal_code AS postalCode, city, phone_number1 AS phoneNumber1, phone_number2 AS phoneNumber2, email, account_date AS accountDate, user_types_id AS userTypesId, account_states_id AS accountStatesId FROM ${this.table}`
    );
  }

  async findOneById(id) {
    return this.database.query(
      `SELECT message FROM ${this.table} WHERE users_id = ?`,
      [id]
    );
  }

  async findOneByEmailExcludingId(email, id) {
    return this.database.query(
      `SELECT id, firstname, lastname, address, postal_code AS postalCode, city, phone_number1 AS phoneNumber1, phone_number2 AS phoneNumber2, email, hashedPassword, account_date AS accountDate, user_types_id AS userTypesId, account_states_id AS accountStatesId FROM ${this.table} WHERE email = ? AND id <> ?`,
      [email, id]
    );
  }

  async createMessage(userId, message) {
    return this.database.query(
      `INSERT INTO ${this.table} (users_id, message) VALUES (?, ?)`,
      [userId, message]
    );
  }

  deleteOneById(userId) {
    return this.database.query(`DELETE FROM ${this.table} WHERE users_id = ?`, [
      userId,
    ]);
  }
}
module.exports = BanMessagesManager;
