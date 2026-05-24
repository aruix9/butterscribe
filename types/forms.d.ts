import { FieldError, UseFormRegisterReturn } from "react-hook-form";

export interface FormFieldProps {
  field: UseFormRegisterReturn;
  className?: string;
  placeholder?: string;
  label?: string;
  error?: FieldError;
}


export interface PassowrdFieldProps extends FormFieldProps {
  showPassword:boolean
  setShowPassword: (value) => void
}
