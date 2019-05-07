"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _validation = require("./validation");

var _utils = require("./utils.js");

var allAreTrueExample = {
  message: "fail",
  conditions: [{
    field: "TRIGGER",
    isNot: {
      values: ["on"]
    }
  }, {
    isNot: {
      values: ["invalid"]
    }
  }]
};

var triggerField = (0, _utils.createField)({
  id: "TRIGGER",
  name: "trigger",
  value: "off"
});

var targetField = (0, _utils.createField)({
  id: "TARGET",
  name: "target",
  value: "valid"
});

var allFields = [triggerField, targetField];

describe("allAreTrue", function () {
  test("should pass when both conditions are true", function () {
    expect((0, _validation.allAreTrue)(_extends({
      value: "valid",
      allFields: allFields
    }, allAreTrueExample))).toBeUndefined();
  });
  test("should fail when one conditions is false", function () {
    triggerField.value = "on";
    expect((0, _validation.allAreTrue)(_extends({
      value: "valid",
      allFields: allFields
    }, allAreTrueExample))).toBe("fail");
  });
});

describe("someAreTrue", function () {
  triggerField.value = "off";
  targetField.value = "valid";
  test("should pass when both conditions are true", function () {
    expect((0, _validation.someAreTrue)(_extends({
      value: "valid",
      allFields: allFields
    }, allAreTrueExample))).toBeUndefined();
  });
  test("should still pass when one condition is false", function () {
    triggerField.value = "on";
    expect((0, _validation.someAreTrue)(_extends({
      value: "valid",
      allFields: allFields
    }, allAreTrueExample))).toBeUndefined();
  });
  test("should fail when both conditions are false", function () {
    triggerField.value = "on";
    targetField.value = "invalid";
    expect((0, _validation.someAreTrue)(_extends({
      value: "invalid",
      allFields: allFields
    }, allAreTrueExample))).toBe("fail");
  });
});

describe("noneAreTrue", function () {
  triggerField.value = "off";
  targetField.value = "valid";
  test("should fail when both conditions are true", function () {
    expect((0, _validation.noneAreTrue)(_extends({
      value: "valid",
      allFields: allFields
    }, allAreTrueExample))).toBe("fail");
  });
  test("should still fail when one condition is false", function () {
    triggerField.value = "on";
    expect((0, _validation.noneAreTrue)(_extends({
      value: "valid",
      allFields: allFields
    }, allAreTrueExample))).toBe("fail");
  });
  test("should pass when both conditions are false", function () {
    triggerField.value = "on";
    targetField.value = "invalid";
    expect((0, _validation.noneAreTrue)(_extends({
      value: "invalid",
      allFields: allFields
    }, allAreTrueExample))).toBeUndefined();
  });
});