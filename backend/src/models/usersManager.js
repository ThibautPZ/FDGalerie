const ServiceUtils = require("../services/ServiceUtils");
const AbstractManager = require("./AbstractManager");

class UsersManager extends AbstractManager {
  constructor() {
    super({ table: "users" });
  }

  async read() {
    return this.database.query(
      `SELECT users_id AS userId, firstname, lastname, address, postal_code AS postalCode, city, phone_number1 AS phoneNumber1, phone_number2 AS phoneNumber2, email, account_date AS accountDate, language AS registeredLanguagesId, user_types_id AS userTypesId, account_states_id AS accountStatesId FROM ${this.table}`
    );
  }

  async findOneByEmail(email) {
    return this.database.query(
      `SELECT users_id, firstname, lastname, address, postal_code AS postalCode, city, phone_number1 AS phoneNumber1, phone_number2 AS phoneNumber2, email, hashedPassword, account_date AS accountDate,language AS registeredLanguagesId, user_types_id AS userTypesId, account_states_id AS accountStatesId FROM ${this.table} WHERE email = ?`,
      [email]
    );
  }

  async findNameById(id) {
    return this.database.query(
      `SELECT firstname AS firstName, lastname AS lastName FROM ${this.table} WHERE users_id = ?`,
      [id]
    );
  }

  async findByName(firstname, lastname) {
    let queryTail = ``;
    const queryHead = `SELECT users_id AS userId, firstname, lastname FROM ${this.table} WHERE `;
    const queryValues = [];
    if (firstname) {
      queryTail = "firstname LIKE ?";
      queryValues.push(firstname);
    }
    if (lastname) {
      queryTail = `${
        firstname ? `${queryTail} OR lastname LIKE ?` : "lastname LIKE ?"
      }`;
      queryValues.push(lastname);
    }

    return this.database.query(`${queryHead}${queryTail}`, queryValues);
  }

  async findOneByEmailExcludingId(email, id) {
    return this.database.query(
      `SELECT users_id, firstname, lastname, address, postal_code AS postalCode, city, phone_number1 AS phoneNumber1, phone_number2 AS phoneNumber2, email, hashedPassword, account_date AS accountDate, user_types_id AS userTypesId, account_states_id AS accountStatesId FROM ${this.table} WHERE email = ? AND users_id <> ?`,
      [email, id]
    );
  }

  async insert({
    lastname,
    firstname,
    address,
    postalCode,
    city,
    phoneNumber1,
    phoneNumber2,
    email,
    hashedPassword,
    accountDate,
    gender,
    userTypesId,
    accountStatesId,
  }) {
    return this.database.query(
      `INSERT INTO ${this.table} (lastname, firstname, address, postal_code, city, phone_number1, phone_number2, email, hashedPassword, account_date, gender_id, user_types_id, account_states_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        lastname,
        firstname,
        address || null,
        postalCode || null,
        city || null,
        phoneNumber1 || null,
        phoneNumber2 || null,
        email,
        hashedPassword,
        accountDate,
        gender,
        userTypesId,
        accountStatesId,
      ]
    );
  }

  // async updateInfo({
  //   lastname,
  //   firstname,
  //   address,
  //   postalCode,
  //   city,
  //   phoneNumber1,
  //   phoneNumber2,
  //   email,
  //   gender,
  //   id,
  // }) {
  //   return this.database.query(
  //     `UPDATE ${this.table} SET lastname = ?, firstname = ?, address = ?, postal_code = ?, city = ?, phone_number_1 = ?, phone_number_2 = ?, email = ?, gender_id = ? WHERE id = ?`,
  //     [
  //       lastname,
  //       firstname,
  //       address || null,
  //       postalCode || null,
  //       city || null,
  //       phoneNumber1 || null,
  //       phoneNumber2 || null,
  //       email,
  //       gender,
  //       id,
  //     ]
  //   );
  // }

  async readUserLanguage(email, id) {
    return this.database.query(
      `SELECT language AS registeredLang FROM ${this.table} WHERE email = ? AND users_id = ?`,
      [email, id]
    );
  }

  async updateLanguage(language, userId) {
    return this.database.query(
      `UPDATE ${this.table} SET language = ? WHERE users_id = ?`,
      [language, userId]
    );
  }

  async findByNamePhoneEmail(
    firstname,
    lastname,
    phoneNumber1,
    phoneNumber2,
    email
  ) {
    let queryTail = ``;
    const queryHead = `SELECT users_id AS userId, firstname, lastname, phone_number1 AS phoneNumber1, phone_number2 AS phoneNumber2, email FROM ${this.table} WHERE `;
    const queryValues = [];
    if (firstname) {
      queryTail = "firstname = ? AND ";
      queryValues.push(firstname);
    }

    queryTail = `${queryTail}lastname = ?`;
    queryValues.push(lastname);
    if (phoneNumber1) {
      queryTail = `${queryTail} OR phone_number1 = ?`;
      queryValues.push(phoneNumber1);
    }
    if (phoneNumber2) {
      queryTail = `${queryTail} OR phone_number2 = ?`;
      queryValues.push(phoneNumber2);
    }
    if (email) {
      queryTail = `${queryTail} OR email = ?`;
      queryValues.push(email);
    }

    return this.database.query(`${queryHead}${queryTail};`, queryValues);
  }

  async updateInfo(userInfo, userId) {
    let queryHead = `UPDATE ${this.table} SET `;
    const queryTail = `WHERE users_id = ?`;
    const queryValues = [];
    const values = Object.entries(userInfo);
    // console.log();

    values.map((value, index, array) => {
      if (index === array.length - 1) {
        queryHead = `${queryHead} ${ServiceUtils.formatStringFromCamelToSnake(
          value[0]
        )} = ? `;
      } else {
        queryHead = `${queryHead} ${ServiceUtils.formatStringFromCamelToSnake(
          value[0]
        )} = ?, `;
      }
      return queryValues.push(value[1]);
    });

    return this.database.query(`${queryHead}${queryTail}`, [
      ...queryValues,
      userId,
    ]);
  }

  async updatePassword(newPassword, userId) {
    return this.database.query(
      `UPDATE ${this.table} SET hashedPassword = ? WHERE users_id = ?`,
      [newPassword, userId]
    );
  }

  async updateAccountState(userEmail, userId, stateId) {
    return this.database.query(
      `UPDATE ${this.table} SET account_states_id = ? WHERE email = ? AND users_id = ?`,
      [stateId, userEmail, userId]
    );
  }

  async deleteData(userEmail, userId, stateId) {
    return this.database.query(
      `UPDATE ${this.table} SET firstname = ?, lastname = ?,  address = ?, postal_code = ?, city = ?, phone_number1 = ?, phone_number2 = ?, hashedPassword = ?, gender_id = ?, account_states_id = ? WHERE email = ? AND id = ?`,
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        "deleted",
        4,
        stateId,
        userEmail,
        userId,
      ]
    );
  }
}
module.exports = UsersManager;
