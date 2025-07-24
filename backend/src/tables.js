/* ************************************************************************* */
// Register Data Managers for Tables
/* ************************************************************************* */

// Import the manager modules responsible for handling data operations on the tables

const PaintingsManager = require("./models/PaintingsManager");
const TechniquesManager = require("./models/TechniquesManager");
const SupportsManager = require("./models/SupportsManager");
const PaintingSizesManager = require("./models/PaintingSizesManager");
const UsersManager = require("./models/usersManager");
const ContactsManager = require("./models/ContactsManager");
const PasswordResetTokensManager = require("./models/PasswordResetTokensManager");
const BanMessagesManager = require("./models/BanMessagesManager");
const PaintingGiftsManager = require("./models/PaintingGiftsManager");
const PaintingSalesManager = require("./models/PaintingSalesManager");
const PaintingReservationsManager = require("./models/PaintingReservationsManager");
const FamiliesManager = require("./models/FamiliesManager");
const PaintingsHasTechniquesManager = require("./models/PaintingsHasTechniquesManager");
const PaintingsStoragesManager = require("./models/PaintingsStoragesManager");
const PaintingsArtistCommentsManager = require("./models/PaintingsArtistCommentsManager");
const PaintingsGiftsManager = require("./models/PaintingsGiftsManager");
const PaintingsSalesManager = require("./models/PaintingsSalesManager");
const PaintingsReservationsManager = require("./models/PaintingsReservationsManager");

const managers = new Map([
  [PaintingsManager, "paintings"],
  [TechniquesManager, "techniques"],
  [SupportsManager, "supports"],
  [PaintingSizesManager, "paintingSizes"],
  [UsersManager, "users"],
  [ContactsManager, "contacts"],
  [PasswordResetTokensManager, "passwordResetTokens"],
  [BanMessagesManager, "banMessages"],
  [PaintingGiftsManager, "paintingGifts"],
  [PaintingSalesManager, "paintingSales"],
  [PaintingReservationsManager, "paintingReservations"],
  [FamiliesManager, "families"],
  [PaintingsHasTechniquesManager, "paintingsHasTechniques"],
  [PaintingsStoragesManager, "paintingsStorages"],
  [PaintingsArtistCommentsManager, "paintingsArtistComments"],
  [PaintingsGiftsManager, "paintingsGifts"],
  [PaintingsSalesManager, "paintingsSales"],
  [PaintingsReservationsManager, "paintingsReservations"],
]);

// Create an empty object to hold data managers for different tables
const tables = {};

// Register each manager as data access point for its table
managers.forEach((key, ManagerClass) => {
  const manager = new ManagerClass();

  tables[key] = manager;
});

/* ************************************************************************* */

// Use a Proxy to customize error messages when trying to access a non-existing table

// Export the Proxy instance with custom error handling
module.exports = new Proxy(tables, {
  get(obj, prop) {
    // Check if the property (table) exists in the tables object
    if (prop in obj) return obj[prop];

    // If the property (table) does not exist, throw a ReferenceError with a custom error message
    throw new ReferenceError(
      `tables.${prop} is not defined. Did you register it in ${__filename}?`
    );
  },
});
