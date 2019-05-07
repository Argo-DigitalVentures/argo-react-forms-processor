"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _FormContext = require("./FormContext");

var _FormContext2 = _interopRequireDefault(_FormContext);

var _utils = require("../utilities/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var registerFieldIfNew = function registerFieldIfNew(field, currentFields, registerField) {
  if (currentFields.find(function (existingField) {
    return existingField.id === field.id;
  })) {
    // console.warn("Fragment tried to re-register field", field.id);
  } else {
    registerField(field);
  }
};

var findRegisteredField = function findRegisteredField(fields, targetId) {
  var fieldToRender = fields.find(function (registeredField) {
    return registeredField.id === targetId;
  });
  return fieldToRender;
};

var setFieldValue = function setFieldValue(fieldToRender, defaultDefinition, formValue) {
  var name = defaultDefinition.name,
      omitWhenValueIs = defaultDefinition.omitWhenValueIs,
      value = defaultDefinition.value;

  var formValueForName = formValue[name];
  if (omitWhenValueIs && omitWhenValueIs.find(function (targetValue) {
    return targetValue === formValueForName;
  }) === -1) {
    fieldToRender.value = defaultDefinition.value;
  } else {
    fieldToRender.value = (0, _utils.getFirstDefinedValue)(formValue[name], value);
  }
};

var renderFieldIfVisible = function renderFieldIfVisible(field, props) {
  var _props$defaultFields = props.defaultFields,
      defaultFields = _props$defaultFields === undefined ? [] : _props$defaultFields,
      fields = props.fields,
      onFieldChange = props.onFieldChange,
      onFieldFocus = props.onFieldFocus,
      onFieldBlur = props.onFieldBlur,
      renderer = props.renderer,
      value = props.value;

  var fieldToRender = findRegisteredField(fields, field.id);
  if (fieldToRender && fieldToRender.visible) {
    setFieldValue(fieldToRender, field, value);
    return renderer(fieldToRender, onFieldChange, onFieldFocus, onFieldBlur);
  }
  return null;
};

var FormFragment = function (_Component) {
  _inherits(FormFragment, _Component);

  function FormFragment(props) {
    _classCallCheck(this, FormFragment);

    var _this = _possibleConstructorReturn(this, (FormFragment.__proto__ || Object.getPrototypeOf(FormFragment)).call(this, props));

    var _props$defaultFields2 = props.defaultFields,
        defaultFields = _props$defaultFields2 === undefined ? [] : _props$defaultFields2,
        registerField = props.registerField,
        _props$fields = props.fields,
        fields = _props$fields === undefined ? [] : _props$fields;

    defaultFields.forEach(function (field) {
      return registerFieldIfNew(field, fields, registerField);
    });
    return _this;
  }

  _createClass(FormFragment, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props$defaultFields3 = this.props.defaultFields,
          defaultFields = _props$defaultFields3 === undefined ? [] : _props$defaultFields3;

      var renderedFields = defaultFields.map(function (field) {
        return renderFieldIfVisible(field, _this2.props);
      });

      return _react2.default.createElement(
        _react.Fragment,
        null,
        renderedFields
      );
    }
  }]);

  return FormFragment;
}(_react.Component);

exports.default = function (props) {
  return _react2.default.createElement(
    _FormContext2.default.Consumer,
    null,
    function (form) {
      return _react2.default.createElement(FormFragment, _extends({}, form, props));
    }
  );
};