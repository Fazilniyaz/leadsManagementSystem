interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  loading?: boolean
  children: React.ReactNode
}

export const Button = ({ variant = 'primary', loading, children, disabled, ...rest }: ButtonProps) => (
  <button
    className={`btn-${variant}`}
    disabled={disabled || loading}
    {...rest}
  >
    {loading ? 'Loading...' : children}
  </button>
)