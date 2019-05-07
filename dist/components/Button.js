"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactFormsProcessor = require("react-forms-processor");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormButton = function (_React$Component) {
  _inherits(FormButton, _React$Component);

  function FormButton() {
    _classCallCheck(this, FormButton);

    return _possibleConstructorReturn(this, (FormButton.__proto__ || Object.getPrototypeOf(FormButton)).apply(this, arguments));
  }

  _createClass(FormButton, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          isValid = _props.isValid,
          _props$label = _props.label,
          label = _props$label === undefined ? "OK" : _props$label,
          _onClick = _props.onClick,
          _props$value = _props.value,
          value = _props$value === undefined ? {} : _props$value;

      return _react2.default.createElement(
        "button",
        {
          type: "button",
          disabled: !isValid,
          onClick: function onClick() {
            _onClick(value);
          }
        },
        label
      );
    }
  }]);

  return FormButton;
}(_react2.default.Component);

exports.default = function (props) {
  return _react2.default.createElement(
    _reactFormsProcessor.FormContext.Consumer,
    null,
    function (form) {
      return _react2.default.createElement(FormButton, _extends({}, form, props));
    }
  );
};