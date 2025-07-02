const { checkSchema } = require("express-validator");

const errorMsgPrefix = "creCon_val_";

const createContactSchema = checkSchema({
  optionalDependantLastname: {
    optional: { options: { checkFalsy: true } },
    isLength: {
      options: { min: 2, max: 64 },
      errorMessage: `${errorMsgPrefix}optDepLas_isLen`,
    },
  },
  optionalDependantFirstname: {
    optional: { options: { checkFalsy: true } },
    isLength: {
      options: { min: 2, max: 64 },
      errorMessage: `${errorMsgPrefix}optDepFir_isLen`,
    },
  },
  phoneNumber1: {
    optional: { options: { checkFalsy: true } },
    isLength: {
      options: { min: 2, max: 64 },
      errorMessage: `${errorMsgPrefix}phoNum1_isLen`,
    },
  },
  phoneNumber2: {
    optional: { options: { checkFalsy: true } },
    isLength: {
      options: { min: 2, max: 64 },
      errorMessage: `${errorMsgPrefix}phoNum2_isLen`,
    },
  },
  optionalAddress: {
    optional: { options: { checkFalsy: true } },
    isLength: {
      options: { min: 2, max: 64 },
      errorMessage: `${errorMsgPrefix}optAdd_isLen`,
    },
  },
  optionalPostalCode: {
    optional: { options: { checkFalsy: true } },
    isLength: {
      options: { min: 2, max: 64 },
      errorMessage: `${errorMsgPrefix}optPosCod_isLen`,
    },
  },
  optionalCity: {
    optional: { options: { checkFalsy: true } },
    isLength: {
      options: { min: 2, max: 64 },
      errorMessage: `${errorMsgPrefix}optCit_isLen`,
    },
  },
  optionalEmail: {
    optional: { options: { checkFalsy: true } },
    isEmail: {
      errorMessage: `${errorMsgPrefix}optEma_isEma`,
    },
    isLength: {
      options: { max: 254 },
      errorMessage: `${errorMsgPrefix}optEma_isLen`,
    },
  },
  spokenLanguage: {
    optional: { options: { checkFalsy: true } },
    isLength: {
      options: { max: 45 },
      errorMessage: `${errorMsgPrefix}spoLan_isLen`,
    },
  },
  contactDate: {
    exists: {
      errorMessage: `${errorMsgPrefix}conDat_exi`,
    },
    isDate: {
      errorMessage: `${errorMsgPrefix}conDat_isDat`,
    },
  },
});

module.exports = createContactSchema;
