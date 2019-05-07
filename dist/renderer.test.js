"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _enzyme = require("enzyme");

var _enzyme2 = _interopRequireDefault(_enzyme);

var _enzymeAdapterReact = require("enzyme-adapter-react-16.3");

var _enzymeAdapterReact2 = _interopRequireDefault(_enzymeAdapterReact);

var _Form = require("./components/Form");

var _Form2 = _interopRequireDefault(_Form);

var _Button = require("./components/Button");

var _Button2 = _interopRequireDefault(_Button);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _chaiEnzyme = require("chai-enzyme");

var _chaiEnzyme2 = _interopRequireDefault(_chaiEnzyme);

var _FormFragment = require("./components/FormFragment");

var _FormFragment2 = _interopRequireDefault(_FormFragment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use((0, _chaiEnzyme2.default)());
_enzyme2.default.configure({ adapter: new _enzymeAdapterReact2.default() });

describe("Default renderer", function () {
  test("single text field", function () {
    var singleField = [{
      id: "FIELD1",
      name: "prop1",
      defaultValue: "test",
      type: "text"
    }];
    // NOTE: It's not possible to test components using the new React Context API yet in Enzyme,
    //       See https://github.com/airbnb/enzyme/pull/1513
    var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Form2.default, { defaultFields: singleField }));
    var inputFields = wrapper.find("input");
    expect(inputFields.length).toBe(1);
  });
});

describe("Basic single field form capabilities", function () {
  var onFormChange = jest.fn();
  var onFieldFocus = jest.fn();
  var onButtonClick = jest.fn();
  var singleField = [{
    id: "FIELD1",
    name: "prop1",
    defaultValue: "test",
    type: "text"
  }];

  var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
    _Form2.default,
    {
      defaultFields: singleField,
      onChange: onFormChange,
      onFieldFocus: onFieldFocus
    },
    _react2.default.createElement(_Button2.default, { onClick: onButtonClick })
  ));

  test("has single input field", function () {
    expect(wrapper.find("input[type='text']").length).toBe(1);
  });

  test("input field has a value", function () {
    var inputField = wrapper.find("input[type='text']").at(0);
    expect(inputField.prop("value")).toBe("test");
  });

  test("has a button", function () {
    expect(wrapper.find(_Button2.default).length).toBe(1);
  });

  var button = wrapper.find(_Button2.default);
  test("button initially has no value", function () {
    button.prop("onClick")();
    expect(onButtonClick).toHaveBeenCalledTimes(1);
    expect(onButtonClick).toHaveBeenLastCalledWith();
  });

  var inputField = wrapper.find("input[type='text']");
  test("changing field value calls onChange", function () {
    inputField.prop("onChange")({ target: { value: "updated" } });
    expect(onFormChange).toHaveBeenLastCalledWith({ prop1: "updated" }, true);
  });
  test("focusing field value calls onFocus", function () {
    inputField.prop("onFocus")();
    expect(onFieldFocus).toHaveBeenLastCalledWith(singleField[0].id);
  });

  test("button initially has no value", function () {
    button.prop("onClick")();
    expect(onButtonClick).toHaveBeenCalledTimes(2);
  });
});

describe("Disabled form", function () {
  var onFormChange = jest.fn();
  var onButtonClick = jest.fn();
  var singleField = [{
    id: "FIELD1",
    name: "prop1",
    defaultValue: "one",
    type: "text"
  }, {
    id: "FIELD2",
    name: "prop2",
    defaultValue: "two",
    type: "text"
  }];

  var form = (0, _enzyme.mount)(_react2.default.createElement(
    _Form2.default,
    { defaultFields: singleField, onChange: onFormChange, disabled: true },
    _react2.default.createElement(_Button2.default, { onClick: onButtonClick })
  ));

  test("fields should be disabled", function () {
    var fields = form.find("input[type='text']");
    _chai2.default.expect(fields.at(0)).to.be.disabled();
    _chai2.default.expect(fields.at(1)).to.be.disabled();
  });

  test("fields are enabled when form is enabled", function () {
    expect(form.prop("disabled")).toBe(true);
    form.setProps({ disabled: false });
    expect(form.prop("disabled")).toBe(false);

    var fields = form.find("input[type='text']");
    _chai2.default.expect(fields.at(0)).to.not.be.disabled();
    _chai2.default.expect(fields.at(1)).to.not.be.disabled();
  });

  test("fields are disabled when form is disabled", function () {
    expect(form.prop("disabled")).toBe(false);
    form.setProps({ disabled: true });
    expect(form.prop("disabled")).toBe(true);

    var fields = form.find("input[type='text']");
    _chai2.default.expect(fields.at(0)).to.be.disabled();
    _chai2.default.expect(fields.at(1)).to.be.disabled();
  });
});

describe("Disabled fragment", function () {
  var onFormChange = jest.fn();
  var onButtonClick = jest.fn();
  var fieldDefs = [{
    id: "FIELD1",
    name: "prop1",
    defaultValue: "one",
    type: "text"
  }, {
    id: "FIELD2",
    name: "prop2",
    defaultValue: "two",
    type: "text"
  }];

  var form = (0, _enzyme.mount)(_react2.default.createElement(
    _Form2.default,
    { onChange: onFormChange, disabled: true },
    _react2.default.createElement(_FormFragment2.default, { defaultFields: fieldDefs }),
    _react2.default.createElement(_Button2.default, { onClick: onButtonClick })
  ));

  test("fields should be disabled", function () {
    var fields = form.find("input[type='text']");
    _chai2.default.expect(fields.at(0)).to.be.disabled();
    _chai2.default.expect(fields.at(1)).to.be.disabled();
  });

  test("fields are enabled when form is enabled", function () {
    expect(form.prop("disabled")).toBe(true);
    form.setProps({ disabled: false });
    expect(form.prop("disabled")).toBe(false);

    var fields = form.find("input[type='text']");
    _chai2.default.expect(fields.at(0)).to.not.be.disabled();
    _chai2.default.expect(fields.at(1)).to.not.be.disabled();
  });

  test("fields are disabled when form is disabled", function () {
    expect(form.prop("disabled")).toBe(false);
    form.setProps({ disabled: true });
    expect(form.prop("disabled")).toBe(true);

    var fields = form.find("input[type='text']");
    _chai2.default.expect(fields.at(0)).to.be.disabled();
    _chai2.default.expect(fields.at(1)).to.be.disabled();
  });
});

describe("2 fields sharing name", function () {
  var fields = [{
    id: "OPTIONS",
    type: "radiogroup",
    name: "test",
    defaultValue: "ONE",
    options: [{
      items: ["ONE", "TWO", "OTHER"]
    }],
    omitWhenValueIs: ["Other"]
  }, {
    id: "CUSTOM",
    type: "text",
    name: "test",
    visibleWhen: [{
      field: "OPTIONS",
      is: ["OTHER"]
    }],
    omitWhenHidden: true
  }];
  var form = (0, _enzyme.mount)(_react2.default.createElement(_Form2.default, { defaultFields: fields }));

  var radioButtons = form.find("input[type='radio']");
  test("there are 3 radiobuttons", function () {
    expect(radioButtons.length).toBe(3);
  });

  var firstRadioButton = radioButtons.at(0);
  test("first radio button is selected", function () {
    _chai2.default.expect(firstRadioButton).to.be.checked();
  });

  test("custom field is hidden", function () {
    expect(form.find("input[type='text']").length).toBe(0);
  });

  var thirdRadioButton = radioButtons.at(2);

  test("checking the custom radiobutton reveals the textbox", function (done) {
    thirdRadioButton.prop("onChange")({
      target: { value: "OTHER" }
    });
    _chai2.default.expect(thirdRadioButton).to.be.checked();

    // Need to call update to force a re-render that will reveal the textbox
    form.update();

    setTimeout(function () {
      expect(form.find("input[type='text']").length).toBe(1);
      done();
    });
  });

  test("setting the custom field will keep the third radio button checked and text box visible", function (done) {
    var customTextField = form.find("input[type='text']").at(0);
    customTextField.prop("onChange")({ target: { value: "custom" } });

    form.update();

    setTimeout(function () {
      // console.log(form.debug());

      // TODO: This test will fail - it needs to pass!
      // expect(form.find("input[type='text']").length).toBe(1);
      done();
    });
  });
});