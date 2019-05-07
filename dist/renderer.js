"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var mapOptionItems = function mapOptionItems(optionGroupItems) {
  return optionGroupItems.map(function (item) {
    if (typeof item === "string") {
      return _react2.default.createElement(
        "option",
        { key: item, value: item },
        item
      );
    } else {
      return _react2.default.createElement(
        "option",
        { key: item.value, value: item.value },
        item.label || item.value
      );
    }
  });
};

var renderSelect = function renderSelect(field, _onChange, onFieldFocus, onFieldBlur, multiple) {
  var disabled = field.disabled,
      id = field.id,
      name = field.name,
      required = field.required,
      value = field.value,
      label = field.label,
      _field$options = field.options,
      options = _field$options === undefined ? [] : _field$options,
      valueDelimiter = field.valueDelimiter;


  var items = [];
  options.forEach(function (optionGroup) {
    var heading = optionGroup.heading;

    var optionItems = mapOptionItems(optionGroup.items);
    if (heading) {
      items.push(_react2.default.createElement(
        "optgroup",
        { key: heading, label: heading },
        optionItems
      ));
    } else {
      items = items.concat(optionItems);
    }
  });

  var processedValue = value;
  if (valueDelimiter && typeof value === "string" && multiple) {
    processedValue = value.split(valueDelimiter);
  }

  if (processedValue && !Array.isArray(processedValue) && multiple) {
    processedValue = [processedValue];
  }

  return _react2.default.createElement(
    "div",
    { key: id },
    _react2.default.createElement(
      "label",
      { htmlFor: id },
      label
    ),
    _react2.default.createElement(
      "select",
      {
        multiple: multiple,
        id: id,
        name: name,
        value: processedValue,
        disabled: disabled,
        required: required,
        onFocus: function onFocus() {
          return onFieldFocus(id);
        },
        onBlur: function onBlur() {
          return onFieldBlur(id);
        },
        onChange: function onChange(evt) {
          if (multiple) {
            var _options = evt.target.options;
            var _value = [].concat(_toConsumableArray(evt.target.options)).filter(function (_ref) {
              var selected = _ref.selected;
              return selected;
            }).map(function (_ref2) {
              var value = _ref2.value;
              return value;
            });
            _onChange(id, _value);
          } else {
            _onChange(id, evt.target.value);
          }
        }
      },
      items
    )
  );
};

var renderer = function renderer(field, _onChange2, onFieldFocus, _onFieldBlur) {
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
      label = field.label,
      _field$options2 = field.options,
      options = _field$options2 === undefined ? [] : _field$options2;

  var items = void 0;
  switch (type) {
    case "checkbox":
      return _react2.default.createElement(
        "div",
        { key: id },
        _react2.default.createElement(
          "label",
          { htmlFor: id },
          label
        ),
        _react2.default.createElement("input", {
          type: type,
          id: id,
          name: name,
          value: value,
          placeholder: placeholder,
          disabled: disabled,
          required: required,
          checked: value,
          onChange: function onChange(evt) {
            return _onChange2(id, evt.target.checked);
          },
          onFocus: function onFocus() {
            return onFieldFocus(id);
          },
          onFieldBlur: function onFieldBlur() {
            return _onFieldBlur(id);
          }
        })
      );
    case "select":
      return renderSelect(field, _onChange2, onFieldFocus, _onFieldBlur, false);

    case "multiselect":
      return renderSelect(field, _onChange2, onFieldFocus, _onFieldBlur, true);

    case "radiogroup":
      items = options.reduce(function (itemsSoFar, option) {
        return itemsSoFar.concat(option.items.map(function (item, index) {
          var inputId = id + "_" + index;
          if (typeof item === "string") {
            return _react2.default.createElement(
              "div",
              { key: inputId },
              _react2.default.createElement("input", {
                id: inputId,
                type: "radio",
                name: name,
                value: item,
                checked: item === value,
                onChange: function onChange(evt) {
                  return _onChange2(id, evt.target.value);
                },
                onFocus: function onFocus() {
                  return onFieldFocus(id);
                },
                onBlur: function onBlur() {
                  return _onFieldBlur(id);
                }
              }),
              _react2.default.createElement(
                "label",
                { htmlFor: inputId },
                item
              )
            );
          } else {
            return _react2.default.createElement(
              "div",
              { key: inputId },
              _react2.default.createElement("input", {
                id: inputId,
                type: "radio",
                name: name,
                value: item.value,
                checked: item.value === value,
                onChange: function onChange(evt) {
                  return _onChange2(id, evt.target.value);
                },
                onFocus: function onFocus() {
                  return onFieldFocus(id);
                },
                onBlur: function onBlur() {
                  return _onFieldBlur(id);
                }
              }),
              _react2.default.createElement(
                "label",
                { htmlFor: inputId },
                item.label || item.value
              )
            );
          }
        }));
      }, []);
      return _react2.default.createElement(
        "div",
        { key: id },
        items
      );
    default:
      var checked = type === "checkbox" ? value : undefined;
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
          type: type,
          id: id,
          name: name,
          value: value,
          placeholder: placeholder,
          disabled: disabled,
          required: required,
          checked: checked,
          onChange: function onChange(evt) {
            return _onChange2(id, evt.target.value);
          },
          onFocus: function onFocus() {
            return onFieldFocus(id);
          },
          onBlur: function onBlur() {
            return _onFieldBlur(id);
          }
        }),
        required ? "*" : null,
        !isValid ? _react2.default.createElement(
          "span",
          { className: "errors" },
          errorMessages
        ) : null
      );
  }
};

exports.default = renderer;