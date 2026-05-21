import { Input } from "../../ui/input";
import { FormControl, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { FormFieldProps } from "../../../../types/forms";

const NameField = ({
  field,
  error,
  placeholder = "Enter full name",
  label = "Full name",
  className,
}: FormFieldProps) => {
  return (
    <FormItem className={className}>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          type="text"
          placeholder={placeholder}
          {...field}
          className="h-12 px-4 rounded-lg border-slate-300 bg-white focus-visible:ring-primary focus-visible:border-primary text-base" 
        />
      </FormControl>
      {error && (
        <FormMessage className="text-red-500">{error.message}</FormMessage>
      )}
    </FormItem>
  );
};

export default NameField;
