"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DefaultField = function (_Component) {
  _inherits(DefaultField, _Component);

  function DefaultField() {
    _classCallCheck(this, DefaultField);

    return _possibleConstructorReturn(this, (DefaultField.__proto__ || Object.getPrototypeOf(DefaultField)).apply(this, arguments));
  }

  _createClass(DefaultField, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          field = _props.field,
          onChange = _props.onChange;
      var name = field.name,
          id = field.id,
          value = field.value,
          type = field.type,
          placeholder = field.placeholder,
          disabled = field.disabled,
          required = field.required;

      var checked = type === "checkbox" ? value : undefined;
      return _react2.default.createElement(
        "div",
        null,
        _react2.default.createElement("input", {
          type: type,
          id: id,
          name: name,
          value: value,
          placeholder: placeholder,
          disabled: disabled,
          required: required,
          checked: checked,
          onChange: function (_onChange) {
            function onChange(_x) {
              return _onChange.apply(this, arguments);
            }

            onChange.toString = function () {
              return _onChange.toString();
            };

            return onChange;
          }(function (evt) {
            return onChange(id, type === "checkbox" ? evt.target.checked : evt.target.value);
          })
        })
      );
    }
  }]);

  return DefaultField;
}(_react.Component);

exports.default = DefaultField;