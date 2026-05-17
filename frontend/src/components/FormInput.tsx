import React from 'react'
import { useController, useFormContext } from 'react-hook-form'
import type { RegisterOptions } from 'react-hook-form'

type Props = {
  name: string
  label?: string
  type?: string
  placeholder?: string
  rules?: RegisterOptions
  className?: string
}

const FormInput: React.FC<Props> = ({ name, label, type = 'text', placeholder, rules, className }) => {
  const { control } = useFormContext()
  const { field, fieldState } = useController({ name, control, rules })

  return (
    <div>
      {label && (
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#888', marginBottom: 8 }}>
          {label}
        </label>
      )}
      <input
        {...field}
        type={type}
        placeholder={placeholder}
        className={className || 'field'}
        aria-invalid={fieldState.error ? 'true' : 'false'}
      />
      {fieldState.error && (
        <div style={{ color: '#f87171', marginTop: 6, fontSize: 13 }}>{fieldState.error.message}</div>
      )}
    </div>
  )
}

export default FormInput
