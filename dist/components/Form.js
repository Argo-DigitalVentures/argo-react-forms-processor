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

var _FormFragment = require("./FormFragment");

var _FormFragment2 = _interopRequireDefault(_FormFragment);

var _DefaultField = require("./DefaultField");

var _DefaultField2 = _interopRequireDefault(_DefaultField);

var _utils = require("../utilities/utils");

var _renderer = require("../renderer");

var _renderer2 = _interopRequireDefault(_renderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultFieldsHaveChanged = function defaultFieldsHaveChanged(nextProps, prevState) {
  return !(0, _isEqual2.default)(nextProps.defaultFields, prevState.defaultFields);
};

var valueHasChanged = function valueHasChanged(nextProps, prevState) {
  return nextProps.value && nextProps.value !== prevState.value;
};

var defaultValueHasChanged = function defaultValueHasChanged(nextProps, prevState) {
  return nextProps.value && nextProps.value !== prevState.defaultValue;
};

var formDisabledStateHasChanged = function formDisabledStateHasChanged(nextProps, prevState) {
  return nextProps.disabled !== undefined && nextProps.disabled !== prevState.disabled;
};

var formTouchedBehaviourHasChanged = function formTouchedBehaviourHasChanged(nextProps, prevState) {
  return nextProps.showValidationBeforeTouched !== prevState.showValidationBeforeTouched || nextProps.shouldPersistTouched !== prevState.shouldPersistTouched;
};

var Form = function (_Component) {
  _inherits(Form, _Component);

  function Form(props) {
    _classCallCheck(this, Form);

    var _this = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, props));

    _this.state = {
      fields: [],
      defaultValue: props.value || {},
      value: props.value || {},
      isValid: false,
      defaultFields: [],
      disabled: props.disabled || false,
      showValidationBeforeTouched: !!props.showValidationBeforeTouched,
      shouldPersistTouched: !!props.shouldPersistTouched
    };
    return _this;
  }

  _createClass(Form, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _props$conditionalUpd = this.props.conditionalUpdate,
          conditionalUpdate = _props$conditionalUpd === undefined ? false : _props$conditionalUpd;
      // TODO: This might need some further thought, but it definitely improves performance in the FormBuilder

      if (conditionalUpdate && nextProps.renderer === this.props.renderer && (0, _isEqual2.default)(this.state.fields, nextState.fields) && (0, _isEqual2.default)(this.state.value, nextState.value)) {
        return false;
      }
      return true;
    }
  }, {
    key: "onFieldChange",
    value: function onFieldChange(id, value) {
      var _this2 = this;

      var _props = this.props,
          optionsHandler = _props.optionsHandler,
          validationHandler = _props.validationHandler,
          parentContext = _props.parentContext,
          _props$showValidation = _props.showValidationBeforeTouched,
          showValidationBeforeTouched = _props$showValidation === undefined ? false : _props$showValidation,
          _props$disabled = _props.disabled,
          disabled = _props$disabled === undefined ? false : _props$disabled;
      var fields = this.state.fields;

      fields = (0, _utils.updateFieldTouchedState)(id, true, fields);
      fields = (0, _utils.updateFieldValue)(id, value, fields);
      var nextState = (0, _utils.getNextStateFromFields)({
        fields: fields,
        lastFieldUpdated: id,
        showValidationBeforeTouched: showValidationBeforeTouched,
        formIsDisabled: disabled,
        resetTouchedState: false,
        optionsHandler: optionsHandler,
        validationHandler: validationHandler,
        parentContext: parentContext
      });

      this.setState(function (state, props) {
        return nextState;
      }, function () {
        var onChange = _this2.props.onChange;
        var value = nextState.value,
            isValid = nextState.isValid;

        if (onChange) {
          onChange(value, isValid);
        }
      });
    }
  }, {
    key: "onFieldFocus",
    value: function onFieldFocus(id) {
      // At one stage the plan was to only show validation error messages once a field
      // had been touched, but in reality we only want to show validation messages when
      // a field has been changed OR has been blurred.
      // So now we just want to make sure that callbacks on the form for handling when
      // a field is focused are called.
      var onFieldFocusProp = this.props.onFieldFocus;

      onFieldFocusProp && onFieldFocusProp(id);
    }
  }, {
    key: "onFieldBlur",
    value: function onFieldBlur(id) {
      var _props2 = this.props,
          optionsHandler = _props2.optionsHandler,
          validationHandler = _props2.validationHandler,
          onFieldBlurProp = _props2.onFieldBlur,
          parentContext = _props2.parentContext,
          _props2$showValidatio = _props2.showValidationBeforeTouched,
          showValidationBeforeTouched = _props2$showValidatio === undefined ? false : _props2$showValidatio,
          _props2$disabled = _props2.disabled,
          disabled = _props2$disabled === undefined ? false : _props2$disabled;
      var fields = this.state.fields;

      fields = (0, _utils.updateFieldTouchedState)(id, true, fields);
      var nextState = (0, _utils.getNextStateFromFields)({
        fields: fields,
        showValidationBeforeTouched: showValidationBeforeTouched,
        formIsDisabled: disabled,
        resetTouchedState: false,
        optionsHandler: optionsHandler,
        validationHandler: validationHandler,
        parentContext: parentContext
      });

      this.setState(nextState, function () {
        return onFieldBlurProp && onFieldBlurProp(id);
      });
    }

    // Register field is provided in the context to allow children to register with this form...

  }, {
    key: "registerField",
    value: function registerField(field) {
      var _state = this.state,
          _state$fields = _state.fields,
          fields = _state$fields === undefined ? [] : _state$fields,
          _state$value = _state.value,
          value = _state$value === undefined ? {} : _state$value;
      var _props3 = this.props,
          _props3$showValidatio = _props3.showValidationBeforeTouched,
          showValidationBeforeTouched = _props3$showValidatio === undefined ? false : _props3$showValidatio,
          _props3$disabled = _props3.disabled,
          disabled = _props3$disabled === undefined ? false : _props3$disabled;


      if (fields.find(function (existingField) {
        return field.id === existingField.id;
      })) {
        // Don't register fields twice...
        // console.warn("Field ID already in use", field.id);
      } else {
        fields = (0, _utils.registerField)(field, fields, value);
        this.setState(function (state, props) {
          var optionsHandler = props.optionsHandler,
              validationHandler = props.validationHandler,
              parentContext = props.parentContext;

          var filteredFields = state.fields.filter(function (existingField) {
            return existingField.id !== field.id;
          });
          // let updatedFields = fields.concat(filteredFields);
          var updatedFields = filteredFields.concat(field);
          var nextState = (0, _utils.getNextStateFromFields)({
            fields: updatedFields,
            showValidationBeforeTouched: showValidationBeforeTouched,
            formIsDisabled: disabled,
            resetTouchedState: false,
            optionsHandler: optionsHandler,
            validationHandler: validationHandler,
            parentContext: parentContext
          });
          return _extends({}, nextState);
        });
      }
    }
  }, {
    key: "createFormContext",
    value: function createFormContext() {
      var _state2 = this.state,
          fields = _state2.fields,
          value = _state2.value,
          isValid = _state2.isValid;
      var _props4 = this.props,
          _props4$renderer = _props4.renderer,
          renderer = _props4$renderer === undefined ? _renderer2.default : _props4$renderer,
          optionsHandler = _props4.optionsHandler,
          validationHandler = _props4.validationHandler,
          parentContext = _props4.parentContext,
          _props4$showValidatio = _props4.showValidationBeforeTouched,
          showValidationBeforeTouched = _props4$showValidatio === undefined ? false : _props4$showValidatio,
          _props4$shouldPersist = _props4.shouldPersistTouched,
          shouldPersistTouched = _props4$shouldPersist === undefined ? false : _props4$shouldPersist,
          _props4$conditionalUp = _props4.conditionalUpdate,
          conditionalUpdate = _props4$conditionalUp === undefined ? false : _props4$conditionalUp,
          _props4$disabled = _props4.disabled,
          disabled = _props4$disabled === undefined ? false : _props4$disabled;

      var onFieldChange = this.onFieldChange.bind(this); // TODO: Is this creating a new function each time? Does this result in too many listeners?
      var onFieldFocus = this.onFieldFocus.bind(this); // TODO: See above comment
      var onFieldBlur = this.onFieldBlur.bind(this);

      var context = {
        fields: fields,
        isValid: isValid,
        value: value,
        registerField: this.registerField.bind(this),
        renderer: renderer,
        optionsHandler: optionsHandler,
        options: {},
        onFieldBlur: onFieldBlur,
        onFieldChange: onFieldChange,
        onFieldFocus: onFieldFocus,
        parentContext: parentContext,
        showValidationBeforeTouched: showValidationBeforeTouched,
        shouldPersistTouched: shouldPersistTouched,
        validationHandler: validationHandler,
        conditionalUpdate: conditionalUpdate,
        disabled: disabled
      };
      return context;
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _props5 = this.props,
          children = _props5.children,
          defaultFields = _props5.defaultFields;
      var fields = this.state.fields;


      fields.forEach(function (field) {
        if (field.pendingOptions) {
          field.pendingOptions.then(function (options) {
            return _this3.setState(function (prevState) {
              return (0, _utils.setOptionsInFieldInState)(prevState, field, options);
            });
          });
        }
      });

      var context = this.createFormContext();
      return _react2.default.createElement(
        _FormContext2.default.Provider,
        { value: context },
        defaultFields && _react2.default.createElement(_FormFragment2.default, { defaultFields: fields }),
        children
      );
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var defaultFieldsChange = defaultFieldsHaveChanged(nextProps, prevState);
      var defaultValueChange = defaultValueHasChanged(nextProps, prevState);
      if (defaultFieldsChange || valueHasChanged(nextProps, prevState) || formDisabledStateHasChanged(nextProps, prevState) || formTouchedBehaviourHasChanged(nextProps, prevState)) {
        var fieldsFromState = prevState.fields,
            valueFromState = prevState.value;
        var defaultFieldsFromProps = nextProps.defaultFields,
            valueFromProps = nextProps.value,
            _nextProps$disabled = nextProps.disabled,
            disabled = _nextProps$disabled === undefined ? false : _nextProps$disabled;
        var optionsHandler = nextProps.optionsHandler,
            validationHandler = nextProps.validationHandler,
            parentContext = nextProps.parentContext,
            _nextProps$showValida = nextProps.showValidationBeforeTouched,
            showValidationBeforeTouched = _nextProps$showValida === undefined ? false : _nextProps$showValida;

        // If a new value has been passed to the Form as a prop then it should take precedence over the last calculated state

        var value = valueFromProps || valueFromState || {};

        var defaultFields = defaultFieldsFromProps || fieldsFromState;
        var fields = void 0;
        if (defaultFieldsFromProps && defaultFieldsChange) {
          // This solves the specific case of dynamic validation error messages.
          // When the message changes, the touched state goes to false by default,
          // because defaultFields has changed. When we're changing a validation message,
          // that behaviour is undesirable, because the field needs to be touched so the
          // error message is displayed.
          if (prevState.shouldPersistTouched) {
            defaultFieldsFromProps.forEach(function (fieldFromProp) {
              fieldsFromState.forEach(function (fieldFromState) {
                if (fieldFromProp.id === fieldFromState.id) {
                  fieldFromProp.touched = fieldFromState.touched;
                }
              });
            });
          }
          fields = (0, _utils.registerFields)(defaultFieldsFromProps, value);
        } else {
          // TODO: Ideally we shouldn't need to register to update the value...
          fields = (0, _utils.registerFields)(fieldsFromState, value);
        }

        // We should reset the touched state of all the fields if the value passed as a prop to the form
        // changes...
        var resetTouchedState = defaultValueChange;

        var nextState = (0, _utils.getNextStateFromFields)({
          fields: fields,
          showValidationBeforeTouched: showValidationBeforeTouched,
          formIsDisabled: disabled,
          resetTouchedState: resetTouchedState,
          optionsHandler: optionsHandler,
          validationHandler: validationHandler,
          parentContext: parentContext
        });
        return _extends({}, nextState, {
          defaultFields: defaultFieldsFromProps,
          disabled: disabled,
          showValidationBeforeTouched: showValidationBeforeTouched
        });
      } else {
        return null;
      }
    }
  }]);

  return Form;
}(_react.Component);

exports.default = Form;