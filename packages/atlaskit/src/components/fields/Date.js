// @flow
import React from "react";
import { DatePicker } from "@atlaskit/datetime-picker";
import { Field as AkField } from "@atlaskit/form";
import { FieldWrapper } from "react-forms-processor";
import type { Field, FieldDef } from "react-forms-processor";

class AtlaskitDate extends React.Component<Field> {
  render() {
    const {
      description,
      disabled,
      errorMessages,
      id,
      isValid,
      name,
      onFieldChange,
      onFieldFocus,
      placeholder,
      required,
      value,
      label,
      autoFocus
    } = this.props;
    return (
      <AkField
        label={label}
        helperText={description}
        isRequired={required}
        isInvalid={!isValid}
        invalidMessage={errorMessages}
        validateOnBlur={false}
      >
        <DatePicker
          autoComplete="off"
          name={name}
          placeholder={placeholder}
          onChange={value => onFieldChange(id, value)}
          value={value}
          isDisabled={disabled}
          onFocus={() => onFieldFocus(id)}
          autoFocus={autoFocus}
        />
      </AkField>
    );
  }
}

export default (props: FieldDef) => (
  <FieldWrapper {...props}>
    {/* $FlowFixMe */}
    <AtlaskitDate />
  </FieldWrapper>
);
