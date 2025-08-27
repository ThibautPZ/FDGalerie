import { useTranslation } from "react-i18next";

import { isArray, isDate, isObjectNotEmpty } from "./typesAndValidationChecks";
import { hasKeysWithTruthyValue } from "./objectMethods/objectValidation";
import {
  minOneNonSpaceCharRegExp,
  emptyOrMinOneNonSpaceCharRegExp,
  priceEurRegExp,
} from "./regularExpressions";

// todo: validate fields if availability is not available
function FormRegisterOptions(watch) {
  const { t } = useTranslation([
    "common",
    "pageText",
    "errors",
    "popUpContent",
    "formRegisterOptionsMessages",
  ]);

  const tWithPrefix = (keyStr) => {
    return t(`formRegisterOptionsMessages:${keyStr}`);
  };

  const are2FieldsFilled = (currentFieldValue, watchedField) => {
    if (!currentFieldValue) {
      return false;
    }
    const watchedValue = watch(watchedField);
    if (!watchedValue) {
      return false;
    }
    return true;
  };

  const areNumberOfFieldsFilled = (number, fieldNames) => {
    if (!isArray(fieldNames)) {
      return "error";
    }
    let count = 0;
    fieldNames.forEach((field) => {
      if (watch(field)) {
        count += 1;
      }
    });
    if (count < number) {
      return false;
    }
    return true;
  };

  return {
    firstname: {
      pattern: {
        value: /[a-z0-9éèàëñçù]/gi,
        message: tWithPrefix("firstname.pattern"),
      },
      minLength: {
        value: 2,
        message: tWithPrefix("firstname.minLength"),
      },
      maxLength: {
        value: 64,
        message: tWithPrefix("firstname.maxLength"),
      },
    },
    optionalFirstname: {
      pattern: {
        value: /[a-z0-9éèàëñçù-]/gi,
        message: tWithPrefix("firstname.pattern"),
      },
      minLength: {
        value: 2,
        message: tWithPrefix("firstname.minLength"),
      },
      maxLength: {
        value: 64,
        message: tWithPrefix("firstname.maxLength"),
      },
    },
    optionalDependantFirstname: {
      pattern: {
        value: /[a-z0-9éèàëñçù-]/gi,
        message: tWithPrefix("firstname.pattern"),
      },
      minLength: {
        value: 2,
        message: tWithPrefix("firstname.minLength"),
      },
      maxLength: {
        value: 64,
        message: tWithPrefix("firstname.maxLength"),
      },
      deps: ["optionalDependantLastname"],
    },
    lastname: {
      pattern: {
        value: /[a-z0-9éèàëñçù-]/gi,
        message: tWithPrefix("lastname.pattern"),
      },
      minLength: {
        value: 2,
        message: tWithPrefix("lastname.minLength"),
      },
      maxLength: {
        value: 64,
        message: tWithPrefix("lastname.maxLength"),
      },
    },
    optionalLastname: {
      pattern: {
        value: /[a-z0-9éèàëñçù-]/gi,
        message: tWithPrefix("lastname.pattern"),
      },
      minLength: {
        value: 2,
        message: tWithPrefix("lastname.minLength"),
      },
      maxLength: {
        value: 64,
        message: tWithPrefix("lastname.maxLength"),
      },
    },
    optionalDependantLastname: {
      pattern: {
        value: /[a-z0-9éèàëñçù-]/gi,
        message: tWithPrefix("lastname.pattern"),
      },
      minLength: {
        value: 2,
        message: tWithPrefix("lastname.minLength"),
      },
      maxLength: {
        value: 64,
        message: tWithPrefix("lastname.maxLength"),
      },
      validate: () =>
        areNumberOfFieldsFilled(1, [
          "optionalDependantFirstname",
          "optionalDependantLastname",
        ]) || tWithPrefix("lastname.validate"),
    },

    address: {
      pattern: {
        value: /[a-z0-9éèàëñçù-]/gi,
        message: tWithPrefix("address.pattern"),
      },
      maxLength: {
        value: 128,
        message: tWithPrefix("address.maxLength"),
      },
    },
    optionalAddress: {
      pattern: {
        value: /[a-z0-9éèàëñçù-]/gi,
        message: tWithPrefix("address.pattern"),
      },
      maxLength: {
        value: 128,
        message: tWithPrefix("address.maxLength"),
      },
    },

    postalCode: {
      pattern: {
        value: /[a-z0-9-]/gi,
        message: tWithPrefix("postalCode.pattern"),
      },
      maxLength: {
        value: 14,
        message: tWithPrefix("postalCode.maxLength"),
      },
    },
    optionalPostalCode: {
      pattern: {
        value: /[a-z0-9-]/gi,
        message: tWithPrefix("postalCode.pattern"),
      },
      maxLength: {
        value: 14,
        message: tWithPrefix("postalCode.maxLength"),
      },
    },
    city: {
      pattern: {
        value: /[a-z0-9éèàëñçù-]/gi,
        message: tWithPrefix("city.pattern"),
      },
      maxLength: {
        value: 64,
        message: tWithPrefix("city.maxLength"),
      },
    },
    phoneNumber1: {
      pattern: {
        value: /[0-9+-]/gi,
        message: tWithPrefix("phoneNumber.pattern"),
      },
      minLength: {
        value: 6,
        message: tWithPrefix("phoneNumber.minLength"),
      },
      maxLength: {
        value: 22,
        message: tWithPrefix("phoneNumber.maxLength"),
      },
    },
    phoneNumber2: {
      pattern: {
        value: /[0-9+-]/gi,
        message: tWithPrefix("phoneNumber.pattern"),
      },
      minLength: {
        value: 6,
        message: tWithPrefix("phoneNumber.minLength"),
      },
      maxLength: {
        value: 22,
        message: tWithPrefix("phoneNumber.maxLength"),
      },
    },
    optionalPhoneNumber: {
      pattern: {
        value: /[0-9+-]/gi,
        message: tWithPrefix("phoneNumber.pattern"),
      },
      minLength: {
        value: 6,
        message: tWithPrefix("phoneNumber.minLength"),
      },
      maxLength: {
        value: 22,
        message: tWithPrefix("phoneNumber.maxLength"),
      },
    },
    email: {
      required: tWithPrefix("email.required"),
      pattern: {
        value: /^[a-z0-9.-_]+@[a-z]+\.[a-z]{2,4}$/gi,
        message: tWithPrefix("email.pattern"),
      },
      maxLength: {
        value: 254,
        message: tWithPrefix("email.maxLength"),
      },
    },
    optionalEmail: {
      pattern: {
        value: /^[a-z0-9.-_]+@[a-z]+\.[a-z]{2,4}$/gi,
        message: tWithPrefix("email.pattern"),
      },
      maxLength: {
        value: 254,
        message: tWithPrefix("email.maxLength"),
      },
    },
    spokenLanguage: {
      pattern: {
        value: /[a-z0-9éèàëñçù]/gi,
        message: tWithPrefix("spokenLanguage.pattern"),
      },
      maxLength: {
        value: 45,
        message: tWithPrefix("spokenLanguage.maxLength"),
      },
    },

    password: {
      required: tWithPrefix("password.required"),
      minLength: {
        value: 8,
        message: tWithPrefix("password.minLength"),
      },
      maxLength: {
        value: 64,
        message: tWithPrefix("password.maxLength"),
      },
    },
    passwordConfirmation: {
      required: tWithPrefix("passwordConfirmation.required"),
      validate: (value) =>
        value === watch("password") ||
        tWithPrefix("passwordConfirmation.validate"),
    },
    userTypesId: {
      required: tWithPrefix("userTypesId.required"),
      validate: (value) => value <= 2 || tWithPrefix("userTypesId.validate"),
    },
    languages: {
      required: "languages",
      validate: (value) => value !== "" || "empty",
    },
    messageToUser: {
      pattern: {
        value: /[a-z0-9éèàëñçù;,.:()/-]/gi,
        message: tWithPrefix("messageToUser.pattern"),
      },
      minLength: {
        value: 3,
        message: tWithPrefix("messageToUser.minLength"),
      },
      maxLength: {
        value: 254,
        message: tWithPrefix("messageToUser.maxLength"),
      },
    },
    notificationToUser: {
      required: tWithPrefix("notificationToUser.required"),
      pattern: {
        value: /[a-z0-9éèàëñçù;,.:()/-]/gi,
        message: tWithPrefix("messageToUser.pattern"),
      },
      minLength: {
        value: 3,
        message: tWithPrefix("messageToUser.minLength"),
      },
      maxLength: {
        value: 254,
        message: tWithPrefix("messageToUser.maxLength"),
      },
    },
    oeuvreTitle: {
      required: tWithPrefix("oeuvreTitle.required"),
      pattern: {
        value: /[a-z0-9&éèàëñçù;,.:()/]/gi,
        message: tWithPrefix("oeuvreTitle.pattern"),
      },
      maxLength: {
        value: 128,
        message: tWithPrefix("oeuvreTitle.maxLength"),
      },
    },
    oeuvreSupport: {
      required: tWithPrefix("oeuvreSupport.required"),
    },
    oeuvreTechnique: {
      required: tWithPrefix("oeuvreTechnique.required"),
    },
    oeuvreFormat: {
      required: tWithPrefix("oeuvreFormat.required"),
    },
    oeuvreAvailability: {
      required: tWithPrefix("oeuvreAvailability.required"),
    },
    oeuvreWidth: {
      pattern: {
        value: /[0-9]/g,
        message: tWithPrefix("oeuvreWidth.pattern"),
      },
      maxLength: {
        value: 7,
        message: tWithPrefix("oeuvreWidth.maxLength"),
      },
      deps: ["oeuvreHeight"],
    },
    oeuvreHeight: {
      pattern: {
        value: /[0-9]/g,
        message: tWithPrefix("oeuvreHeight.pattern"),
      },
      maxLength: {
        value: 7,
        message: tWithPrefix("oeuvreHeight.maxLength"),
      },
      validate: (value) =>
        are2FieldsFilled(value, "oeuvreWidth") ||
        tWithPrefix("oeuvreHeight.required"),
    },
    oeuvreGivenToFirstname: {
      pattern: {
        value: /[a-z0-9éèàëñçù]/gi,
        message: tWithPrefix("oeuvreGivenToWho.pattern"),
      },
      maxLength: {
        value: 30,
        message: tWithPrefix("oeuvreGivenToWho.maxLength"),
      },
    },
    oeuvreGivenToLastname: {
      pattern: {
        value: /[a-z0-9éèàëñçù]/gi,
        message: tWithPrefix("oeuvreGivenToWho.pattern"),
      },
      maxLength: {
        value: 30,
        message: tWithPrefix("oeuvreGivenToWho.maxLength"),
      },
    },
    oeuvreGivenToKnownPerson: {
      required: tWithPrefix("oeuvreGivenToKnownPerson.required"),
      validate: (value) =>
        hasKeysWithTruthyValue(value, ["userId", "contactId"]) ||
        tWithPrefix("oeuvreGivenToKnownPerson.pattern"),
    },
    giftDate: {
      required: tWithPrefix("giftDate.required"),
      validate: {
        requiredDate: (value) =>
          watch("oeuvreAvailability")?.value !== 1 ||
          isDate(value) ||
          tWithPrefix("giftDate.required"),
      },
    },
    giftNote: {
      pattern: {
        value: emptyOrMinOneNonSpaceCharRegExp,
        message: tWithPrefix("giftNote.pattern"),
      },
      maxLength: {
        value: 254,
        message: tWithPrefix("giftNote.maxLength"),
      },
    },
    oeuvreSoldToKnownPerson: {
      required: tWithPrefix("oeuvreSoldToKnownPerson.required"),
      validate: (value) =>
        hasKeysWithTruthyValue(value, ["userId", "contactId"]) ||
        tWithPrefix("oeuvreSoldToKnownPerson.pattern"),
    },
    saleDate: {
      validate: {
        requiredDate: (value) =>
          watch("oeuvreAvailability")?.value !== 2 ||
          isDate(value) ||
          tWithPrefix("saleDate.required"),
      },
    },
    salePrice: {
      required: tWithPrefix("salePrice.required"),
      pattern: {
        value: priceEurRegExp,
        message: tWithPrefix("salePrice.pattern"),
      },
    },
    saleNote: {
      pattern: {
        value: emptyOrMinOneNonSpaceCharRegExp,
        message: tWithPrefix("saleNote.pattern"),
      },
      maxLength: {
        value: 254,
        message: tWithPrefix("saleNote.maxLength"),
      },
    },
    oeuvreReservedToKnownPerson: {
      required: tWithPrefix("oeuvreReservedToKnownPerson.required"),
      validate: (value) =>
        hasKeysWithTruthyValue(value, ["userId", "contactId"]) ||
        tWithPrefix("oeuvreReservedToKnownPerson.pattern"),
    },
    reservationDate: {
      validate: {
        requiredDate: (value) =>
          watch("oeuvreAvailability")?.value !== 3 ||
          isDate(value) ||
          tWithPrefix("reservationDate.required"),
      },
    },
    reservationPrice: {
      pattern: {
        value: priceEurRegExp,
        message: tWithPrefix("reservationPrice.pattern"),
      },
    },
    reservationNote: {
      pattern: {
        value: emptyOrMinOneNonSpaceCharRegExp,
        message: tWithPrefix("reservationNote.pattern"),
      },
      maxLength: {
        value: 254,
        message: tWithPrefix("reservationNote.maxLength"),
      },
    },
    artistCommentFr: {
      pattern: {
        value: minOneNonSpaceCharRegExp,
        message: tWithPrefix("artistCommentFr.pattern"),
      },
      maxLength: {
        value: 254,
        message: tWithPrefix("artistCommentFr.maxLength"),
      },
      validate: (value) =>
        !!value ||
        !areNumberOfFieldsFilled(1, [
          "artistCommentEnUS",
          "artistCommentEnGB",
        ]) ||
        tWithPrefix("artistCommentFr.validate"),
    },
    artistCommentEnUS: {
      pattern: {
        value: minOneNonSpaceCharRegExp,
        message: tWithPrefix("artistCommentEnUS.pattern"),
      },
      maxLength: {
        value: 254,
        message: tWithPrefix("artistCommentEnUS.maxLength"),
      },
    },
    artistCommentEnGB: {
      pattern: {
        value: minOneNonSpaceCharRegExp,
        message: tWithPrefix("artistCommentEnGB.pattern"),
      },
      maxLength: {
        value: 254,
        message: tWithPrefix("artistCommentEnGB.maxLength"),
      },
    },
    oeuvreVisibility: {
      validate: (value) =>
        !value ||
        watch("oeuvreFile").length ||
        (isObjectNotEmpty(watch("oeuvreFileDefaultFile")) &&
          !watch("oeuvreFileDeleteFile")) ||
        tWithPrefix("oeuvreVisibility.validate"),
    },
    techniqueNameFr: {
      required: tWithPrefix("techniqueNameFr.required"),
      pattern: {
        value: minOneNonSpaceCharRegExp,
        message: tWithPrefix("techniqueNameFr.pattern"),
      },
      maxLength: {
        value: 64,
        message: tWithPrefix("techniqueNameFr.maxLength"),
      },
    },
    techniqueNameEnUS: {
      required: tWithPrefix("techniqueNameEnUS.required"),
      pattern: {
        value: minOneNonSpaceCharRegExp,
        message: tWithPrefix("techniqueNameEnUS.pattern"),
      },
      maxLength: {
        value: 64,
        message: tWithPrefix("techniqueNameEnUS.maxLength"),
      },
    },
    techniqueNameEnGB: {
      required: tWithPrefix("techniqueNameEnGB.required"),
      pattern: {
        value: minOneNonSpaceCharRegExp,
        message: tWithPrefix("techniqueNameEnGB.pattern"),
      },
      maxLength: {
        value: 64,
        message: tWithPrefix("techniqueNameEnGB.maxLength"),
      },
    },
    familyName: {
      required: tWithPrefix("familyName.required"),
      pattern: {
        value: minOneNonSpaceCharRegExp,
        message: tWithPrefix("familyName.pattern"),
      },
      maxLength: {
        value: 64,
        message: tWithPrefix("familyName.maxLength"),
      },
    },
    familyDescriptionFr: {
      pattern: {
        value: minOneNonSpaceCharRegExp,
        message: tWithPrefix("familyDescriptionFr.pattern"),
      },
      maxLength: {
        value: 8000,
        message: tWithPrefix("familyDescriptionFr.maxLength"),
      },
    },
    familyDescriptionEnUS: {
      pattern: {
        value: minOneNonSpaceCharRegExp,
        message: tWithPrefix("familyDescriptionEnUS.pattern"),
      },
      maxLength: {
        value: 8000,
        message: tWithPrefix("familyDescriptionEnUS.maxLength"),
      },
    },
    familyDescriptionEnGB: {
      pattern: {
        value: minOneNonSpaceCharRegExp,
        message: tWithPrefix("familyDescriptionEnGB.pattern"),
      },
      maxLength: {
        value: 8000,
        message: tWithPrefix("familyDescriptionEnGB.maxLength"),
      },
    },
    paintingSizeNameFr: {
      required: tWithPrefix("paintingSizeNameFr.required"),
      pattern: {
        value: minOneNonSpaceCharRegExp,
        message: tWithPrefix("paintingSizeNameFr.pattern"),
      },
      maxLength: {
        value: 64,
        message: tWithPrefix("paintingSizeNameFr.maxLength"),
      },
    },
    paintingSizeNameEnUS: {
      required: tWithPrefix("paintingSizeNameEnUS.required"),
      pattern: {
        value: minOneNonSpaceCharRegExp,
        message: tWithPrefix("paintingSizeNameEnUS.pattern"),
      },
      maxLength: {
        value: 64,
        message: tWithPrefix("paintingSizeNameEnUS.maxLength"),
      },
    },
    paintingSizeNameEnGB: {
      required: tWithPrefix("paintingSizeNameEnGB.required"),
      pattern: {
        value: minOneNonSpaceCharRegExp,
        message: tWithPrefix("paintingSizeNameEnGB.pattern"),
      },
      maxLength: {
        value: 64,
        message: tWithPrefix("paintingSizeNameEnGB.maxLength"),
      },
    },
    paintingSizeDescriptionFr: {
      pattern: {
        value: minOneNonSpaceCharRegExp,
        message: tWithPrefix("paintingSizeDescriptionFr.pattern"),
      },
      maxLength: {
        value: 8000,
        message: tWithPrefix("paintingSizeDescriptionFr.maxLength"),
      },
    },
    paintingSizeDescriptionEnUS: {
      pattern: {
        value: minOneNonSpaceCharRegExp,
        message: tWithPrefix("paintingSizeDescriptionEnUS.pattern"),
      },
      maxLength: {
        value: 8000,
        message: tWithPrefix("paintingSizeDescriptionEnUS.maxLength"),
      },
    },
    paintingSizeDescriptionEnGB: {
      pattern: {
        value: minOneNonSpaceCharRegExp,
        message: tWithPrefix("paintingSizeDescriptionEnGB.pattern"),
      },
      maxLength: {
        value: 8000,
        message: tWithPrefix("paintingSizeDescriptionEnGB.maxLength"),
      },
    },
    supportNameFr: {
      required: tWithPrefix("supportNameFr.required"),
      pattern: {
        value: minOneNonSpaceCharRegExp,
        message: tWithPrefix("supportNameFr.pattern"),
      },
      maxLength: {
        value: 64,
        message: tWithPrefix("supportNameFr.maxLength"),
      },
    },
    supportNameEnUS: {
      required: tWithPrefix("supportNameEnUS.required"),
      pattern: {
        value: minOneNonSpaceCharRegExp,
        message: tWithPrefix("supportNameEnUS.pattern"),
      },
      maxLength: {
        value: 64,
        message: tWithPrefix("supportNameEnUS.maxLength"),
      },
    },
    supportNameEnGB: {
      required: tWithPrefix("supportNameEnGB.required"),
      pattern: {
        value: minOneNonSpaceCharRegExp,
        message: tWithPrefix("supportNameEnGB.pattern"),
      },
      maxLength: {
        value: 64,
        message: tWithPrefix("supportNameEnGB.maxLength"),
      },
    },
    supportDescriptionFr: {
      pattern: {
        value: minOneNonSpaceCharRegExp,
        message: tWithPrefix("supportDescriptionFr.pattern"),
      },
      maxLength: {
        value: 8000,
        message: tWithPrefix("supportDescriptionFr.maxLength"),
      },
    },
    supportDescriptionEnUS: {
      pattern: {
        value: minOneNonSpaceCharRegExp,
        message: tWithPrefix("supportDescriptionEnUS.pattern"),
      },
      maxLength: {
        value: 8000,
        message: tWithPrefix("supportDescriptionEnUS.maxLength"),
      },
    },
    supportDescriptionEnGB: {
      pattern: {
        value: minOneNonSpaceCharRegExp,
        message: tWithPrefix("supportDescriptionEnGB.pattern"),
      },
      maxLength: {
        value: 8000,
        message: tWithPrefix("supportDescriptionEnGB.maxLength"),
      },
    },
  };
}
export default FormRegisterOptions;
