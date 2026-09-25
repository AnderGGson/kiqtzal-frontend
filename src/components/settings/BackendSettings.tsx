import { useState } from 'react'
import { getApiBaseUrl, setApiBaseUrl } from '../../config/apiBaseUrl'

export function BackendSettings() {
  const [value, setValue] = useState(getApiBaseUrl())

  const handleSave = () => {
    setApiBaseUrl(value)
    window.location.reload()
  }

  const handleReset = () => {
    setApiBaseUrl('')
    setValue(getApiBaseUrl())
    window.location.reload()
  }

  return (
    <details className="backend-settings">
      <summary>Backend (configuración avanzada)</summary>
      <form
        className="backend-settings__form"
        onSubmit={(event) => {
          event.preventDefault()
          handleSave()
        }}
      >
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="https://…/api"
        />
        <button type="submit">Guardar y recargar</button>
        <button type="button" onClick={handleReset}>
          Usar por defecto
        </button>
      </form>
      <p className="backend-settings__hint">
        Respaldo para la demo: si el backend corre en otra URL (local o túnel), pegalo acá y se
        guarda en este navegador.
      </p>
    </details>
  )
}