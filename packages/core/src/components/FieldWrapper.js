// @flow
import React, { type Node } from "react";
import isEqual from "lodash/isEqual";
import FormContext from "./FormContext";
import type { Field, FieldDef } from "../../../../types";
import "./FieldWrapper.css";

export type FieldWrapperProps = Field & {
  children: Node
};

class FieldWrapper extends React.Component<FieldWrapperProps> {
  constructor(props: FieldWrapperProps) {
    super(props);
    const { registerField, onFieldChange, ...fieldDef } = props;
    if (registerField) {
      registerField(fieldDef);
    } else {
      console.warn(
        "Could not register field because registerField function was missing",
        fieldDef
      );
    }
  }

  shouldComponentUpdate(nextProps: FieldWrapperProps, nextState) {
    // TODO: Ideally options, onFieldChange, registerField and fields should NOT be changing - need to investigate this
    const {
      children: c1,
      // $FlowFixMe - not sure why parentContext is not apprearing in type
      parentContext: pc1,
      onFieldChange: ofc1,
      onFieldFocus: off1,
      options: o1,
      registerField: rf1,
      fields: f1,
      ...next
    } = nextProps;
    const {
      children: c2,
      // $FlowFixMe
      parentContext: pc2,
      onFieldChange: ofc2,
      onFieldFocus: off2,
      options: o2,
      registerField: rf2,
      fields: f2,
      ...current
    } = this.props;

    // This is causing individually field definitions to fail to be rendered, but without this
    // the form builder performance is poor :(
    if (isEqual(next, current)) {
      return false;
    }

    // Commented out - left the code in case I want to dig further into this issue
    // Object.keys(next).forEach(key => {
    //   if (next[key] !== current[key]) {
    //     console.debug("The value of this key does not match", key);
    //   }
    // });
    return true;
  }

  render() {
    const {
      id,
      fields = [],
      onFieldChange,
      onFieldFocus,
      children
    } = this.props;
    const fieldToRender = fields.find(field => field.id === id);
    if (fieldToRender && fieldToRender.visible) {
      const processedChildren = React.Children.map(children, child =>
        React.cloneElement(child, {
          onFieldChange,
          onFieldFocus,
          ...fieldToRender
        })
      );
      const { description, id } = fieldToRender;
      return (
        <div className="layout" id={id}>
          {processedChildren}
        </div>
      );
    }
    return null;
  }
}

export default (props: FieldDef & { children: Node }) => (
  <FormContext.Consumer>
    {form => {
      return (
        <FieldWrapper {...form} {...props}>
          {props.children}
        </FieldWrapper>
      );
    }}
  </FormContext.Consumer>
);
