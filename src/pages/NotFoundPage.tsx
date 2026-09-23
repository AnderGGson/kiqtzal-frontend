import { Link } from 'react-router-dom'
import { EmptyState } from '../components/common/EmptyState'

export function NotFoundPage() {
  return (
    <section className="not-found">
      <EmptyState title="Página no encontrada" description="La página que buscas no existe." />
      <Link to="/">Volver al inicio</Link>
    </section>
  )
}