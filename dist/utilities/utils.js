"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateFormValue = exports.shouldOmitFieldValue = exports.determineChangedValues = exports.getMissingItems = exports.joinDelimitedValue = exports.splitDelimitedValue = exports.updateFieldValue = exports.updateFieldTouchedState = exports.getFirstDefinedValue = exports.createField = exports.mapFieldsById = exports.processOptions = exports.shouldOptionsBeRefreshed = exports.processFields = exports.isRequired = exports.isDisabled = exports.isVisible = exports.evaluateAnyAndAllRules = exports.getTouchedStateForField = exports.evaluateSomeRules = exports.evaluateAllRules = exports.evaluateRule = exports.valuesMatch = exports.fieldDefIsValid = exports.setOptionsInFieldInState = exports.getNextStateFromFields = exports.registerFields = exports.registerField = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _set = require("lodash/set");

var _set2 = _interopRequireDefault(_set);

var _validation = require("../utilities/validation");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Because this function can be passed with the state of a component form
// it is not mutating the supplied fields array but returning a new instance
// each time, this is less efficient (when passing entire fieldDef arrays to the
// form) but safer when children of forms are registering themselves
var registerField = exports.registerField = function registerField(field, fields, formValue) {
  if (fieldDefIsValid(field, fields)) {
    return fields.concat(field);
  }
  return fields.slice();
};

var registerFields = exports.registerFields = function registerFields(fieldsToValidate, formValue) {
  var fields = [];
  fieldsToValidate.forEach(function (field) {
    if (fieldDefIsValid(field, fields)) {
      var defaultValue = field.defaultValue,
          name = field.name,
          value = field.value,
          valueDelimiter = field.valueDelimiter;

      var initialValue = getFirstDefinedValue(formValue[name], value, defaultValue);

      var fieldToRegister = _extends({}, field, {
        value: splitDelimitedValue(initialValue, valueDelimiter)
      });
      fields.push(fieldToRegister);
    }
  });
  return fields;
};

var getNextStateFromFields = exports.getNextStateFromFields = function getNextStateFromFields(_ref) {
  var fields = _ref.fields,
      lastFieldUpdated = _ref.lastFieldUpdated,
      showValidationBeforeTouched = _ref.showValidationBeforeTouched,
      formIsDisabled = _ref.formIsDisabled,
      resetTouchedState = _ref.resetTouchedState,
      optionsHandler = _ref.optionsHandler,
      validationHandler = _ref.validationHandler,
      parentContext = _ref.parentContext;

  fields = processFields(fields, !!formIsDisabled, resetTouchedState);
  if (optionsHandler) {
    fields = processOptions({
      fields: fields,
      lastFieldUpdated: lastFieldUpdated,
      optionsHandler: optionsHandler,
      parentContext: parentContext
    });
  }

  fields = (0, _validation.validateAllFields)({
    fields: fields,
    showValidationBeforeTouched: showValidationBeforeTouched,
    validationHandler: validationHandler,
    parentContext: parentContext
  });

  var value = calculateFormValue(fields);
  var isValid = fields.every(function (field) {
    return field.isValid;
  });
  var isDiscretelyInvalid = fields.some(function (field) {
    return field.isDiscretelyInvalid;
  });
  var nextState = {
    fields: fields,
    value: value,
    isValid: isValid && !isDiscretelyInvalid
  };
  return nextState;
};

var setOptionsInFieldInState = exports.setOptionsInFieldInState = function setOptionsInFieldInState(prevState, field, options) {
  var fieldIndex = prevState.fields.findIndex(function (prevField) {
    return prevField.id === field.id;
  });

  field.options = options;
  field.pendingOptions = undefined;

  var prevFields = prevState.fields;

  return {
    fields: [].concat(_toConsumableArray(prevFields.slice(0, fieldIndex)), [field], _toConsumableArray(prevFields.slice(fieldIndex + 1)))
  };
};

// A field definition is valid if a field with the same id does not already exist in
// the supplied form state.
// We are assuming that typing takes care that all required attributes are present
var fieldDefIsValid = exports.fieldDefIsValid = function fieldDefIsValid(field, fields) {
  return !fields.some(function (currentField) {
    return currentField.id === field.id;
  });
};

var valuesMatch = exports.valuesMatch = function valuesMatch(a, b) {
  if (a && b) {
    return a.toString() === b.toString();
  } else {
    return a === b;
  }
};

var evaluateRule = exports.evaluateRule = function evaluateRule() {
  var rule = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var targetValue = arguments[1];
  var _rule$is = rule.is,
      is = _rule$is === undefined ? [] : _rule$is,
      _rule$isNot = rule.isNot,
      isNot = _rule$isNot === undefined ? [] : _rule$isNot;

  var hasValidValue = is.length === 0;
  var hasInvalidValue = !!rule.isNot && rule.isNot.length > 0;

  if (hasInvalidValue) {
    hasInvalidValue = isNot.some(function (invalidValue) {
      if (invalidValue.hasOwnProperty("value")) {
        return valuesMatch(invalidValue.value, targetValue);
      } else {
        return valuesMatch(invalidValue, targetValue);
      }
    });
  }

  if (!hasInvalidValue && !hasValidValue) {
    if (rule.is && rule.is.length) {
      hasValidValue = rule.is.some(function (validValue) {
        if (validValue.hasOwnProperty("value")) {
          return valuesMatch(validValue.value, targetValue);
        } else {
          return valuesMatch(validValue, targetValue);
        }
      });
    }
  }
  return hasValidValue && !hasInvalidValue;
};

var evaluateAllRules = exports.evaluateAllRules = function evaluateAllRules(_ref2) {
  var _ref2$rules = _ref2.rules,
      rules = _ref2$rules === undefined ? [] : _ref2$rules,
      _ref2$fieldsById = _ref2.fieldsById,
      fieldsById = _ref2$fieldsById === undefined ? {} : _ref2$fieldsById,
      _ref2$defaultResult = _ref2.defaultResult,
      defaultResult = _ref2$defaultResult === undefined ? true : _ref2$defaultResult;

  var rulesPass = defaultResult;
  if (rules.length) {
    rulesPass = rules.every(function (rule) {
      if (rule.field && fieldsById.hasOwnProperty(rule.field)) {
        return evaluateRule(rule, fieldsById[rule.field].value);
      } else {
        return defaultResult;
      }
    });
  }
  return rulesPass;
};

var evaluateSomeRules = exports.evaluateSomeRules = function evaluateSomeRules(_ref3) {
  var _ref3$rules = _ref3.rules,
      rules = _ref3$rules === undefined ? [] : _ref3$rules,
      _ref3$fieldsById = _ref3.fieldsById,
      fieldsById = _ref3$fieldsById === undefined ? {} : _ref3$fieldsById,
      _ref3$defaultResult = _ref3.defaultResult,
      defaultResult = _ref3$defaultResult === undefined ? true : _ref3$defaultResult;

  var rulesPass = defaultResult;
  if (rules.length) {
    rulesPass = rules.some(function (rule) {
      if (rule.field && fieldsById.hasOwnProperty(rule.field)) {
        return evaluateRule(rule, fieldsById[rule.field].value);
      } else {
        return defaultResult;
      }
    });
  }
  return rulesPass;
};

var getTouchedStateForField = exports.getTouchedStateForField = function getTouchedStateForField(currentState, resetState) {
  if (resetState === true) {
    return false;
  }
  return currentState;
};

var evaluateAnyAndAllRules = exports.evaluateAnyAndAllRules = function evaluateAnyAndAllRules(_ref4) {
  var anyRules = _ref4.anyRules,
      allRules = _ref4.allRules,
      fieldsById = _ref4.fieldsById,
      defaultResult = _ref4.defaultResult;

  if (anyRules.length) {
    return evaluateSomeRules({
      rules: anyRules,
      fieldsById: fieldsById,
      defaultResult: defaultResult
    });
  }
  if (allRules.length) {
    return evaluateAllRules({
      rules: allRules,
      fieldsById: fieldsById,
      defaultResult: defaultResult
    });
  }
  return defaultResult;
};

var isVisible = exports.isVisible = function isVisible(field, fieldsById) {
  var visible = field.visible,
      _field$visibleWhen = field.visibleWhen,
      visibleWhen = _field$visibleWhen === undefined ? [] : _field$visibleWhen,
      _field$visibleWhenAll = field.visibleWhenAll,
      visibleWhenAll = _field$visibleWhenAll === undefined ? [] : _field$visibleWhenAll;

  return evaluateAnyAndAllRules({
    anyRules: visibleWhen,
    allRules: visibleWhenAll,
    fieldsById: fieldsById,
    defaultResult: visible !== false
  });
};

var isDisabled = exports.isDisabled = function isDisabled(field, fieldsById) {
  var defaultDisabled = field.defaultDisabled,
      _field$disabledWhen = field.disabledWhen,
      disabledWhen = _field$disabledWhen === undefined ? [] : _field$disabledWhen,
      _field$disabledWhenAl = field.disabledWhenAll,
      disabledWhenAll = _field$disabledWhenAl === undefined ? [] : _field$disabledWhenAl;

  return evaluateAnyAndAllRules({
    anyRules: disabledWhen,
    allRules: disabledWhenAll,
    fieldsById: fieldsById,
    defaultResult: !!defaultDisabled
  });
};

var isRequired = exports.isRequired = function isRequired(field, fieldsById) {
  var required = field.required,
      _field$requiredWhen = field.requiredWhen,
      requiredWhen = _field$requiredWhen === undefined ? [] : _field$requiredWhen,
      _field$requiredWhenAl = field.requiredWhenAll,
      requiredWhenAll = _field$requiredWhenAl === undefined ? [] : _field$requiredWhenAl;

  return evaluateAnyAndAllRules({
    anyRules: requiredWhen,
    allRules: requiredWhenAll,
    fieldsById: fieldsById,
    defaultResult: !!required
  });
};

var processFields = exports.processFields = function processFields(fields, formIsDisabled) {
  var resetTouchedState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var fieldsById = mapFieldsById(fields);
  var updatedFields = fields.map(function (field) {
    var defaultValue = field.defaultValue,
        value = field.value,
        trimValue = field.trimValue,
        _field$touched = field.touched,
        touched = _field$touched === undefined ? false : _field$touched;


    var processedValue = typeof value !== "undefined" ? value : defaultValue;

    return _extends({}, field, {
      touched: getTouchedStateForField(touched, resetTouchedState),
      value: processedValue,
      visible: isVisible(field, fieldsById),
      required: isRequired(field, fieldsById),
      disabled: formIsDisabled || isDisabled(field, fieldsById)
    });
  });
  return updatedFields;
};

var shouldOptionsBeRefreshed = exports.shouldOptionsBeRefreshed = function shouldOptionsBeRefreshed(_ref5) {
  var lastFieldUpdated = _ref5.lastFieldUpdated,
      field = _ref5.field;
  var refreshOptionsOnChangesTo = field.refreshOptionsOnChangesTo;

  if (lastFieldUpdated && refreshOptionsOnChangesTo) {
    return refreshOptionsOnChangesTo.indexOf(lastFieldUpdated) !== -1;
  }

  return false;
};

var processOptions = exports.processOptions = function processOptions(_ref6) {
  var fields = _ref6.fields,
      lastFieldUpdated = _ref6.lastFieldUpdated,
      optionsHandler = _ref6.optionsHandler,
      parentContext = _ref6.parentContext;

  return fields.map(function (field) {
    var id = field.id,
        options = field.options;

    if (!options || shouldOptionsBeRefreshed({ lastFieldUpdated: lastFieldUpdated, field: field })) {
      var handlerOptions = optionsHandler(id, fields, parentContext);
      if (handlerOptions instanceof Promise) {
        field.options = [];
        field.pendingOptions = handlerOptions;
      } else if (handlerOptions) {
        field.options = handlerOptions;
        field.pendingOptions = undefined;
      }
    }
    return field;
  });
};

var mapFieldsById = exports.mapFieldsById = function mapFieldsById(fields) {
  return fields.reduce(function (map, field) {
    map[field.id] = field;
    return map;
  }, {});
};

// NOTE: Just used for test purposes...
// TODO: Move to test file...
var createField = exports.createField = function createField(field) {
  var _field$id = field.id,
      id = _field$id === undefined ? "" : _field$id,
      _field$name = field.name,
      name = _field$name === undefined ? "" : _field$name,
      _field$type = field.type,
      type = _field$type === undefined ? "" : _field$type,
      _field$placeholder = field.placeholder,
      placeholder = _field$placeholder === undefined ? "" : _field$placeholder,
      _field$value = field.value,
      value = _field$value === undefined ? undefined : _field$value,
      _field$visible = field.visible,
      visible = _field$visible === undefined ? true : _field$visible,
      _field$required = field.required,
      required = _field$required === undefined ? false : _field$required,
      _field$disabled = field.disabled,
      disabled = _field$disabled === undefined ? false : _field$disabled,
      _field$visibleWhen2 = field.visibleWhen,
      visibleWhen = _field$visibleWhen2 === undefined ? [] : _field$visibleWhen2,
      _field$visibleWhenAll2 = field.visibleWhenAll,
      visibleWhenAll = _field$visibleWhenAll2 === undefined ? [] : _field$visibleWhenAll2,
      _field$requiredWhen2 = field.requiredWhen,
      requiredWhen = _field$requiredWhen2 === undefined ? [] : _field$requiredWhen2,
      _field$requiredWhenAl2 = field.requiredWhenAll,
      requiredWhenAll = _field$requiredWhenAl2 === undefined ? [] : _field$requiredWhenAl2,
      _field$disabledWhen2 = field.disabledWhen,
      disabledWhen = _field$disabledWhen2 === undefined ? [] : _field$disabledWhen2,
      _field$disabledWhenAl2 = field.disabledWhenAll,
      disabledWhenAll = _field$disabledWhenAl2 === undefined ? [] : _field$disabledWhenAl2,
      _field$validWhen = field.validWhen,
      validWhen = _field$validWhen === undefined ? {} : _field$validWhen,
      _field$isValid = field.isValid,
      isValid = _field$isValid === undefined ? true : _field$isValid,
      _field$errorMessages = field.errorMessages,
      errorMessages = _field$errorMessages === undefined ? "" : _field$errorMessages,
      _field$touched2 = field.touched,
      touched = _field$touched2 === undefined ? false : _field$touched2;

  return {
    id: id,
    name: name,
    type: type,
    placeholder: placeholder,
    value: value,
    visible: visible,
    required: required,
    disabled: disabled,
    visibleWhen: visibleWhen,
    visibleWhenAll: visibleWhenAll,
    requiredWhen: requiredWhen,
    requiredWhenAll: requiredWhenAll,
    disabledWhen: disabledWhen,
    disabledWhenAll: disabledWhenAll,
    isValid: isValid,
    validWhen: validWhen,
    errorMessages: errorMessages,
    touched: touched
  };
};

var getFirstDefinedValue = exports.getFirstDefinedValue = function getFirstDefinedValue() {
  for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
    values[_key] = arguments[_key];
  }

  var valueToReturn = void 0;
  values.some(function (value) {
    if (typeof value !== "undefined") {
      valueToReturn = value;
      return true;
    }
    return false;
  });
  return valueToReturn;
};

var updateFieldTouchedState = exports.updateFieldTouchedState = function updateFieldTouchedState(id, touched, fields) {
  var fieldsById = mapFieldsById(fields);
  var field = fieldsById[id];
  field.touched = touched;
  return fields;
};

var updateFieldValue = exports.updateFieldValue = function updateFieldValue(id, value, fields) {
  var fieldsById = mapFieldsById(fields);
  var updateValue = typeof value !== "undefined" && value;
  var field = fieldsById[id];
  if (field.omitWhenHidden && !field.visible) {
    console.log("Not updating field value for", field);
  } else {
    field.value = updateValue;
  }
  return fields;
};

var splitDelimitedValue = exports.splitDelimitedValue = function splitDelimitedValue(value, valueDelimiter) {
  if (valueDelimiter) {
    if (typeof value === "string") {
      value = value.split(valueDelimiter);
    } else if (!Array.isArray(value)) {
      value = [];
    }
  }
  return value;
};

var joinDelimitedValue = exports.joinDelimitedValue = function joinDelimitedValue(value, valueDelimiter) {
  if (Array.isArray(value) && valueDelimiter) {
    value = value.join(valueDelimiter);
  }
  return value;
};

var getMissingItems = exports.getMissingItems = function getMissingItems(missingFrom, foundIn) {
  return foundIn.reduce(function (missingItems, item) {
    !missingFrom.includes(item) && missingItems.push(item);
    return missingItems;
  }, []);
};

var determineChangedValues = exports.determineChangedValues = function determineChangedValues(field) {
  var name = field.name,
      defaultValue = field.defaultValue,
      value = field.value,
      valueDelimiter = field.valueDelimiter,
      _field$addedSuffix = field.addedSuffix,
      addedSuffix = _field$addedSuffix === undefined ? "_added" : _field$addedSuffix,
      _field$removedSuffix = field.removedSuffix,
      removedSuffix = _field$removedSuffix === undefined ? "_removed" : _field$removedSuffix;

  var outputValues = [];

  var initialValue = splitDelimitedValue(defaultValue, valueDelimiter);
  if (Array.isArray(initialValue) && Array.isArray(value)) {
    var added = getMissingItems(initialValue, value);
    var removed = getMissingItems(value, initialValue);

    added = joinDelimitedValue(added, valueDelimiter);
    removed = joinDelimitedValue(removed, valueDelimiter);

    outputValues.push({
      name: name + (addedSuffix || "_added"),
      value: added
    }, {
      name: name + (removedSuffix || "_removed"),
      value: removed
    });
  }
  return outputValues;
};

var shouldOmitFieldValue = exports.shouldOmitFieldValue = function shouldOmitFieldValue(field) {
  var omitWhenHidden = field.omitWhenHidden,
      _field$omitWhenValueI = field.omitWhenValueIs,
      omitWhenValueIs = _field$omitWhenValueI === undefined ? [] : _field$omitWhenValueI,
      visible = field.visible,
      value = field.value;

  return omitWhenHidden && !visible || omitWhenValueIs.length !== 0 && omitWhenValueIs.some(function (currValue) {
    return value === currValue;
  });
};

var calculateFormValue = exports.calculateFormValue = function calculateFormValue(fields) {
  return fields.reduce(function (formValue, field) {
    var name = field.name,
        value = field.value,
        trimValue = field.trimValue,
        useChangesAsValues = field.useChangesAsValues;

    if (shouldOmitFieldValue(field)) {
      return formValue;
    } else if (useChangesAsValues) {
      determineChangedValues(field).forEach(function (_ref7) {
        var name = _ref7.name,
            value = _ref7.value;
        return (0, _set2.default)(formValue, name, value);
      });
    } else {
      var processedValue = value;
      if (trimValue && processedValue && typeof processedValue.trim === "function") {
        processedValue = processedValue.trim();
      }
      (0, _set2.default)(formValue, name, processedValue);
    }

    return formValue;
  }, {});
};