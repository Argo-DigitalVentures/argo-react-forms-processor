"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _validation = require("./validation");

var _utils = require("./utils.js");

var field1 = (0, _utils.createField)({
  id: "one",
  name: "name",
  value: "value"
});

describe("validateField", function () {
  test("visible, optional field is always valid", function () {
    var testField = _extends({}, field1, {
      visible: true,
      required: false
    });
    expect((0, _validation.validateField)(testField, [testField], true).isValid).toBe(true);
  });

  test("visible, required field with empty string value is valid", function () {
    var testField = _extends({}, field1, {
      visible: true,
      required: true,
      value: ""
    });
    expect((0, _validation.validateField)(testField, [testField], true).isValid).toBe(false);
  });

  test("visible, required field with numberical value 0 is valid", function () {
    var testField = _extends({}, field1, {
      visible: true,
      required: true,
      value: 0
    });
    expect((0, _validation.validateField)(testField, [testField], true).isValid).toBe(true);
  });

  test("visible, required field with false value is valid", function () {
    var testField = _extends({}, field1, {
      visible: true,
      required: true,
      value: false
    });
    expect((0, _validation.validateField)(testField, [testField], true).isValid).toBe(true);
  });

  test("visible, required field with string value is valid", function () {
    var testField = _extends({}, field1, {
      visible: true,
      required: true,
      value: "test"
    });
    expect((0, _validation.validateField)(testField, [testField], true).isValid).toBe(true);
  });

  test("visible, required field with empty array value is invalid", function () {
    var testField = _extends({}, field1, {
      visible: true,
      required: true,
      value: []
    });
    expect((0, _validation.validateField)(testField, [testField], true).isValid).toBe(false);
  });

  test("visible, required field with populated array value is valid", function () {
    var testField = _extends({}, field1, {
      visible: true,
      required: true,
      value: [1]
    });
    expect((0, _validation.validateField)(testField, [testField], true).isValid).toBe(true);
  });

  test("visible, required field with missing data shows custom message", function () {
    var errorMessage = "Where's my data?";
    var testField = _extends({}, field1, {
      visible: true,
      required: true,
      value: "",
      missingValueMessage: errorMessage
    });
    var validationResult = (0, _validation.validateField)(testField, [testField], true);
    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errorMessages).toBe(errorMessage);
  });

  test("using validation handler reporting invalid", function () {
    var testField = _extends({}, field1, {
      visible: true
    });
    var validationHandler = function validationHandler(field, fields) {
      return "Fail";
    };
    expect((0, _validation.validateField)(testField, [testField], true, validationHandler).isValid).toBe(false);
  });

  test("using validation handler reporting valid", function () {
    var testField = _extends({}, field1, {
      visible: true
    });
    var validationHandler = function validationHandler(field, fields) {
      return null;
    };
    expect((0, _validation.validateField)(testField, [testField], true, validationHandler).isValid).toBe(true);
  });

  test("validation of trimmed and required field with whitespace value is false", function () {
    var testField = _extends({}, field1, {
      visible: true,
      required: true,
      value: "     ",
      trimValue: true
    });
    var validationResult = (0, _validation.validateField)(testField, [testField], true);
    expect(validationResult.isValid).toBe(false);
  });

  test("validation of untrimmed and required field with whitespace value is true", function () {
    var testField = _extends({}, field1, {
      visible: true,
      required: true,
      value: "     "
    });
    var validationResult = (0, _validation.validateField)(testField, [testField], true);
    expect(validationResult.isValid).toBe(true);
  });

  test("field is only discretely invalid if not touched", function () {
    var testField = _extends({}, field1, {
      visible: true,
      required: true,
      value: "",
      touched: false
    });
    var validationResult = (0, _validation.validateField)(testField, [testField], false);
    expect(validationResult.isValid).toBe(true);
    expect(validationResult.isDiscretelyInvalid).toBe(true);
    expect(validationResult.errorMessages).toBe("");
  });

  test("field is invalid when touched", function () {
    var testField = _extends({}, field1, {
      visible: true,
      required: true,
      value: "",
      touched: true
    });
    var validationResult = (0, _validation.validateField)(testField, [testField], false);
    expect(validationResult.isValid).toBe(false);
    expect(validationResult.isDiscretelyInvalid).toBe(true);
    expect(validationResult.errorMessages).toBe("A value must be provided");
  });

  test("field validation rules not processed without value", function () {
    var testField = _extends({}, field1, {
      visible: true,
      required: false,
      value: "",
      touched: true,
      validWhen: {
        matchesRegEx: {
          pattern: "^[\\d]+$",
          message: "Length can only be in whole numbers"
        }
      }
    });
    var validationResult = (0, _validation.validateField)(testField, [testField], true);
    expect(validationResult.isValid).toBe(true);
    expect(validationResult.isDiscretelyInvalid).toBe(false);
  });
});

describe("lengthIsGreaterThan validator", function () {
  test("with valid value", function () {
    expect((0, _validation.lengthIsGreaterThan)({
      value: "test",
      length: 3,
      message: "Fail"
    })).toBeUndefined();
  });

  test("with invvalid value", function () {
    expect((0, _validation.lengthIsGreaterThan)({
      value: "te",
      length: 3,
      message: "Fail"
    })).toBe("Fail");
  });
});

describe("lengthIsLessThan validator", function () {
  test("with valid value", function () {
    expect((0, _validation.lengthIsLessThan)({
      value: "te",
      length: 3,
      message: "Fail"
    })).toBeUndefined();
  });

  test("with invvalid value", function () {
    expect((0, _validation.lengthIsLessThan)({
      value: "test",
      length: 3,
      message: "Fail"
    })).toBe("Fail");
  });
});

describe("matchesRegEx validator", function () {
  test("fails when letters provided for numbers only pattern", function () {
    expect((0, _validation.matchesRegEx)({ value: "12a3", pattern: "^[\\d]+$", message: "Fail" })).toBe("Fail");
  });

  test("succeeds when numbers provided for numbers only pattern", function () {
    expect((0, _validation.matchesRegEx)({ value: "1234", pattern: "^[\\d]+$", message: "Fail" })).toBeUndefined();
  });
});

describe("getDefaultNumericalRangeErrorMessages", function () {
  test("for min and max", function () {
    expect((0, _validation.getDefaultNumericalRangeErrorMessages)(1, 5)).toEqual("Value cannot be less than 1 or greater than 5");
  });
  test("for just min", function () {
    expect((0, _validation.getDefaultNumericalRangeErrorMessages)(1)).toEqual("Value cannot be less than 1");
  });
  test("for just max", function () {
    expect((0, _validation.getDefaultNumericalRangeErrorMessages)(undefined, 5)).toEqual("Value cannot be greater than 5");
  });
});

describe("fallsWithinNumericalRange", function () {
  test("fails when given a non-numerical number", function () {
    expect(
    // $FlowFixMe - Typing should prevent this, but we're testing the output
    (0, _validation.fallsWithinNumericalRange)({ value: "abc", min: 5, message: "Fail" })).toBe("Fail");
  });

  test("succeeds with just a max", function () {
    expect(
    // $FlowFixMe - Typing should prevent this, but we're testing the output
    (0, _validation.fallsWithinNumericalRange)({
      value: "5",
      min: 1,
      message: "Fail"
    })).toBeUndefined();
  });

  test("fails with just a min", function () {
    expect(
    // $FlowFixMe - Typing should prevent this, but we're testing the output
    (0, _validation.fallsWithinNumericalRange)({
      value: 6,
      max: 10,
      message: "Fail"
    })).toBeUndefined();
  });

  test("succeeds with null", function () {
    expect(
    // $FlowFixMe - Typing should prevent this, but we're testing the output
    (0, _validation.fallsWithinNumericalRange)({
      value: null,
      min: 0,
      max: 5,
      message: "Fail"
    })).toBeUndefined();
  });
  test("succeeds with string null", function () {
    expect(
    // $FlowFixMe - Typing should prevent this, but we're testing the output
    (0, _validation.fallsWithinNumericalRange)({
      value: "null",
      min: 0,
      max: 5,
      message: "Fail"
    })).toBe("Fail");
  });

  test("succeeds with undefined", function () {
    expect(
    // $FlowFixMe - Typing should prevent this, but we're testing the output
    (0, _validation.fallsWithinNumericalRange)({
      value: undefined,
      min: 0,
      max: 5,
      message: "Fail"
    })).toBeUndefined();
  });

  test("fails with whitespace", function () {
    expect(
    // $FlowFixMe - Typing should prevent this, but we're testing the output
    (0, _validation.fallsWithinNumericalRange)({
      value: "       ",
      min: 10,
      message: "Fail"
    })).toBe("Fail");
  });

  test("fails with just a max", function () {
    expect(
    // $FlowFixMe - Typing should prevent this, but we're testing the output
    (0, _validation.fallsWithinNumericalRange)({
      value: 6,
      max: 5,
      message: "Fail"
    })).toBe("Fail");
  });

  test("succeeds with empty string", function () {
    expect(
    // $FlowFixMe - Typing should prevent this, but we're testing the output
    (0, _validation.fallsWithinNumericalRange)({
      value: "",
      min: 0,
      max: 5,
      message: "Fail"
    })).toBeUndefined();
  });

  test("succeeds with null", function () {
    expect(
    // $FlowFixMe - Typing should prevent this, but we're testing the output
    (0, _validation.fallsWithinNumericalRange)({
      value: null,
      min: 0,
      max: 5,
      message: "Fail"
    })).toBeUndefined();
  });
  test("succeeds with string null", function () {
    expect(
    // $FlowFixMe - Typing should prevent this, but we're testing the output
    (0, _validation.fallsWithinNumericalRange)({
      value: null,
      min: 0,
      max: 5,
      message: "Fail"
    })).toBeUndefined();
  });

  test("succeeds with undefined", function () {
    expect(
    // $FlowFixMe - Typing should prevent this, but we're testing the output
    (0, _validation.fallsWithinNumericalRange)({
      value: undefined,
      min: 0,
      max: 5,
      message: "Fail"
    })).toBeUndefined();
  });

  test("fails with whitespace", function () {
    expect(
    // $FlowFixMe - Typing should prevent this, but we're testing the output
    (0, _validation.fallsWithinNumericalRange)({
      value: "",
      min: 0,
      max: 5,
      message: "Fail"
    })).toBeUndefined();
  });
});

describe("isBigger", function () {
  var fieldOne = (0, _utils.createField)({
    id: "ONE",
    name: "one",
    value: "5"
  });
  test("number strings are parsed to numbers", function () {
    expect((0, _validation.isBigger)("6", fieldOne)).toBe(true);
  });

  test("returns false if one field has a non-numeric string value", function () {
    fieldOne.value = "bob";
    expect((0, _validation.isBigger)(2, fieldOne)).toBe(false);
  });

  test("numbers are correctly handled - 6 is bigger than 5", function () {
    fieldOne.value = 5;
    expect((0, _validation.isBigger)(6, fieldOne)).toBe(true);
  });

  test("numbers are correctly handled - 2 is not bigger than 5", function () {
    fieldOne.value = 5;
    expect((0, _validation.isBigger)(2, fieldOne)).toBe(false);
  });
});

describe("isLonger", function () {
  var field = (0, _utils.createField)({
    id: "ONE",
    name: "one",
    value: "a value"
  });

  test("null value is never longer", function () {
    expect((0, _validation.isLonger)(null, field)).toBe(false);
  });

  test("undefined field values are never shorter", function () {
    field.value = undefined;
    expect((0, _validation.isLonger)("bob", field)).toBe(false);
  });

  test("numbers are converted to strings", function () {
    field.value = "bob";
    expect((0, _validation.isLonger)(1234, field)).toBe(true);
  });

  test("string values are compared correctly - 1234 is longer than bob", function () {
    expect((0, _validation.isLonger)("1234", field)).toBe(true);
  });

  test("string values are compared correctly - 12 is not longer than bob", function () {
    expect((0, _validation.isLonger)("12", field)).toBe(false);
  });
});

describe("comparedTo", function () {
  var bigField = (0, _utils.createField)({
    id: "BIGGEST",
    name: "big",
    value: 500
  });
  var smallField = (0, _utils.createField)({
    id: "SMALLEST",
    name: "small",
    value: 10
  });
  var longField = (0, _utils.createField)({
    id: "LONGEST",
    name: "long",
    value: "Really, really long"
  });
  var shortField = (0, _utils.createField)({
    id: "SHORTEST",
    name: "short",
    value: "short"
  });

  var allFields = [bigField, smallField, longField, shortField];

  test("finds available fields", function () {
    expect((0, _validation.findFieldsToCompareTo)(["BIGGEST", "NOPE", "SHORTEST", "NAH"], allFields)).toMatchSnapshot();
  });

  test("150 is not bigger than BIGGEST field", function () {
    expect((0, _validation.comparedTo)({
      value: 150,
      fields: ["BIGGEST"],
      allFields: allFields,
      is: "BIGGER",
      message: "Fail"
    })).toBe("Fail");
  });

  test("600 is bigger than BIGGEST field", function () {
    expect((0, _validation.comparedTo)({
      value: 600,
      fields: ["BIGGEST"],
      allFields: allFields,
      is: "BIGGER",
      message: "Fail"
    })).toBeUndefined();
  });

  test("150 is not smaller than SMALLEST field", function () {
    expect((0, _validation.comparedTo)({
      value: 150,
      fields: ["SMALLEST"],
      allFields: allFields,
      is: "SMALLER",
      message: "Fail"
    })).toBe("Fail");
  });

  test("5 is smaller than SMALLEST field", function () {
    expect((0, _validation.comparedTo)({
      value: 5,
      fields: ["SMALLEST"],
      allFields: allFields,
      is: "SMALLER",
      message: "Fail"
    })).toBeUndefined();
  });

  test("'bob' is not longer than LONGEST field", function () {
    expect((0, _validation.comparedTo)({
      value: "bob",
      fields: ["LONGEST"],
      allFields: allFields,
      is: "LONGER",
      message: "Fail"
    })).toBe("Fail");
  });

  test("'sizeable' is longer than SHORTEST field", function () {
    expect((0, _validation.comparedTo)({
      value: "sizeable",
      fields: ["SHORTEST"],
      allFields: allFields,
      is: "LONGER",
      message: "Fail"
    })).toBeUndefined();
  });

  test("'medium' is not shorter than SHORTEST field", function () {
    expect((0, _validation.comparedTo)({
      value: "medium",
      fields: ["SHORTEST"],
      allFields: allFields,
      is: "SHORTER",
      message: "Fail"
    })).toBe("Fail");
  });

  test("'bob' is shorter than SHORTEST field", function () {
    expect((0, _validation.comparedTo)({
      value: "bob",
      fields: ["SHORTEST"],
      allFields: allFields,
      is: "SHORTER",
      message: "Fail"
    })).toBeUndefined();
  });
});

describe("isValue", function () {
  test("matching value does not cause error", function () {
    expect((0, _validation.isValue)({
      value: "bob",
      values: ["bob", "ted", "geoff"],
      message: "Fail"
    })).toBeUndefined();
  });

  test("non-matching value causes error", function () {
    expect((0, _validation.isValue)({
      value: "sally",
      values: ["bob", "ted", "geoff"],
      message: "Fail"
    })).toBe("Fail");
  });
});

describe("isNotValue", function () {
  test("matching value causes error", function () {
    expect((0, _validation.isNotValue)({
      value: "bob",
      values: ["bob", "ted", "geoff"],
      message: "Fail"
    })).toBe("Fail");
  });

  test("non-matching value returns undefined", function () {
    expect((0, _validation.isNotValue)({
      value: "sally",
      values: ["bob", "ted", "geoff"],
      message: "Fail"
    })).toBeUndefined();
  });
});

describe("hasValue", function () {
  test("string", function () {
    expect((0, _validation.hasValue)("value")).toEqual(true);
  });

  test("array", function () {
    expect((0, _validation.hasValue)([1, 2])).toEqual(true);
  });

  test("true", function () {
    expect((0, _validation.hasValue)(true)).toEqual(true);
  });

  test("false", function () {
    expect((0, _validation.hasValue)(false)).toEqual(true);
  });

  test("empty array", function () {
    expect((0, _validation.hasValue)([])).toEqual(false);
  });

  test("empty string", function () {
    expect((0, _validation.hasValue)("")).toEqual(false);
  });

  test("undefined", function () {
    expect((0, _validation.hasValue)(undefined)).toEqual(false);
  });

  test("null", function () {
    expect((0, _validation.hasValue)(null)).toEqual(false);
  });
});