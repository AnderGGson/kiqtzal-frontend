import { useState } from 'react'
import { Link } from 'react-router-dom'
import env from '../config/env'
import qrCodeUrl from "../public/qr-code-k'iq'tzal-svg.svg?url"

export function LandingPage() {
  const publicUrl = env.publicUrl
  const [shareFeedback, setShareFeedback] = useState<string | null>(null)

  async function handleShare() {
    const shareData = {
      title: "K'iq'tzal",
      text: 'Biofiltro vivo para retención de partículas en un ambiente interior.',
      url: publicUrl,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        setShareFeedback('¡Gracias por compartir K’iq’tzal!')
        return
      } catch {
        setShareFeedback(null)
        return
      }
    }

    try {
      await navigator.clipboard.writeText(publicUrl)
      setShareFeedback('Enlace copiado al portapapeles.')
    } catch {
      setShareFeedback('Copia el enlace manualmente para compartirlo.')
    }
  }

  return (
    <section className="landing">
      <h1>K&apos;iq&apos;tzal</h1>
      <p className="landing__subtitle">
        Biofiltro vivo para retención de partículas en un ambiente interior
      </p>

      <p>
        Presenta una solución para mitigar la contaminación por partículas finas PM2.5 y PM10 en
        espacios cerrados, combinando filtración mecánica y degradación biológica mediante planta
        viva (cola de quetzal), fibra de coco, sustrato y grava.
      </p>

      <p className="landing__metric">
        <span className="landing__metric-value">30%–45%</span>
        <span className="landing__metric-label">
          de eficiencia esperada en retención de partículas con el biofiltro vivo
        </span>
      </p>

      <p>
        Dos pares de sensores miden la entrada (sin tratar) y la salida (tratada) para comparar la
        purificación en tiempo real. Consulta el <Link to="/dashboard">dashboard en vivo</Link> o el{' '}
        <Link to="/historial">historial de mediciones</Link>.
      </p>

      <div className="landing__share">
        <h2 className="landing__share-title">¡Comparte este proyecto con tus amigos!</h2>
        <img
          className="landing__qr-image"
          src={qrCodeUrl}
          alt="Código QR de K'iq'tzal para ver las estadísticas en vivo"
          width={260}
          height={260}
        />
        <p className="landing__qr-hint">{publicUrl}</p>
        <div className="landing__share-actions">
          <button type="button" className="button button--cta" onClick={handleShare}>
            Compartir el proyecto
          </button>
          {shareFeedback && (
            <p className="landing__share-feedback" role="status">
              {shareFeedback}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
