import { QRCodeSVG } from 'qrcode.react'
import env from '../config/env'

export function LandingPage() {
  const publicUrl = env.publicUrl ?? window.location.origin

  return (
    <section className="landing">
      <h1>K'iq'tzal</h1>
      <p>Sistema de monitoreo experimental para un biopurificador de aire.</p>
      <p>
        El biofiltro purifica el aire mediante capas: planta cola de quetzal, fibra de coco y
        más. Dos pares de sensores miden la entrada (sin tratar) y la salida (tratada) para
        comparar la purificación en tiempo real.
      </p>
      <p>Escaneá el código QR para ver las estadísticas en vivo.</p>
      <div className="landing__qr">
        <QRCodeSVG value={publicUrl} size={200} bgColor="transparent" />
        <p className="landing__qr-hint">{publicUrl}</p>
      </div>
      <p>
        Consulta el <a href="/dashboard">dashboard en vivo</a> o el{' '}
        <a href="/historial">historial de mediciones</a>.
      </p>
    </section>
  )
}
