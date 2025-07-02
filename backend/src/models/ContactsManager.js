const AbstractManager = require("./AbstractManager");

class ContactsManager extends AbstractManager {
  constructor() {
    super({ table: "contacts" });
  }

  async findAll() {
    return this.database.query(
      `SELECT contacts_id AS contactId, firstname, lastname, address, postal_code AS postalCode, city, phone_number1 AS phoneNumber1, phone_number2 AS phoneNumber2, email, creation_date AS creationDate, language FROM ${this.table}`
    );
  }

  async findByOneParam(paramName, paramValue) {
    const query = `SELECT contacts_id AS contactId, firstname, lastname FROM ${this.table} WHERE ${paramName} = ?`;
    return this.database.query(query, [paramValue]);
  }

  async findByName(firstname, lastname) {
    let queryTail = ``;
    const queryHead = `SELECT contacts_id AS contactId, firstname, lastname FROM ${this.table} WHERE `;
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

  async findById(id) {
    return this.database.query(
      `SELECT contacts_id AS contactId, firstname, lastname, address, postal_code AS postalCode, city, phone_number1 AS phoneNumber1, phone_number2 AS phoneNumber2, email, creation_date AS creationDate, language FROM ${this.table} WHERE contacts_id = ?`,
      [id]
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
    const queryHead = `SELECT contacts_id AS contactId, firstname, lastname, phone_number1 AS phoneNumber1, phone_number2 AS phoneNumber2, email FROM ${this.table} WHERE `;
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

  async modifyContact(contactData, contactId) {
    const queryTail = ` WHERE contacts_id = ?;`;
    let queryHead = `UPDATE ${this.table} SET `;
    const queryValues = [];
    let index = 0;

    for (const [key, value] of contactData) {
      queryHead = `${queryHead} ${key} = ?`;
      if (index < contactData.size - 1) {
        queryHead = `${queryHead},`;
      }
      queryValues.push(value);
      index += 1;
    }

    queryValues.push(contactId);

    return this.database.query(`${queryHead}${queryTail}`, queryValues);
  }

  async insertOneContact(
    firstname,
    lastname,
    phone1,
    phone2,
    email,
    address,
    postalCode,
    city,
    language,
    date
  ) {
    return this.database.query(
      `INSERT INTO ${this.table} (firstname, lastname, phone_number1, phone_number2, email, address, postal_code, city, language, creation_date) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstname,
        lastname,
        phone1,
        phone2,
        email,
        address,
        postalCode,
        city,
        language,
        date,
      ]
    );
  }
}

module.exports = ContactsManager;
