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

var _Form = require("./Form");

var _Form2 = _interopRequireDefault(_Form);

var _FormFragment = require("./FormFragment");

var _FormFragment2 = _interopRequireDefault(_FormFragment);

var _FormContext = require("./FormContext");

var _FormContext2 = _interopRequireDefault(_FormContext);

var _Button = require("./Button");

var _Button2 = _interopRequireDefault(_Button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use((0, _chaiEnzyme2.default)());

_enzyme2.default.configure({ adapter: new _enzymeAdapterReact2.default() });

describe("Context", function () {
  var onFormChange = jest.fn();
  var singleField = [{
    id: "FIELD1",
    name: "prop1",
    defaultValue: "test",
    type: "text"
  }];

  test("provides value", function () {
    var propValue = { prop1: "value1" };
    var value = void 0;
    var form = (0, _enzyme.mount)(_react2.default.createElement(
      _Form2.default,
      {
        defaultFields: singleField,
        onChange: onFormChange,
        value: propValue
      },
      _react2.default.createElement(
        _FormContext2.default.Consumer,
        null,
        function (context) {
          expect(context.value).toEqual(propValue);
        }
      )
    ));
    expect(form.state().value).toEqual(propValue);
  });

  test("FormFragment has the correct value", function () {
    var propValue = { prop1: "value1" };
    var value = void 0;
    var form = (0, _enzyme.mount)(_react2.default.createElement(
      _Form2.default,
      { onChange: onFormChange, value: propValue },
      _react2.default.createElement(_FormFragment2.default, { defaultFields: singleField })
    ));
    expect(form.state().value).toEqual(propValue);
  });

  test("FormFragment has the correct value after props update", function () {
    var propValue = { prop1: "value1" };
    var value = void 0;
    var form = (0, _enzyme.mount)(_react2.default.createElement(
      _Form2.default,
      { onChange: onFormChange, value: propValue },
      _react2.default.createElement(_FormFragment2.default, { defaultFields: singleField })
    ));
    expect(form.state().value.prop1).toEqual("value1");

    form.setProps({ value: { prop1: "value2" } });
    expect(form.state().value.prop1).toEqual("value2");
  });
});

describe("validation warnings", function () {
  var fields = [{
    id: "FIELD1",
    type: "text",
    name: "field1",
    validWhen: {
      matchesRegEx: {
        pattern: "^[\\d]+$",
        message: "Numbers only"
      }
    }
  }];

  var onButtonClick = jest.fn();
  var formValue = {
    field1: "test"
  };

  describe("shown immediately", function () {
    var form = (0, _enzyme.mount)(_react2.default.createElement(
      _Form2.default,
      { value: formValue, showValidationBeforeTouched: true },
      _react2.default.createElement(_FormFragment2.default, { defaultFields: fields }),
      _react2.default.createElement(_Button2.default, { onClick: onButtonClick })
    ));

    test("form state is invalid", function () {
      expect(form.state().isValid).toBe(false);
    });

    test("field should be invalid", function () {
      expect(form.state().fields[0].isValid).toBe(false);
    });

    test("warning is shown when field is invalid", function () {
      expect(form.find("span.errors").length).toBe(1);
    });

    test("warning is displayed as configured", function () {
      expect(form.find("span.errors").text()).toBe("Numbers only");
    });
  });

  describe("shown when touched", function () {
    var form = (0, _enzyme.mount)(_react2.default.createElement(
      _Form2.default,
      { value: formValue },
      _react2.default.createElement(_FormFragment2.default, { defaultFields: fields }),
      _react2.default.createElement(_Button2.default, { onClick: onButtonClick })
    ));

    test("form state is invalid", function () {
      expect(form.state().isValid).toBe(false);
    });

    test("field has not been touched", function () {
      expect(form.state().fields[0].touched).toBe(false);
    });

    test("field should be valid (as it's not been touched)", function () {
      expect(form.state().fields[0].isValid).toBe(true);
    });

    test("button should still be disabled", function () {
      _chai2.default.expect(form.find("button")).to.be.disabled();
    });

    test("field should be discretely invalid (as it's not been touched)", function () {
      expect(form.state().fields[0].isDiscretelyInvalid).toBe(true);
    });

    test("warning is not shown as field has not been touched", function () {
      expect(form.find("span.errors").length).toBe(0);
    });

    test("field should NOT be touched after focus", function () {
      form.find("input").prop("onFocus")();
      expect(form.state().fields[0].touched).toBe(false);
    });

    test("field should be touched after blur", function () {
      form.find("input").prop("onBlur")();
      expect(form.state().fields[0].touched).toBe(true);
    });

    test("field should be invalid", function () {
      expect(form.state().fields[0].isValid).toBe(false);
    });

    test("field has correct error message", function () {
      expect(form.state().fields[0].errorMessages).toBe("Numbers only");
    });

    test("warning now shown as field has been touched", function () {
      form.update();
      expect(form.find("span.errors").length).toBe(1);
    });

    test("warning is displayed as configured", function () {
      expect(form.find("span.errors").text()).toBe("Numbers only");
    });
  });
});

describe("changing form value prop", function () {
  var fields = [{
    id: "FIELD1",
    type: "text",
    name: "field1",
    validWhen: {
      matchesRegEx: {
        pattern: "^[\\d]+$",
        message: "Numbers only"
      }
    }
  }];

  var onButtonClick = jest.fn();
  var formValue1 = {
    field1: "value1"
  };
  var formValue2 = {
    field1: "value2"
  };

  var form = (0, _enzyme.mount)(_react2.default.createElement(
    _Form2.default,
    { value: formValue1 },
    _react2.default.createElement(_FormFragment2.default, { defaultFields: fields })
  ));

  test("field has not been touched", function () {
    expect(form.state().fields[0].touched).toBe(false);
  });

  test("field should NOT be touched after focus", function () {
    form.find("input").prop("onFocus")();
    form.update();
    expect(form.state().fields[0].touched).toBe(false);
  });

  test("field should be touched after blur", function () {
    form.find("input").prop("onBlur")();
    form.update();
    expect(form.state().fields[0].touched).toBe(true);
  });

  test("field should not be touched after form value update", function () {
    form.setProps({ value: formValue2 });
    form.update();
    expect(form.state().fields[0].touched).toBe(false);
  });
});

describe("Form and FormFragment behave the same with defaultFields and value", function () {
  // This example is taken from issue: https://github.com/draperd/react-forms-processor/issues/35
  var fruit = [{
    id: "PICKMORETHANONE",
    name: "fruit",
    label: "Pick some fruit",
    placeholder: "Available fruits...",
    type: "multiselect",
    defaultValue: "apple,banana",
    valueDelimiter: ",",
    options: [{
      items: ["apple", "banana", "kiwi", "melon", "grapefruit", "plum"]
    }]
  }];

  test("Form field has correct value from defaultFields", function () {
    var form = (0, _enzyme.mount)(_react2.default.createElement(_Form2.default, { defaultFields: fruit }));
    var fieldValue = form.find("select").prop("value");
    expect(fieldValue).toEqual(["apple", "banana"]);
  });

  test("FormFragment field has correct value from defaultFields", function () {
    var form = (0, _enzyme.mount)(_react2.default.createElement(
      _Form2.default,
      null,
      _react2.default.createElement(_FormFragment2.default, { defaultFields: fruit })
    ));
    var fieldValue = form.find("select").prop("value");
    expect(fieldValue).toEqual(["apple", "banana"]);
  });

  test("Form field has correct value from value", function () {
    var form = (0, _enzyme.mount)(_react2.default.createElement(_Form2.default, { defaultFields: fruit, value: { fruit: "melon" } }));
    var fieldValue = form.find("select").prop("value");
    expect(fieldValue).toEqual(["melon"]);
  });

  test("FormFragment field has correct value from value", function () {
    var form = (0, _enzyme.mount)(_react2.default.createElement(
      _Form2.default,
      { value: { fruit: "melon" } },
      _react2.default.createElement(_FormFragment2.default, { defaultFields: fruit })
    ));
    var fieldValue = form.find("select").prop("value");
    expect(fieldValue).toEqual(["melon"]);
  });
});