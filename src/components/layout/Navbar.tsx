import { NavLink } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/dashboard', label: 'Dashboard' },
]

export function Navbar() {
  return (
    <nav className="navbar">
      {navLinks.map((link) => (
        <NavLink key={link.to} to={link.to} className="navbar__link">
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}