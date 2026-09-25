interface TimeWindowSelectorProps {
  id: string
  label: string
  options: readonly { label: string; value: number }[]
  value: number
  onChange: (value: number) => void
}

export function TimeWindowSelector({ id, label, options, value, onChange }: TimeWindowSelectorProps) {
  return (
    <div className="time-window">
      <label className="time-window__label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="time-window__select"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
