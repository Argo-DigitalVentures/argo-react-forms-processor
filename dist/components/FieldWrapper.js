"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _isEqual = require("lodash/isEqual");

var _isEqual2 = _interopRequireDefault(_isEqual);

var _FormContext = require("./FormContext");

var _FormContext2 = _interopRequireDefault(_FormContext);

require("./FieldWrapper.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FieldWrapper = function (_React$Component) {
  _inherits(FieldWrapper, _React$Component);

  function FieldWrapper(props) {
    _classCallCheck(this, FieldWrapper);

    var _this = _possibleConstructorReturn(this, (FieldWrapper.__proto__ || Object.getPrototypeOf(FieldWrapper)).call(this, props));

    var registerField = props.registerField,
        onFieldChange = props.onFieldChange,
        fieldDef = _objectWithoutProperties(props, ["registerField", "onFieldChange"]);

    if (registerField) {
      registerField(fieldDef);
    } else {
      console.warn("Could not register field because registerField function was missing", fieldDef);
    }
    return _this;
  }

  _createClass(FieldWrapper, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var conditionalUpdate = nextProps.conditionalUpdate;

      if (nextProps.conditionalUpdate) {
        // TODO: Ideally options, onFieldChange, registerField and fields should NOT be changing - need to investigate this
        var c1 = nextProps.children,
            pc1 = nextProps.parentContext,
            ofc1 = nextProps.onFieldChange,
            off1 = nextProps.onFieldFocus,
            ofb1 = nextProps.onFieldBlur,
            o1 = nextProps.options,
            rf1 = nextProps.registerField,
            f1 = nextProps.fields,
            next = _objectWithoutProperties(nextProps, ["children", "parentContext", "onFieldChange", "onFieldFocus", "onFieldBlur", "options", "registerField", "fields"]);

        var _props = this.props,
            c2 = _props.children,
            pc2 = _props.parentContext,
            ofc2 = _props.onFieldChange,
            off2 = _props.onFieldFocus,
            ofb2 = _props.onFieldBlur,
            o2 = _props.options,
            rf2 = _props.registerField,
            f2 = _props.fields,
            current = _objectWithoutProperties(_props, ["children", "parentContext", "onFieldChange", "onFieldFocus", "onFieldBlur", "options", "registerField", "fields"]);

        // This is causing individually field definitions to fail to be rendered, but without this
        // the form builder performance is poor :(


        if ((0, _isEqual2.default)(next, current)) {
          return false;
        }
      }
      return true;
    }
  }, {
    key: "render",
    value: function render() {
      var _props2 = this.props,
          id = _props2.id,
          _props2$fields = _props2.fields,
          fields = _props2$fields === undefined ? [] : _props2$fields,
          onFieldChange = _props2.onFieldChange,
          onFieldFocus = _props2.onFieldFocus,
          onFieldBlur = _props2.onFieldBlur,
          children = _props2.children;

      var fieldToRender = fields.find(function (field) {
        return field.id === id;
      });
      if (fieldToRender && fieldToRender.visible) {
        var processedChildren = _react2.default.Children.map(children, function (child) {
          return _react2.default.cloneElement(child, _extends({
            onFieldChange: onFieldChange,
            onFieldFocus: onFieldFocus,
            onFieldBlur: onFieldBlur
          }, fieldToRender));
        });
        var description = fieldToRender.description,
            _id = fieldToRender.id;

        return _react2.default.createElement(
          "div",
          { className: "layout", id: _id },
          processedChildren
        );
      }
      return null;
    }
  }]);

  return FieldWrapper;
}(_react2.default.Component);

exports.default = function (props) {
  return _react2.default.createElement(
    _FormContext2.default.Consumer,
    null,
    function (form) {
      return _react2.default.createElement(
        FieldWrapper,
        _extends({}, form, props),
        props.children
      );
    }
  );
};