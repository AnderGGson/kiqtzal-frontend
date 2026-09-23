import { Link } from 'react-router-dom'
import { Navbar } from './Navbar'

export function Header() {
  return (
    <header className="header">
      <Link to="/" className="header__brand">
        K'iq'tzal
      </Link>
      <Navbar />
    </header>
  )
}