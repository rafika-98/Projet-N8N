import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout, login, register } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', full_name: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      if (isRegister) {
        await register({ ...form, role: 'user' })
      } else {
        await login(form.email, form.password)
      }
      setShowAuth(false)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Une erreur est survenue')
    }
  }

  return (
    <header className="bg-forest text-white shadow-md">
      <div className="container mx-auto flex flex-wrap items-center justify-between px-4 py-4">
        <Link to="/" className="text-2xl font-bold text-gold">
          Le Gourmet du Sahel
        </Link>
        <nav className="flex items-center gap-4 text-sm sm:text-base">
          <Link to="/" className="hover:text-gold transition-colors">
            Accueil
          </Link>
          <Link to="/menu" className="hover:text-gold transition-colors">
            Menu
          </Link>
          <Link to="/reservation" className="hover:text-gold transition-colors">
            Réservation
          </Link>
          <Link to="/contact" className="hover:text-gold transition-colors">
            Contact
          </Link>
          {user ? (
            <>
              <Link to="/admin" className="hover:text-gold transition-colors">
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="rounded bg-gold px-3 py-1 text-forest font-semibold hover:bg-yellow-400 transition"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="rounded bg-gold px-3 py-1 text-forest font-semibold hover:bg-yellow-400 transition"
            >
              Connexion
            </button>
          )}
        </nav>
      </div>
      {showAuth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-forest rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isRegister ? "Créer un compte" : 'Connexion'}
              </h2>
              <button onClick={() => setShowAuth(false)} className="text-gray-500 hover:text-forest">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-sm font-medium">Nom complet</label>
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    className="mt-1 w-full rounded border border-desert px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full rounded border border-desert px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Mot de passe</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="mt-1 w-full rounded border border-desert px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                  required
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full rounded bg-forest px-4 py-2 text-white font-semibold hover:bg-forest/90 transition"
              >
                {isRegister ? "S'inscrire" : 'Se connecter'}
              </button>
            </form>
            <p className="mt-4 text-sm text-center">
              {isRegister ? 'Déjà un compte ?' : "Pas encore de compte ?"}{' '}
              <button
                onClick={() => setIsRegister((value) => !value)}
                className="text-gold font-semibold"
              >
                {isRegister ? 'Se connecter' : "Créer un compte"}
              </button>
            </p>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
