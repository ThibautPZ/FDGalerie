const AbstractManager = require("./AbstractManager");

class PaintingsManager extends AbstractManager {
  constructor() {
    super({ table: "paintings" });
  }

  async create(item) {
    const [result] = await this.database.query(
      `insert into ${this.table} (title) values (?)`,
      [item.title]
    );

    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async readByTitle(title) {
    // Execute the SQL SELECT query to retrieve a specific item by its ID
    return this.database.query(
      `SELECT  p.id, p.title, p.pathname, p.comment, p.width, p.height, p.sold, p.family_member AS familyMember, p.families_id AS familyId, f.name AS family, ps.name AS format, s.name as support
      FROM ${this.table} AS p LEFT JOIN painting_sizes AS ps ON p.painting_sizes_id = ps.id
      LEFT JOIN families AS f ON p.families_id = f.id
      LEFT JOIN supports AS s ON p.supports_id = s.id
      WHERE p.title = ?`,
      [title]
    );
  }

  async findByTitle(title) {
    return this.database.query(
      `SELECT title FROM ${this.table} WHERE title = ? `,
      [title]
    );
  }

  async findAllFamilyMembers(familyId, currentMemberId) {
    return this.database.query(
      `SELECT  p.title AS sister FROM ${this.table} AS p LEFT JOIN families AS f ON p.families_id = f.id WHERE f.id = ? AND p.id <> ?`,
      [familyId, currentMemberId]
    );
  }

  async readAssociatedSizes() {
    return this.database.query(
      `SELECT DISTINCT ps.name AS format FROM ${this.table} AS p LEFT JOIN painting_sizes AS ps ON p.painting_sizes_id = ps.id`
    );
  }

  async readAssociatedTechniques() {
    return this.database.query(
      `SELECT DISTINCT t.name AS technique FROM paintings_has_techniques AS pht LEFT JOIN ${this.table} AS p ON pht.paintings_id = p.id LEFT JOIN techniques AS t ON pht.techniques_id = t.id; `
    );
  }

  async readPaintingByTech(technique) {
    return this.database.query(
      `SELECT p.id, p.title, p.pathname FROM paintings_has_techniques AS pht LEFT JOIN paintings AS p ON pht.paintings_id = p.id LEFT JOIN techniques AS t ON pht.techniques_id = t.id WHERE t.name = ?`,
      [technique]
    );
  }

  async readPaintingBySize(format) {
    return this.database.query(
      `SELECT p.id, p.title, p.pathname FROM ${this.table} AS p LEFT JOIN painting_sizes AS ps ON p.painting_sizes_id = ps.id WHERE ps.name = ?`,
      [format]
    );
  }

  async readWithDetails() {
    return this.database.query(
      `SELECT DISTINCT p.id, p.title, p.pathname, p.comment, p.width, p.height, p.sold, p.family_member AS familyMember, p.families_id AS familyId, f.name AS family, ps.name AS format, s.name as support, GROUP_CONCAT(t.name SEPARATOR "|") AS techniques
      FROM ${this.table} AS p LEFT JOIN painting_sizes AS ps ON p.painting_sizes_id = ps.id
      LEFT JOIN families AS f ON p.families_id = f.id
      LEFT JOIN supports AS s ON p.supports_id = s.id
      LEFT JOIN paintings_has_techniques AS pht ON p.id = pht.paintings_id
      LEFT JOIN techniques AS t ON pht.techniques_id = t.id
      GROUP BY p.id
      `
    );
  }
  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing item

  // async update(item) {
  //   ...
  // }

  // The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an item by its ID

  // async delete(id) {
  //   ...
  // }
}

module.exports = PaintingsManager;
