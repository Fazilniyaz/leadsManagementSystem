interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = ({ label, error, ...rest }: InputProps) => (
  <div>
    {label && (
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#888', marginBottom: 8 }}>
        {label}
      </label>
    )}
    <input
      {...rest}
      style={{
        borderColor: error ? 'rgba(248,113,113,0.4)' : undefined,
        ...rest.style,
      }}
    />
    {error && (
      <p style={{ fontSize: 12, color: '#f87171', marginTop: 5 }}>{error}</p>
    )}
  </div>
)