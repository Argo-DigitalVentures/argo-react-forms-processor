"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _utils = require("./utils");

var field1 = (0, _utils.createField)({
  id: "one",
  name: "name",
  value: "value"
});

describe("registerFields", function () {
  var field1 = (0, _utils.createField)({
    id: "a",
    name: "a",
    type: "text"
  });
  var field2 = (0, _utils.createField)({
    id: "b",
    name: "b",
    type: "text"
  });
  var field3 = (0, _utils.createField)({
    id: "a",
    name: "c",
    type: "text"
  });

  var fields = [field1, field2, field3];

  test("fields with duplicate IDs are filtered out", function () {
    var registeredFields = (0, _utils.registerFields)(fields, {});
    expect(registeredFields.length).toEqual(2);
    expect(registeredFields[0].id).toEqual("a");
    expect(registeredFields[1].id).toEqual("b");
  });
});

describe("fieldDefIsValid", function () {
  it("field is valid when the form does not contain a field with the same id", function () {
    expect((0, _utils.fieldDefIsValid)(field1, [])).toEqual(true);
  });

  test("field is not valid when form already contains a field with the same id", function () {
    expect((0, _utils.fieldDefIsValid)(field1, [field1])).toEqual(false);
  });
});

describe("evaluateRule", function () {
  test("evaluting a rule with no arguments", function () {
    expect((0, _utils.evaluateRule)()).toEqual(true);
  });

  test("successful 'is' rule", function () {
    expect((0, _utils.evaluateRule)({
      field: "one",
      rule: {
        is: [true]
      },
      targetValue: true
    })).toEqual(true);
  });

  test("failing 'is' rule", function () {
    expect((0, _utils.evaluateRule)({
      field: "one",
      is: [false]
    }, true)).toEqual(false);
  });

  test("successful 'isNot' rule", function () {
    expect((0, _utils.evaluateRule)({
      field: "one",
      isNot: [true]
    }, false)).toEqual(true);
  });

  test("failing 'isNot' rule", function () {
    expect((0, _utils.evaluateRule)({
      field: "one",
      isNot: [false]
    }, false)).toEqual(false);
  });

  test("successful combined 'is' and isNot' rule", function () {
    expect((0, _utils.evaluateRule)({
      field: "onee",
      is: [true],
      isNot: [false]
    }, true)).toEqual(true);
  });

  test("failing combined 'is' and isNot' rule", function () {
    expect((0, _utils.evaluateRule)({
      field: "one",
      is: [true],
      isNot: [false]
    }, false)).toEqual(false);
  });

  // NOTE: This is one option for allowing form builder to construct rules, but is harder to implement
  test("works with complex objects", function () {
    expect((0, _utils.evaluateRule)({
      field: "one",
      is: [{ value: "bob" }],
      isNot: [{ value: "ted" }]
    }, "bob")).toEqual(true);
  });
});

describe("rule evaluation", function () {
  // Declare some rules to test...
  var aIs1 = { field: "a", is: ["1"] };
  var bIs2 = { field: "b", is: ["2"] };
  var cIs3 = { field: "c", is: ["3"] };

  // Create some fields to be tested (fieldC is expected to fail)...
  var fieldA = (0, _utils.createField)({ id: "A", name: "a", value: "1" });
  var fieldB = (0, _utils.createField)({ id: "B", name: "b", value: "2" });
  var fieldC = (0, _utils.createField)({ id: "C", name: "c", value: "fail" });

  describe("evaluateAllRules", function () {
    test("passes when there are no rules provided", function () {
      var rules = [];
      var fieldsById = {};
      expect((0, _utils.evaluateAllRules)({ rules: rules, fieldsById: fieldsById, defaultResult: true })).toEqual(true);
    });

    test("fails when one rule fails", function () {
      var rules = [aIs1, bIs2, cIs3];
      var fieldsById = {
        a: fieldA,
        b: fieldB,
        c: fieldC
      };
      expect((0, _utils.evaluateAllRules)({ rules: rules, fieldsById: fieldsById, defaultResult: true })).toEqual(false);
    });

    test("passes when all rules pass", function () {
      var rules = [aIs1, bIs2];
      var fieldsById = {
        a: fieldA,
        b: fieldB,
        c: fieldC
      };
      expect((0, _utils.evaluateAllRules)({ rules: rules, fieldsById: fieldsById, defaultResult: true })).toEqual(true);
    });
  });

  describe("evaluateSomeRules", function () {
    test("passes when there are no rules provided", function () {
      var rules = [];
      var fieldsById = {};
      expect((0, _utils.evaluateSomeRules)({ rules: rules, fieldsById: fieldsById, defaultResult: true })).toEqual(true);
    });

    test("fails when all rules fail", function () {
      var rules = [cIs3];
      var fieldsById = {
        c: fieldC
      };
      expect((0, _utils.evaluateSomeRules)({ rules: rules, fieldsById: fieldsById, defaultResult: true })).toEqual(false);
    });

    test("passes when some rules pass but some fail", function () {
      var rules = [aIs1, bIs2, cIs3];
      var fieldsById = {
        a: fieldA,
        b: fieldB,
        c: fieldC
      };
      expect((0, _utils.evaluateSomeRules)({ rules: rules, fieldsById: fieldsById, defaultResult: true })).toEqual(true);
    });

    test("passes when all rules pass", function () {
      var rules = [aIs1, bIs2];
      var fieldsById = {
        a: fieldA,
        b: fieldB,
        c: fieldC
      };
      expect((0, _utils.evaluateSomeRules)({ rules: rules, fieldsById: fieldsById, defaultResult: true })).toEqual(true);
    });
  });

  describe("isVisible", function () {
    var field = _extends({}, (0, _utils.createField)({
      id: "test",
      name: "test",
      value: "bob"
    }));
    var fieldsById = {
      test: field,
      a: fieldA,
      b: fieldB,
      c: fieldC
    };

    test("returns true when visibleWhen rule is true", function () {
      var testField = _extends({}, field, { visibleWhen: [aIs1] });
      expect((0, _utils.isVisible)(testField, fieldsById)).toBe(true);
    });
    test("return false when visibleWhen rule is false", function () {
      var testField = _extends({}, field, { visibleWhen: [cIs3] });
      expect((0, _utils.isVisible)(testField, fieldsById)).toBe(false);
    });
    test("returns true when visibleWhenAll rule is true", function () {
      var testField = _extends({}, field, { visibleWhenAll: [aIs1, bIs2] });
      expect((0, _utils.isVisible)(testField, fieldsById)).toBe(true);
    });
    test("return false when visibleWhenAll rule is false", function () {
      var testField = _extends({}, field, { visibleWhenAll: [aIs1, cIs3] });
      expect((0, _utils.isVisible)(testField, fieldsById)).toBe(false);
    });
  });

  describe("isRequired", function () {
    var field = _extends({}, (0, _utils.createField)({
      id: "test",
      name: "test",
      value: "bob"
    }));
    var fieldsById = {
      test: field,
      a: fieldA,
      b: fieldB,
      c: fieldC
    };

    test("returns true when visibleWhen rule is true", function () {
      var testField = _extends({}, field, { requiredWhen: [aIs1] });
      expect((0, _utils.isRequired)(testField, fieldsById)).toBe(true);
    });
    test("return false when visibleWhen rule is false", function () {
      var testField = _extends({}, field, { requiredWhen: [cIs3] });
      expect((0, _utils.isRequired)(testField, fieldsById)).toBe(false);
    });
    test("returns true when visibleWhenAll rule is true", function () {
      var testField = _extends({}, field, { requiredWhenAll: [aIs1, bIs2] });
      expect((0, _utils.isRequired)(testField, fieldsById)).toBe(true);
    });
    test("return false when visibleWhenAll rule is false", function () {
      var testField = _extends({}, field, { requiredWhenAll: [aIs1, cIs3] });
      expect((0, _utils.isRequired)(testField, fieldsById)).toBe(false);
    });
  });

  describe("isDisabled", function () {
    var field = _extends({}, (0, _utils.createField)({
      id: "test",
      name: "test",
      value: "bob"
    }));
    var fieldsById = {
      test: field,
      a: fieldA,
      b: fieldB,
      c: fieldC
    };

    test("returns true when visibleWhen rule is true", function () {
      var testField = _extends({}, field, { disabledWhen: [aIs1] });
      expect((0, _utils.isDisabled)(testField, fieldsById)).toBe(true);
    });
    test("return false when visibleWhen rule is false", function () {
      var testField = _extends({}, field, { disabledWhen: [cIs3] });
      expect((0, _utils.isDisabled)(testField, fieldsById)).toBe(false);
    });
    test("returns true when visibleWhenAll rule is true", function () {
      var testField = _extends({}, field, { disabledWhenAll: [aIs1, bIs2] });
      expect((0, _utils.isDisabled)(testField, fieldsById)).toBe(true);
    });
    test("return false when visibleWhenAll rule is false", function () {
      var testField = _extends({}, field, { disabledWhenAll: [aIs1, cIs3] });
      expect((0, _utils.isDisabled)(testField, fieldsById)).toBe(false);
    });
  });
});

describe("processFields", function () {
  var triggerField = (0, _utils.createField)({
    id: "triggerField",
    name: "triggerField",
    value: "test"
  });
  var secondTriggerField = (0, _utils.createField)({
    id: "triggerField2",
    name: "triggerField2",
    value: "check"
  });
  var shouldBeVisible = (0, _utils.createField)({
    id: "shouldBeVisible",
    name: "shouldBeVisible",
    visibleWhen: [{
      field: "triggerField",
      is: ["test"]
    }, {
      field: "triggerField2",
      is: ["wtf"]
    }]
  });
  var shouldBeHidden = (0, _utils.createField)({
    id: "shouldBeHidden",
    name: "shouldBeHidden",
    visibleWhen: [{
      field: "triggerField",
      isNot: ["test"]
    }]
  });
  var shouldBeVisible_All = (0, _utils.createField)({
    id: "shouldBeVisible_All",
    name: "shouldBeVisible_All",
    visibleWhenAll: [{
      field: "triggerField",
      is: ["test"]
    }, {
      field: "triggerField2",
      is: ["check"]
    }]
  });
  var shouldBeHidden_All = (0, _utils.createField)({
    id: "shouldBeHidden_All",
    name: "shouldBeHidden_All",
    visibleWhenAll: [{
      field: "triggerField",
      is: ["test"]
    }, {
      field: "triggerField2",
      is: ["moo"]
    }]
  });
  var shouldBeRequired = (0, _utils.createField)({
    id: "shouldBeRequired",
    name: "shouldBeRequired",
    requiredWhen: [{
      field: "triggerField",
      is: ["test"]
    }]
  });
  var shouldBeOptional = (0, _utils.createField)({
    id: "shouldBeOptional",
    name: "shouldBeOptional",
    requiredWhen: [{
      field: "triggerField",
      isNot: ["test"]
    }]
  });

  var shouldBeRequired_All = (0, _utils.createField)({
    id: "shouldBeRequired_All",
    name: "shouldBeRequired_All",
    requiredWhenAll: [{
      field: "triggerField",
      is: ["test"]
    }, {
      field: "triggerField2",
      is: ["check"]
    }]
  });
  var shouldBeOptional_All = (0, _utils.createField)({
    id: "shouldBeOptional_All",
    name: "shouldBeOptional_All",
    requiredWhenAll: [{
      field: "triggerField",
      is: ["woof"]
    }, {
      field: "triggerField2",
      is: ["check"]
    }]
  });
  var shouldBeDisabled = (0, _utils.createField)({
    id: "shouldBeDisabled",
    name: "shouldBeDisabled",
    disabledWhen: [{
      field: "triggerField",
      is: ["test"]
    }]
  });
  var shouldBeEnabled = (0, _utils.createField)({
    id: "shouldBeEnabled",
    name: "shouldBeEnabled",
    disabledWhen: [{
      field: "triggerField",
      isNot: ["test"]
    }]
  });

  var shouldBeDisabled_All = (0, _utils.createField)({
    id: "shouldBeDisabled_All",
    name: "shouldBeDisabled_All",
    disabledWhenAll: [{
      field: "triggerField",
      is: ["test"]
    }, {
      field: "triggerField2",
      is: ["check"]
    }]
  });
  var shouldBeEnabled_All = (0, _utils.createField)({
    id: "shouldBeEnabled_All",
    name: "shouldBeEnabled_All",
    disabledWhenAll: [{
      field: "triggerField",
      isNot: ["test"]
    }, {
      field: "triggerField2",
      is: ["check"]
    }]
  });

  var fields = [triggerField, secondTriggerField, shouldBeVisible, shouldBeHidden, shouldBeRequired, shouldBeOptional, shouldBeDisabled, shouldBeEnabled, shouldBeVisible_All, shouldBeHidden_All, shouldBeRequired_All, shouldBeOptional_All, shouldBeDisabled_All, shouldBeEnabled_All];

  var processedFields = (0, _utils.processFields)(fields, false, false);
  var processedFieldsById = (0, _utils.mapFieldsById)(processedFields);

  test("field should be visible", function () {
    expect(processedFieldsById.shouldBeVisible.visible).toBe(true);
  });
  test("field should be hidden", function () {
    expect(processedFieldsById.shouldBeHidden.visible).toBe(false);
  });
  test("field should be visible (when all rules pass)", function () {
    expect(processedFieldsById.shouldBeVisible_All.visible).toBe(true);
  });
  test("field should be hidden (when one rule fails)", function () {
    expect(processedFieldsById.shouldBeHidden_All.visible).toBe(false);
  });
  test("field should be required", function () {
    expect(processedFieldsById.shouldBeRequired.required).toBe(true);
  });
  test("field should be optional", function () {
    expect(processedFieldsById.shouldBeOptional.required).toBe(false);
  });
  test("field should be required (when all rules pass)", function () {
    expect(processedFieldsById.shouldBeRequired_All.required).toBe(true);
  });
  test("field should be optional (when one rule fails)", function () {
    expect(processedFieldsById.shouldBeOptional_All.required).toBe(false);
  });
  test("field should be disabled", function () {
    expect(processedFieldsById.shouldBeDisabled.disabled).toBe(true);
  });
  test("field should be enabled", function () {
    expect(processedFieldsById.shouldBeEnabled.disabled).toBe(false);
  });
  test("field should be disabled (when all rules pass)", function () {
    expect(processedFieldsById.shouldBeDisabled_All.disabled).toBe(true);
  });
  test("field should be enabled (when one rule fails)", function () {
    expect(processedFieldsById.shouldBeEnabled_All.disabled).toBe(false);
  });

  test("all fields should be disabled when form is disabled", function () {
    var processedFields = (0, _utils.processFields)(fields, true, false);
    var processedFieldsById = (0, _utils.mapFieldsById)(processedFields);
    expect(processedFieldsById.shouldBeVisible.disabled).toBe(true);
    expect(processedFieldsById.shouldBeHidden.disabled).toBe(true);
    expect(processedFieldsById.shouldBeRequired.disabled).toBe(true);
    expect(processedFieldsById.shouldBeOptional.disabled).toBe(true);
  });
});

describe("shouldOmitFieldValue", function () {
  var baseField = {
    id: "TEST",
    value: "foo",
    name: "test",
    type: "text"
  };
  test("value should be omitted when hidden", function () {
    var field = _extends({}, baseField, {
      omitWhenHidden: true,
      visible: false
    });
    expect((0, _utils.shouldOmitFieldValue)(field)).toEqual(true);
  });
  test("value should be included when visible", function () {
    var field = _extends({}, baseField, {
      omitWhenHidden: true,
      visible: true
    });
    expect((0, _utils.shouldOmitFieldValue)(field)).toEqual(false);
  });
  test("value should be ommitted when value matches", function () {
    var field = _extends({}, baseField, {
      omitWhenValueIs: ["foo"]
    });
    expect((0, _utils.shouldOmitFieldValue)(field)).toEqual(true);
  });
  test("value should be included when value does not match", function () {
    var field = _extends({}, baseField, {
      omitWhenValueIs: ["wrong"]
    });
    expect((0, _utils.shouldOmitFieldValue)(field)).toEqual(false);
  });
});

describe("calculateFormValue", function () {
  var baseField = {
    id: "TEST",
    value: "foo",
    name: "test",
    type: "text"
  };
  var field1 = _extends({}, baseField, {
    omitWhenHidden: true,
    visible: false
  });
  var field2 = _extends({}, baseField, {
    id: "TEST2",
    name: "test2",
    value: "bar"
  });
  var field3 = _extends({}, baseField, {
    id: "TEST3",
    name: "test3",
    value: "bob"
  });
  var field4 = _extends({}, baseField, {
    id: "TEST4",
    name: "test3",
    value: "ted"
  });
  var field5 = _extends({}, baseField, {
    id: "TEST5",
    name: "test.dot.notation",
    value: "ted"
  });
  var fieldToTrim = _extends({}, baseField, {
    id: "TEST6",
    name: "testTrim",
    value: "     trimmed     ",
    trimValue: true
  });

  var value = (0, _utils.calculateFormValue)([field1, field2, field3, field4]);
  test("two field values should be omitted", function () {
    expect(Object.keys(value).length).toEqual(2);
  });
  test("hidden field value should not be included", function () {
    expect(value.test).not.toBeDefined();
  });
  test("normal value should be included", function () {
    expect(value.test2).toEqual("bar");
  });
  test("last field wins", function () {
    expect(value.test3).toEqual("ted");
  });

  test("dot-notation names can be provided", function () {
    var value = (0, _utils.calculateFormValue)([field5]);
    expect(value.test.dot.notation).toEqual("ted");
  });

  test("get added and removed values", function () {
    var field1 = _extends({}, baseField, {
      defaultValue: "1,2,3",
      value: ["2", "4", "5"], // HERE BE DRAGONS - will the new value really always be an array?
      valueDelimiter: ",",
      useChangesAsValues: true
    });
    var value = (0, _utils.calculateFormValue)([field1]);
    expect(value.test_added).toEqual("4,5");
    expect(value.test_removed).toEqual("1,3");
  });

  // test("dot-notation values setting", () => {
  //   const field1 = {
  //     name: "some.nested.prop",
  //     ...baseField,
  //     value: "foo"
  //   };
  //   const value = calculateFormValue([field1]);
  //   expect(value.some.nested.prop).toEqual("foo");
  // });

  test("field value can be trimmed", function () {
    var value = (0, _utils.calculateFormValue)([fieldToTrim]);
    expect(value.testTrim).toBe("trimmed");
  });
});

describe("updateFieldValue", function () {
  var field1 = {
    id: "A",
    name: "a",
    type: "text",
    value: "baa"
  };
  var field2 = {
    id: "B",
    name: "b",
    type: "text",
    value: "moo"
  };
  var field3 = {
    id: "C",
    name: "c",
    type: "text",
    value: "woof"
  };

  var fields = (0, _utils.updateFieldValue)("B", "oink", [field1, field2, field3]);
  var fieldsById = (0, _utils.mapFieldsById)(fields);

  test("field is updated with new value", function () {
    expect(fieldsById.B.value).toEqual("oink");
  });
});

describe("joinDelimitedValue", function () {
  test("join with commas", function () {
    expect((0, _utils.joinDelimitedValue)([1, 2, 3], ",")).toEqual("1,2,3");
  });

  test("leave non-array values as-id", function () {
    expect((0, _utils.joinDelimitedValue)("test", ",")).toEqual("test");
  });
});

describe("splitDelimitedValue", function () {
  test("split on commas", function () {
    // NOTE: Always becomes an array of strings
    //       Is this worth parsing?
    expect((0, _utils.splitDelimitedValue)("1,2,3", ",")).toEqual(["1", "2", "3"]);
  });

  test("create an array from an non-delimited value", function () {
    expect((0, _utils.splitDelimitedValue)("test", ",")).toEqual(["test"]);
  });

  test("leave value as is if no delimiter provided", function () {
    expect((0, _utils.splitDelimitedValue)("test")).toEqual("test");
  });

  test("array value remain unchanged", function () {
    expect((0, _utils.splitDelimitedValue)(["one", "two"], ",")).toEqual(["one", "two"]);
  });
});

describe("getMissingItems", function () {
  test("a is missing from [b,c] but is in [a,b,c]", function () {
    expect((0, _utils.getMissingItems)(["b", "c"], ["a", "b", "c"])).toEqual(["a"]);
  });
});

describe("determineChangedValues", function () {
  var field = {
    id: "TEST",
    name: "foo",
    type: "text",
    value: ["a", "c", "e", "f"],
    defaultValue: ["a", "b", "c", "d"]
  };

  var changes = (0, _utils.determineChangedValues)(field);
  test("output structure is correct", function () {
    expect(changes.length).toEqual(2);
    expect(changes[0].name).toEqual("foo_added");
    expect(changes[1].name).toEqual("foo_removed");
  });
  test("e and f were added", function () {
    expect(changes[0].value).toEqual(["e", "f"]);
  });
  test("b and d were removed", function () {
    expect(changes[1].value).toEqual(["b", "d"]);
  });
});

describe("getFirstDefinedValue", function () {
  test("boolean", function () {
    expect((0, _utils.getFirstDefinedValue)(undefined, undefined, false, true)).toEqual(false);
  });
  test("number", function () {
    expect((0, _utils.getFirstDefinedValue)(undefined, 0, 10)).toEqual(0);
  });
});

describe("default value handling", function () {
  var field = {
    id: "WITH_DEFAULT",
    name: "test",
    type: "text",
    defaultValue: "bob"
  };

  test("default value is assigned to value", function () {
    var processedFields = (0, _utils.processFields)([field], false, false);
    expect(processedFields[0].value).toEqual("bob");
  });

  test("Value takes precedence over defaultValue", function () {
    field.value = "ted";
    var processedFields = (0, _utils.processFields)([field], false, false);
    expect(processedFields[0].value).toEqual("ted");
  });

  test("Falsy value takes precedence over defaultValue", function () {
    field.value = false;
    var processedFields = (0, _utils.processFields)([field], false, false);
    expect(processedFields[0].value).toEqual(false);
  });
});

describe("trimming behaviour", function () {
  var value = "   foo     ";
  var field = {
    id: "TO_BE_TRIMMED",
    name: "test",
    type: "text",
    value: value,
    trimValue: true
  };

  test("leading and trailing whitespace is NOT removed from when processed", function () {
    var processedFields = (0, _utils.processFields)([field], false, false);
    var trimmedField = processedFields[0];
    expect(trimmedField.value).toEqual(value);
  });
});

describe("setOptionsInFieldInState", function () {
  var field1 = (0, _utils.createField)({
    id: "a",
    name: "a",
    type: "text"
  });
  var field2 = (0, _utils.createField)({
    id: "b",
    name: "b",
    type: "text"
  });
  var field3 = (0, _utils.createField)({
    id: "c",
    name: "c",
    type: "text"
  });

  var fields = [field1, field2, field3];
  var state = {
    fields: fields,
    value: {},
    isValid: true,
    defaultFields: [],
    disabled: false,
    showValidationBeforeTouched: false
  };

  var options = [{
    items: ["one", "two", "three"]
  }];

  var updatedState = (0, _utils.setOptionsInFieldInState)(state, field2, options);

  test("leaves fields in state with the correct length", function () {
    expect(updatedState.fields).toHaveLength(3);
  });

  test("leaves fields in state in the same order", function () {
    expect(updatedState.fields[0].id).toBe("a");
    expect(updatedState.fields[1].id).toBe("b");
    expect(updatedState.fields[2].id).toBe("c");
  });

  test("assigns options to teh correct field", function () {
    expect(updatedState.fields[0].options).toBeUndefined();
    expect(updatedState.fields[1].options).toBe(options);
    expect(updatedState.fields[2].options).toBeUndefined();
  });

  test("assigns pending options as undefined", function () {
    expect(updatedState.fields[1].pendingOptions).toBeUndefined();
  });
});

describe("getTouchedStateForField", function () {
  test("returns false on reset when touched is true", function () {
    expect((0, _utils.getTouchedStateForField)(true, true)).toBe(false);
  });
  test("returns false on reset when touched is false", function () {
    expect((0, _utils.getTouchedStateForField)(false, true)).toBe(false);
  });
  test("returns false with no reset when touched is false", function () {
    expect((0, _utils.getTouchedStateForField)(false, false)).toBe(false);
  });
  test("returns true with no reset when touched is true", function () {
    expect((0, _utils.getTouchedStateForField)(true, false)).toBe(true);
  });
});