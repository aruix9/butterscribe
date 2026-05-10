import { Eye, EyeOff } from 'lucide-react'
import { FormFieldProps } from '../../../../types/forms'
import { FormControl, FormItem, FormLabel, FormMessage } from '../../ui/form'
import { Input } from '../../ui/input'

const PasswordField = ({
  field,
  error,
  showPassword,
  setShowPassword,
  placeholder = 'Enter password',
  label = 'Password',
}: FormFieldProps) => {
  return (
    <FormItem className="space-y-2">
      <FormLabel>{label}</FormLabel>
      <FormControl className='relative'>
        <div className='relative'>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            {...field}
            className="h-12 px-4 pr-12 rounded-lg border-slate-300 bg-white focus-visible:ring-primary focus-visible:border-primary text-base"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </FormControl>
      {error && (
        <FormMessage className='text-red-500'>{error.message}</FormMessage>
      )}
    </FormItem>
  )
}

export default PasswordField
