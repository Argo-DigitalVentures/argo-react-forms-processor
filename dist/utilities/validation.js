"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var findFieldsToCompareTo = exports.findFieldsToCompareTo = function findFieldsToCompareTo(fieldsToFind, allFields) {
  var targetFields = [];

  typeof fieldsToFind.forEach === "function" && fieldsToFind.forEach(function (targetField) {
    var target = allFields.find(function (currField) {
      return targetField === currField.id;
    });
    if (!target) {
      console.warn("Could not find field " + targetField + " to compare against");
    } else if (target.visible === true) {
      // TODO: Only comparing against visible fields at the moment, but is there a case where
      //       you might want to hide a value in a hidden field?
      targetFields.push(target);
    }
  });

  return targetFields;
};
var isBigger = exports.isBigger = function isBigger(value, comparedTo) {
  return compareSize(value, comparedTo, "BIGGER");
};

var isSmaller = exports.isSmaller = function isSmaller(value, comparedTo) {
  return compareSize(value, comparedTo, "SMALLER");
};

var compareSize = exports.compareSize = function compareSize(value, comparedTo, type) {
  var targetValue = parseFloat(value);
  var compareValue = parseFloat(comparedTo.value);
  if (targetValue === NaN || compareValue === NaN) {
    return false;
  } else if (type === "BIGGER") {
    return targetValue > compareValue;
  } else {
    return targetValue < compareValue;
  }
};

var isLonger = exports.isLonger = function isLonger(value, comparedTo) {
  return compareLength(value, comparedTo, "LONGER");
};
var isShorter = exports.isShorter = function isShorter(value, comparedTo) {
  return compareLength(value, comparedTo, "SHORTER");
};

var compareLength = exports.compareLength = function compareLength(value, comparedTo, type) {
  var valueLength = value ? value.toString().length : undefined;
  var compareLength = comparedTo.value ? comparedTo.value.toString().length : undefined;
  if (valueLength === undefined || compareLength === undefined) {
    return false;
  } else if (type === "LONGER") {
    return valueLength > compareLength;
  } else {
    return valueLength < compareLength;
  }
};

var comparedTo = exports.comparedTo = function comparedTo(_ref) {
  var value = _ref.value,
      _ref$fields = _ref.fields,
      fields = _ref$fields === undefined ? [] : _ref$fields,
      _ref$allFields = _ref.allFields,
      allFields = _ref$allFields === undefined ? [] : _ref$allFields,
      _ref$is = _ref.is,
      is = _ref$is === undefined ? "BIGGER" : _ref$is,
      message = _ref.message;

  var targetFields = findFieldsToCompareTo(fields, allFields);

  switch (is) {
    case "BIGGER":
      {
        return targetFields.every(function (targetField) {
          return isBigger(value, targetField);
        }) ? undefined : message || "Not the biggest field";
      }

    case "SMALLER":
      {
        return targetFields.every(function (targetField) {
          return isSmaller(value, targetField);
        }) ? undefined : message || "Not the smallest field";
      }

    case "LONGER":
      {
        return targetFields.every(function (targetField) {
          return isLonger(value, targetField);
        }) ? undefined : message || "Not the longer field";
      }

    case "SHORTER":
      {
        return targetFields.every(function (targetField) {
          return isShorter(value, targetField);
        }) ? undefined : message || "Not the shortest field";
      }

    default:
      return;
  }
};

var lengthIsGreaterThan = exports.lengthIsGreaterThan = function lengthIsGreaterThan(_ref2) {
  var value = _ref2.value,
      length = _ref2.length,
      message = _ref2.message;

  if (isNaN(length) || (value || "").length > length) {
    return;
  } else {
    return message || "Should have more than " + length + " characters";
  }
};

var lengthIsLessThan = exports.lengthIsLessThan = function lengthIsLessThan(_ref3) {
  var value = _ref3.value,
      length = _ref3.length,
      message = _ref3.message;

  if (isNaN(length) || (value || "").length < length) {
    return;
  } else {
    return message || "Should have more than " + length + " characters";
  }
};

// TODO: Consider option for inverting rule...
var matchesRegEx = exports.matchesRegEx = function matchesRegEx(_ref4) {
  var value = _ref4.value,
      _ref4$pattern = _ref4.pattern,
      pattern = _ref4$pattern === undefined ? ".*" : _ref4$pattern,
      message = _ref4.message;

  var regExObj = new RegExp(pattern);
  if (!regExObj.test(value)) {
    return message || "Invalid input provided"; // <= Terrible message!
  }
};

var getDefaultNumericalRangeErrorMessages = exports.getDefaultNumericalRangeErrorMessages = function getDefaultNumericalRangeErrorMessages(min, max) {
  if (typeof min !== "undefined" && typeof max !== "undefined") {
    return "Value cannot be less than " + min + " or greater than " + max;
  } else if (typeof min !== "undefined") {
    return "Value cannot be less than " + min;
  } else if (typeof max !== "undefined") {
    return "Value cannot be greater than " + max;
  }
};

var fallsWithinNumericalRange = exports.fallsWithinNumericalRange = function fallsWithinNumericalRange(_ref5) {
  var value = _ref5.value,
      min = _ref5.min,
      max = _ref5.max,
      required = _ref5.required,
      message = _ref5.message;

  var parsedValue = parseFloat(value);

  if (typeof value === "undefined" || value === null || typeof value === "string" && !value.length) {
    return undefined;
  }

  if (isNaN(parsedValue)) {
    return message || "Value must be a number";
  }
  if (typeof min !== "undefined" && value < min) {
    return message || getDefaultNumericalRangeErrorMessages(min, max);
  }
  if (typeof max !== "undefined" && value > max) {
    return message || getDefaultNumericalRangeErrorMessages(min, max);
  }
};

var isNotValue = exports.isNotValue = function isNotValue(_ref6) {
  var value = _ref6.value,
      values = _ref6.values,
      message = _ref6.message;

  if (values.some(function (currValue) {
    return currValue === value;
  })) {
    return message || "Unacceptable value provided";
  }
};

var isValue = exports.isValue = function isValue(_ref7) {
  var value = _ref7.value,
      values = _ref7.values,
      message = _ref7.message;

  if (!values.some(function (currValue) {
    return currValue === value;
  })) {
    return message || "Unacceptable value provided";
  }
};

var runValidator = exports.runValidator = function runValidator(validatorKey, validWhen, valueToTest, allFields) {
  var validator = validators[validatorKey];
  if (typeof validator === "function") {
    var validatorConfig = _extends({}, validWhen[validatorKey], {
      value: valueToTest,
      allFields: allFields
    });
    var message = validator(validatorConfig);
    return message === undefined;
  } else {
    return false;
  }
};

var checkConditions = function checkConditions(condition, value, allFields, type) {
  var valueToTest = void 0; // Don't initialise to current field value in case field doesn't exist
  if (condition.field) {
    var targetField = allFields.find(function (field) {
      return condition.field === field.id;
    });
    if (targetField) {
      valueToTest = targetField.value;
    }
  } else {
    valueToTest = value;
  }

  var field = condition.field,
      validWhen = _objectWithoutProperties(condition, ["field"]);

  switch (type) {
    case "some":
      {
        return Object.keys(validWhen).some(function (validatorKey) {
          return runValidator(validatorKey, condition, valueToTest, allFields);
        });
      }

    default:
      {
        return Object.keys(validWhen).every(function (validatorKey) {
          return runValidator(validatorKey, condition, valueToTest, allFields);
        });
      }
  }
};

exports.checkConditions = checkConditions;
var noneAreTrue = exports.noneAreTrue = function noneAreTrue(_ref8) {
  var value = _ref8.value,
      allFields = _ref8.allFields,
      message = _ref8.message,
      conditions = _ref8.conditions;

  var allConditionsPass = conditions.some(function (condition) {
    return checkConditions(condition, value, allFields, "some");
  });

  return allConditionsPass ? message : undefined;
};

var someAreTrue = exports.someAreTrue = function someAreTrue(_ref9) {
  var value = _ref9.value,
      allFields = _ref9.allFields,
      message = _ref9.message,
      conditions = _ref9.conditions;

  var allConditionsPass = conditions.some(function (condition) {
    return checkConditions(condition, value, allFields, "some");
  });

  return allConditionsPass ? undefined : message;
};

var allAreTrue = exports.allAreTrue = function allAreTrue(_ref10) {
  var value = _ref10.value,
      allFields = _ref10.allFields,
      message = _ref10.message,
      conditions = _ref10.conditions;

  var allConditionsPass = conditions.every(function (condition) {
    return checkConditions(condition, value, allFields, "all");
  });

  return allConditionsPass ? undefined : message;
};

var validators = exports.validators = {
  allAreTrue: allAreTrue,
  comparedTo: comparedTo,
  fallsWithinNumericalRange: fallsWithinNumericalRange,
  is: isValue,
  isNot: isNotValue,
  lengthIsGreaterThan: lengthIsGreaterThan,
  lengthIsLessThan: lengthIsLessThan,
  matchesRegEx: matchesRegEx,
  noneAreTrue: noneAreTrue,
  someAreTrue: someAreTrue
};

var hasValue = exports.hasValue = function hasValue(value) {
  var valueIsEmptyArray = Array.isArray(value) && value.length === 0;
  var hasValue = (value || value === 0 || value === false) && !valueIsEmptyArray;
  return hasValue;
};

var getValueFromField = exports.getValueFromField = function getValueFromField(field) {
  var _field$trimValue = field.trimValue,
      trimValue = _field$trimValue === undefined ? false : _field$trimValue,
      value = field.value;

  var trimmedValue = value;
  if (trimValue && trimmedValue && typeof trimmedValue.trim === "function") {
    trimmedValue = trimmedValue.trim();
  }
  return trimmedValue;
};

var validateField = exports.validateField = function validateField(field, fields, showValidationBeforeTouched, validationHandler, parentContext) {
  var required = field.required,
      visible = field.visible,
      _field$validWhen = field.validWhen,
      validWhen = _field$validWhen === undefined ? {} : _field$validWhen,
      _field$touched = field.touched,
      touched = _field$touched === undefined ? false : _field$touched;

  var isValid = true;
  var errorMessages = [];
  if (visible) {
    var value = getValueFromField(field);
    var valueProvided = hasValue(value);
    if (required) {
      if (!valueProvided) {
        isValid = valueProvided;
        var _field$missingValueMe = field.missingValueMessage,
            missingValueMessage = _field$missingValueMe === undefined ? "A value must be provided" : _field$missingValueMe;

        errorMessages.push(missingValueMessage);
      }
    } else if (!valueProvided) {
      // do not run all validations if the field is empty
      return Object.assign({}, field, {
        isValid: true,
        isDiscretelyInvalid: !isValid,
        errorMessages: errorMessages.length ? errorMessages.join(". ") : ""
      });
    }

    isValid = Object.keys(validWhen).reduce(function (allValidatorsPass, validator) {
      if (typeof validators[validator] === "function") {
        var validationConfig = _extends({}, validWhen[validator], {
          value: value,
          allFields: fields
        });
        // $FlowFixMe - covered by tests
        var message = validators[validator](validationConfig);
        if (message) {
          allValidatorsPass = false;
          errorMessages.push(message);
        }
      } else {
        console.warn("The requested validator does not exist", validator);
      }

      return allValidatorsPass;
    }, isValid) && isValid;
  }
  if (validationHandler) {
    var message = validationHandler(field, fields, parentContext);
    if (message) {
      isValid = false;
      errorMessages.push(message);
    }
  }

  if (!showValidationBeforeTouched && !touched) {
    return Object.assign({}, field, {
      isValid: true,
      isDiscretelyInvalid: !isValid,
      errorMessages: ""
    });
  }

  return Object.assign({}, field, {
    isValid: isValid,
    isDiscretelyInvalid: !isValid,
    errorMessages: errorMessages.join(". ")
  });
};

var validateAllFields = exports.validateAllFields = function validateAllFields(_ref11) {
  var fields = _ref11.fields,
      showValidationBeforeTouched = _ref11.showValidationBeforeTouched,
      validationHandler = _ref11.validationHandler,
      parentContext = _ref11.parentContext;

  var validatedFields = fields.map(function (field) {
    return validateField(field, fields, showValidationBeforeTouched, validationHandler, parentContext);
  });
  return validatedFields;
};