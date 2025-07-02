const argon2 = require("argon2");

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const hashPassword = (password) => {
  return argon2.hash(password, hashingOptions);
};

const verifyPassword = (hashedPassword, password) => {
  return argon2.verify(hashedPassword, password);
};

module.exports = { hashPassword, verifyPassword };
