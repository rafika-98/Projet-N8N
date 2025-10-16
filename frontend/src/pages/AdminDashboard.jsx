import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const emptyDish = {
  name: '',
  description: '',
  price: '',
  category: 'Plats',
  image_url: '',
}

function AdminDashboard() {
  const { api, user } = useAuth()
  const [dishes, setDishes] = useState([])
  const [reservations, setReservations] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState(emptyDish)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const [menuRes, reservationRes, ordersRes] = await Promise.all([
          api.get('/menu/'),
          api.get('/reservations/'),
          api.get('/orders/'),
        ])
        setDishes(menuRes.data)
        setReservations(reservationRes.data)
        setOrders(ordersRes.data)
      } catch (error) {
        setMessage(error.response?.data?.detail || "Accès refusé. Connectez-vous en tant qu'admin")
      }
    }

    fetchData()
  }, [api, user])

  const handleDishSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await api.post('/menu/', { ...form, price: Number(form.price) })
      setDishes((current) => [...current, response.data])
      setForm(emptyDish)
      setMessage('Plat ajouté avec succès !')
    } catch (error) {
      setMessage(error.response?.data?.detail || "Impossible d'ajouter le plat")
    }
  }

  return (
    <section className="container mx-auto px-4 py-12 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-forest">Tableau de bord</h1>
        <p className="text-forest/70">Gérez le menu et consultez les réservations et commandes.</p>
        {message && <p className="mt-2 text-sm text-gold">{message}</p>}
      </header>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold text-forest">Ajouter un plat</h2>
          <form onSubmit={handleDishSubmit} className="space-y-3 text-sm">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nom du plat"
              className="w-full rounded border border-desert px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
              required
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description"
              className="w-full rounded border border-desert px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
              rows="3"
              required
            />
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="Prix"
              className="w-full rounded border border-desert px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
              min="500"
              step="100"
              required
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded border border-desert px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="Entrées">Entrées</option>
              <option value="Plats">Plats</option>
              <option value="Desserts">Desserts</option>
              <option value="Boissons">Boissons</option>
            </select>
            <input
              type="url"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="URL de l'image"
              className="w-full rounded border border-desert px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
              required
            />
            <button
              type="submit"
              className="w-full rounded bg-forest px-4 py-2 text-white font-semibold hover:bg-forest/90 transition"
            >
              Ajouter
            </button>
          </form>
        </div>
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold text-forest">Plats existants</h2>
          <ul className="space-y-2 text-sm text-forest/80 max-h-80 overflow-y-auto">
            {dishes.map((dish) => (
              <li key={dish._id} className="flex justify-between border-b border-desert/40 pb-1">
                <span>{dish.name}</span>
                <span className="text-gold font-medium">{dish.price.toLocaleString()} FCFA</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-forest mb-4">Réservations</h2>
          <ul className="space-y-3 text-sm text-forest/80 max-h-96 overflow-y-auto">
            {reservations.map((reservation) => (
              <li key={reservation._id} className="border-b border-desert/30 pb-2">
                <p className="font-semibold text-forest">{reservation.name}</p>
                <p>{reservation.email}</p>
                <p>
                  {reservation.date} • {reservation.time} • {reservation.guests} pers.
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-forest mb-4">Commandes</h2>
          <ul className="space-y-3 text-sm text-forest/80 max-h-96 overflow-y-auto">
            {orders.map((order) => (
              <li key={order._id} className="border-b border-desert/30 pb-2">
                <p className="font-semibold text-forest">{order.customer_name}</p>
                <p>{order.contact}</p>
                <p className="text-forest/70">Statut : {order.status}</p>
                <ul className="pl-4 list-disc">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.dish_id} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default AdminDashboard
