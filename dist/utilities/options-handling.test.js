"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _enzyme = require("enzyme");

var _enzyme2 = _interopRequireDefault(_enzyme);

var _enzymeAdapterReact = require("enzyme-adapter-react-16.3");

var _enzymeAdapterReact2 = _interopRequireDefault(_enzymeAdapterReact);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _chaiEnzyme = require("chai-enzyme");

var _chaiEnzyme2 = _interopRequireDefault(_chaiEnzyme);

var _utils = require("./utils");

var _Form = require("../components/Form");

var _Form2 = _interopRequireDefault(_Form);

var _FormFragment = require("../components/FormFragment");

var _FormFragment2 = _interopRequireDefault(_FormFragment);

var _FormContext = require("../components/FormContext");

var _FormContext2 = _interopRequireDefault(_FormContext);

var _Button = require("../components/Button");

var _Button2 = _interopRequireDefault(_Button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use((0, _chaiEnzyme2.default)());
_enzyme2.default.configure({ adapter: new _enzymeAdapterReact2.default() });

describe("shouldOptionsBeRefreshed", function () {
  var optionsShouldNotRefresh = {
    id: "OPTIONS_SHOULD_NOT_CHANGE",
    name: "a",
    type: "select",
    options: [{
      items: ["1"]
    }]
  };

  var optionsShouldBeRefreshed = {
    id: "OPTIONS_SHOULD_REFRESH",
    name: "c",
    type: "select",
    options: [{
      items: ["1"]
    }],
    refreshOptionsOnChangesTo: ["FAKE", "TRIGGER", "COUNTERFEIT"]
  };

  test("options should not be refreshed unless requested", function () {
    expect((0, _utils.shouldOptionsBeRefreshed)({
      lastFieldUpdated: "TRIGGER",
      field: optionsShouldNotRefresh
    })).toBe(false);
  });

  test("options should not be refreshed unless last field change is trigger", function () {
    expect((0, _utils.shouldOptionsBeRefreshed)({
      lastFieldUpdated: "NOPE",
      field: optionsShouldBeRefreshed
    })).toBe(false);
  });

  test("options should refrehs when last field changed is a trigger", function () {
    expect((0, _utils.shouldOptionsBeRefreshed)({
      lastFieldUpdated: "TRIGGER",
      field: optionsShouldBeRefreshed
    })).toBe(true);
  });

  test("returns false when last field changed is undefined", function () {
    expect((0, _utils.shouldOptionsBeRefreshed)({
      field: optionsShouldBeRefreshed
    })).toBe(false);
  });
});

describe("options handler", function () {
  var onFormChange = jest.fn();
  var singleField = [{
    id: "FIELD1",
    name: "prop1",
    type: "text",
    defaultValue: "test"
  }, {
    id: "FIELD2",
    name: "prop2",
    type: "select",
    refreshOptionsOnChangesTo: ["FIELD1"]
  }, {
    id: "FIELD3",
    name: "prop3",
    type: "text",
    defaultValue: "test"
  }];

  var optionsHandler = jest.fn(function (fieldId, fields, parentContext) {
    var options = [{
      items: [{
        label: "A",
        value: "1"
      }, {
        label: "B",
        value: "2"
      }]
    }];
    return options;
  });

  var form = (0, _enzyme.mount)(_react2.default.createElement(_Form2.default, {
    defaultFields: singleField,
    onChange: onFormChange,
    optionsHandler: optionsHandler
  }));

  test("options handler is called initially for each field", function () {
    expect(optionsHandler.mock.calls.length).toBe(3); // Called for each field
  });

  test("options handler is called again when trigger field is updated", function () {
    var inputField = form.find("input[type='text']").at(0);
    inputField.prop("onChange")({ target: { value: "updated" } });
    expect(optionsHandler.mock.calls.length).toBe(4);
  });

  test("options handler is NOT called again if a different field is changed", function () {
    var inputField = form.find("input[type='text']").at(1);
    inputField.prop("onChange")({ target: { value: "updated" } });
    expect(optionsHandler.mock.calls.length).toBe(4);
  });
});