import { useTranslation } from "react-i18next";

import { isArray } from "./typesAndValidationChecks";
import { hasKeysWithTruthyValue } from "./objectMethods/objectValidation";
import { minOneNonSpaceCharRegExp, priceEurRegExp } from "./regularExpressions";

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
    oeuvreSoldToKnownPerson: {
      required: tWithPrefix("oeuvreSoldToKnownPerson.required"),
      validate: (value) =>
        hasKeysWithTruthyValue(value, ["userId", "contactId"]) ||
        tWithPrefix("oeuvreSoldToKnownPerson.pattern"),
    },
    oeuvreReservedToKnownPerson: {
      required: tWithPrefix("oeuvreReservedToKnownPerson.required"),
      validate: (value) =>
        hasKeysWithTruthyValue(value, ["userId", "contactId"]) ||
        tWithPrefix("oeuvreReservedToKnownPerson.pattern"),
    },
    reservationDate: {
      required: tWithPrefix("reservationDate.required"),
    },
    reservationPrice: {
      pattern: {
        value: priceEurRegExp,
        message: tWithPrefix("reservationPrice.pattern"),
      },
    },
    saleDate: {
      required: tWithPrefix("saleDate.required"),
    },
    salePrice: {
      required: tWithPrefix("salePrice.required"),
      pattern: {
        value: priceEurRegExp,
        message: tWithPrefix("salePrice.pattern"),
      },
    },
    giftDate: {
      required: tWithPrefix("giftDate.required"),
    },
    artistComment: {
      pattern: {
        value: /[a-z0-9éèàëñçù;,.!?%µ*§£$€"'&:()/+-]/gi,
        message: tWithPrefix("artistComment.pattern"),
      },
      maxLength: {
        value: 254,
        message: tWithPrefix("artistComment.maxLength"),
      },
    },
    oeuvreVisibility: {
      validate: (value) =>
        !value ||
        watch("oeuvreFile").length ||
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
    familyDescription: {
      pattern: {
        value: minOneNonSpaceCharRegExp,
        message: tWithPrefix("familyDescription.pattern"),
      },
      maxLength: {
        value: 8000,
        message: tWithPrefix("familyDescription.maxLength"),
      },
    },
  };
}
export default FormRegisterOptions;
