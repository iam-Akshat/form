export interface BaseValidation {
  required?: boolean;
  customError?: string;
}

export interface TextValidation extends BaseValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface NumberValidation extends BaseValidation {
  min?: number;
  max?: number;
}

export interface SelectValidation extends BaseValidation {
  options: Array<{
    label: string;
    value: string | number;
  }>;
}

export type NumberFieldVariant = "years" | "temperature";

export interface BaseField {
  name: string;
  title: string;
  required?: boolean;
  defaultValue?: string | number;
}

export interface TextField extends BaseField {
  type: "text";
  validation?: TextValidation;
}

export interface NumberField extends BaseField {
  type: "number";
  variant?: NumberFieldVariant;
  validation?: NumberValidation;
}

export interface SelectField extends BaseField {
  type: "select";
  validation: SelectValidation;
}

export type FormField = TextField | NumberField | SelectField;

export interface FormConfiguration {
  fields: FormField[];
}
