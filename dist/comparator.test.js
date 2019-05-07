"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DATE_METHODS = undefined;

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

var _renderer = require("./renderer");

var _renderer2 = _interopRequireDefault(_renderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use((0, _chaiEnzyme2.default)());

_enzyme2.default.configure({ adapter: new _enzymeAdapterReact2.default() });

// We want to create a custom renderer that takes numbers as input values but displays them as strings...
var customRenderer = function customRenderer(field, _onChange, onFieldFocus, onFieldBlur) {
  var _field$disabled = field.disabled,
      disabled = _field$disabled === undefined ? false : _field$disabled,
      errorMessages = field.errorMessages,
      id = field.id,
      isValid = field.isValid,
      name = field.name,
      placeholder = field.placeholder,
      required = field.required,
      type = field.type,
      value = field.value,
      label = field.label;

  var items = void 0;
  switch (type) {
    case "date":
      {
        // $FlowFixMe - this is OK, we know the value type...
        var convertedValue = value ? new Date(value).toUTCString() : "";
        return _react2.default.createElement(
          "div",
          { key: id },
          _react2.default.createElement(
            "label",
            { htmlFor: id },
            label,
            " "
          ),
          _react2.default.createElement("input", {
            type: "text",
            id: id,
            name: name,
            value: convertedValue,
            placeholder: placeholder,
            disabled: disabled,
            required: required,
            onChange: function onChange(evt) {
              return _onChange(id, new Date(evt.target.value).getTime());
            },
            onFocus: function onFocus() {
              return onFieldFocus(id);
            },
            onBlur: function onBlur() {
              return onFieldBlur(id);
            }
          }),
          !isValid ? _react2.default.createElement(
            "span",
            { className: "errors" },
            errorMessages
          ) : _react2.default.createElement("span", null)
        );
      }
    default:
      {
        return (0, _renderer2.default)(field, _onChange, onFieldFocus, onFieldBlur);
      }
  }
};

// Set up some values for comparing dates. We want to be able to pass in number values to the renderer but have
// them displayed as strings and for string values to be output to the form as numbers...
var xmasString = "Tue, 25 Dec 2018 00:00:00 GMT";
var xmasDate = new Date(xmasString);
var xmasNumber = xmasDate.getTime();

var newYearsEveString = "Mon, 31 Dec 2018 00:00:00 GMT";
var newYearsEveDate = new Date(newYearsEveString);
var newYearsEveNumber = newYearsEveDate.getTime();

var newYearString = "Tue, 01 Jan 2019 00:00:00 GMT";
var newYearDate = new Date(newYearString);
var newYearNumber = newYearDate.getTime();

describe("custom renderer", function () {
  var fields = [{
    id: "DATE1",
    name: "date1",
    type: "date",
    defaultValue: xmasNumber
  }];
  var form = (0, _enzyme.mount)(_react2.default.createElement(_Form2.default, { defaultFields: fields, renderer: customRenderer }));
  var field = form.find("input");

  test("field parses number to date", function () {
    expect(field.prop("value")).toBe(xmasString);
  });

  test("field outputs string value as number", function () {
    expect(form.state().value.date1).toBe(xmasNumber);
  });

  test("updated field value is coverted to a string", function () {
    field.prop("onChange")({ target: { value: newYearString } });
    expect(form.state().value.date1).toBe(newYearNumber);
  });
});

var firstDateError = "Must be before second date";
var secondDateError = "Must be after first date";

describe("compare date fields", function () {
  var fields = [{
    id: "DATE1",
    name: "date1",
    type: "date",
    required: true,
    validWhen: {
      comparedTo: {
        fields: ["DATE2"],
        is: "SMALLER",
        message: firstDateError
      }
    }
  }, {
    id: "DATE2",
    name: "date2",
    type: "date",
    validWhen: {
      comparedTo: {
        fields: ["DATE1"],
        is: "BIGGER",
        message: secondDateError
      }
    }
  }];
  var form = (0, _enzyme.mount)(_react2.default.createElement(_Form2.default, { defaultFields: fields, renderer: customRenderer }));
  var firstDate = form.find("input").at(0);
  var secondDate = form.find("input").at(1);

  test("form is initially invalid because no dates are set", function () {
    expect(form.state().isValid).toBe(false);

    firstDate.prop("onBlur")();
    secondDate.prop("onBlur")();
    form.update();
    expect(form.state().fields[0].errorMessages).toBe("A value must be provided. Must be before second date");
    expect(form.state().fields[1].errorMessages).toBe("");
  });

  test("warning shown for fields", function () {
    expect(form.find("span.errors").length).toBe(1);
  });

  test("first date becomes valid when set, but form is still invalid because second date is not set", function () {
    firstDate.prop("onChange")({ target: { value: xmasString } });
    expect(form.state().isValid).toBe(false);
  });

  test("second date becomes valid when set and form is valid because both dates are set", function () {
    secondDate.prop("onChange")({ target: { value: newYearsEveString } });
    expect(form.state().isValid).toBe(true);
  });

  test("fields have no errors in form state", function () {
    expect(form.state().fields[0].isValid).toBe(true);
    expect(form.state().fields[0].errorMessages).toBe("");

    expect(form.state().fields[1].isValid).toBe(true);
    expect(form.state().fields[1].errorMessages).toBe("");
  });

  test("setting first date to date after second date causes fields to be invalid", function () {
    firstDate.prop("onChange")({ target: { value: newYearString } });
    expect(form.state().isValid).toBe(false);
    expect(form.state().fields[0].isValid).toBe(false);
    expect(form.state().fields[0].errorMessages).toBe(firstDateError);
  });

  test("setting second date to date before second date causes fields to be invalid", function () {
    secondDate.prop("onChange")({ target: { value: xmasString } });
    expect(form.state().isValid).toBe(false);
    expect(form.state().fields[0].isValid).toBe(false);
    expect(form.state().fields[1].isValid).toBe(false);
    expect(form.state().fields[0].errorMessages).toBe(firstDateError);
    expect(form.state().fields[1].errorMessages).toBe(secondDateError);
  });

  test("updating both dates so first date is before second date makes the form valid", function () {
    firstDate.prop("onChange")({ target: { value: newYearsEveString } });
    secondDate.prop("onChange")({ target: { value: newYearString } });
    expect(form.state().isValid).toBe(true);
    expect(form.state().fields[0].errorMessages).toBe("");
  });

  test("clearing second date makes the form invalid and first date shows an error", function () {
    firstDate.prop("onChange")({ target: { value: newYearsEveString } });
    secondDate.prop("onChange")({ target: { value: "" } });
    expect(form.state().isValid).toBe(false);
    expect(form.state().fields[0].errorMessages).toBe(firstDateError);
    expect(form.state().fields[1].errorMessages).toBe("");
  });
});

// This test was added in an attempt to accurately represent the problem with a failing form...
var DATE_METHODS = exports.DATE_METHODS = {
  AS_EARLY_AS_POSSIBLE: "asEarlyAsPossible",
  RELATIVE_TO_PREVIOUS_RELEASE: "relativeToPreviousRelease",
  FIXED_DATE: "fixedDate",
  AFTER_ALL_ISSUES_ARE_COMPLETED: "afterAllIssuesAreCompleted"
};

var fields = [{
  id: "name",
  type: "text",
  name: "name",
  label: "Name",
  required: true,
  defaultValue: "Default name",
  validWhen: {
    lengthIsLessThan: {
      length: 256,
      message: "Too long"
    }
  }
}, {
  id: "startMethod",
  type: "select",
  name: "startMethod",
  label: "Start method",
  required: true,
  defaultValue: DATE_METHODS.AS_EARLY_AS_POSSIBLE,
  options: [{
    items: [{
      label: "As early as possible",
      value: DATE_METHODS.AS_EARLY_AS_POSSIBLE
    }, {
      label: "Fixed date",
      value: DATE_METHODS.FIXED_DATE
    }]
  }]
}, {
  id: "start",
  type: "date",
  name: "start",
  required: true,
  visibleWhen: [{
    field: "startMethod",
    is: [DATE_METHODS.FIXED_DATE]
  }],
  validWhen: {
    comparedTo: {
      fields: ["end"],
      is: "SMALLER",
      message: "TOO BIG"
    },
    isNot: {
      values: [""],
      message: "EMPTY STRING"
    }
  }
}, {
  id: "endMethod",
  type: "select",
  name: "endMethod",
  label: "End method",
  required: true,
  defaultValue: DATE_METHODS.AFTER_ALL_ISSUES_ARE_COMPLETED,
  options: [{
    items: [{
      label: "After all completed",
      value: DATE_METHODS.AFTER_ALL_ISSUES_ARE_COMPLETED
    }, {
      label: "Fixed date",
      value: DATE_METHODS.FIXED_DATE
    }]
  }]
}, {
  id: "end",
  type: "date",
  name: "end",
  required: true,
  visibleWhen: [{
    field: "endMethod",
    is: [DATE_METHODS.FIXED_DATE]
  }],
  validWhen: {
    comparedTo: {
      fields: ["start"],
      is: "BIGGER",
      message: "TOO SMALL"
    }
  }
}];

describe("complex test case", function () {
  var form = (0, _enzyme.mount)(_react2.default.createElement(_Form2.default, {
    defaultFields: fields,
    renderer: customRenderer,
    showValidationBeforeTouched: true
  }));

  form.update();

  var startMethodField = form.find("select#startMethod").at(0);
  var endMethodField = form.find("select#endMethod").at(0);

  test("form is initially invalid (with default values set)", function () {
    expect(form.state().isValid).toBe(true);
  });

  var fixedStartDateField = void 0;
  test("setting a fixed start date makes form invalid", function (done) {
    startMethodField.prop("onChange")({
      target: { value: DATE_METHODS.FIXED_DATE }
    });
    form.update(); // Need update to force render...

    expect(form.state().isValid).toBe(false);

    setTimeout(function () {
      fixedStartDateField = form.find("input#start").at(0);
      done();
    });
  });

  test("giving the fixed date field a value makes the form valid again", function () {
    fixedStartDateField.prop("onChange")({
      target: { value: newYearsEveString }
    });
    expect(form.state().isValid).toBe(true);
  });

  var fixedEndDateField = void 0;
  test("setting a fixed end date makes the form invalid", function (done) {
    // When the end date comes into play the form should be invalid because it can now be compared against...
    endMethodField.prop("onChange")({ target: { value: "fixedDate" } });
    form.update();

    setTimeout(function () {
      fixedEndDateField = form.find("input#end").at(0);
      done();
    }, 0);
    expect(form.state().isValid).toBe(false);
  });

  test("giving the fixed end date field a value BEFORE the start date keeps the form invalid", function () {
    fixedEndDateField.prop("onChange")({ target: { value: xmasString } });
    expect(form.state().isValid).toBe(false);
  });

  test("giving the fixed end date field a value AFTER the start date makes the form valid", function () {
    fixedEndDateField.prop("onChange")({ target: { value: newYearString } });
    expect(form.state().isValid).toBe(true);
  });
});