import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const initialState = {
  name: '',
  email: '',
  date: '',
  time: '',
  guests: 2,
}

function ReservationForm() {
  const { api } = useAuth()
  const [form, setForm] = useState(initialState)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      await api.post('/reservations/', form)
      setStatus({ type: 'success', message: 'Votre réservation est enregistrée !' })
      setForm(initialState)
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.detail || 'Erreur lors de la réservation.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-lg shadow p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-forest">Nom</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded border border-desert px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-forest">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1 w-full rounded border border-desert px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-forest">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="mt-1 w-full rounded border border-desert px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-forest">Heure</label>
          <input
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="mt-1 w-full rounded border border-desert px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-forest">Nombre de personnes</label>
          <input
            type="number"
            min="1"
            max="20"
            value={form.guests}
            onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
            className="mt-1 w-full rounded border border-desert px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-forest px-4 py-2 text-white font-semibold hover:bg-forest/90 transition disabled:opacity-60"
      >
        {loading ? 'Envoi en cours...' : 'Réserver'}
      </button>
      {status && (
        <p className={`text-sm ${status.type === 'success' ? 'text-forest' : 'text-red-600'}`}>{status.message}</p>
      )}
    </form>
  )
}

export default ReservationForm
