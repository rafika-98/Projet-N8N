import { useEffect, useMemo, useState } from 'react'
import DishCard from '../components/DishCard'
import CartSummary from '../components/CartSummary'
import { useAuth } from '../context/AuthContext'

const categories = ['Toutes', 'Entrées', 'Plats', 'Desserts', 'Boissons']

function Menu() {
  const { api } = useAuth()
  const [dishes, setDishes] = useState([])
  const [activeCategory, setActiveCategory] = useState('Toutes')
  const [cart, setCart] = useState([])
  const [contact, setContact] = useState({ customer_name: '', contact: '', notes: '' })
  const [status, setStatus] = useState(null)

  useEffect(() => {
    const fetchDishes = async () => {
      const response = await api.get('/menu/')
      setDishes(response.data)
    }
    fetchDishes()
  }, [api])

  const filteredDishes = useMemo(() => {
    if (activeCategory === 'Toutes') return dishes
    return dishes.filter((dish) => dish.category === activeCategory)
  }, [dishes, activeCategory])

  const handleAddToCart = (dish) => {
    setCart((current) => {
      const existing = current.find((item) => item._id === dish._id)
      if (existing) {
        return current.map((item) =>
          item._id === dish._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...current, { ...dish, quantity: 1 }]
    })
  }

  const handleOrder = async () => {
    if (cart.length === 0) return
    try {
      const payload = {
        ...contact,
        items: cart.map((item) => ({ dish_id: item._id, quantity: item.quantity })),
      }
      await api.post('/orders/', payload)
      setStatus({ type: 'success', message: 'Commande enregistrée !' })
      setCart([])
      setContact({ customer_name: '', contact: '', notes: '' })
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.detail || 'Erreur lors de la commande.' })
    }
  }

  return (
    <section className="container mx-auto px-4 py-12 space-y-8">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-forest">Menu du Gourmet du Sahel</h1>
        <p className="text-forest/70">
          Dix spécialités ouest-africaines, cuisinées avec des produits frais et locaux.
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium border transition ${
                activeCategory === category
                  ? 'bg-forest text-white border-forest'
                  : 'border-forest text-forest hover:bg-forest/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </header>
      <div className="grid gap-8 lg:grid-cols-[3fr_1fr]">
        <div className="grid gap-6 sm:grid-cols-2">
          {filteredDishes.map((dish) => (
            <DishCard key={dish._id} dish={dish} onAdd={handleAddToCart} />
          ))}
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-lg font-semibold text-forest">Informations de retrait</h3>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-forest/80">Nom</label>
                <input
                  type="text"
                  value={contact.customer_name}
                  onChange={(e) => setContact({ ...contact, customer_name: e.target.value })}
                  className="mt-1 w-full rounded border border-desert px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-forest/80">Téléphone ou email</label>
                <input
                  type="text"
                  value={contact.contact}
                  onChange={(e) => setContact({ ...contact, contact: e.target.value })}
                  className="mt-1 w-full rounded border border-desert px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-forest/80">Notes</label>
                <textarea
                  value={contact.notes}
                  onChange={(e) => setContact({ ...contact, notes: e.target.value })}
                  className="mt-1 w-full rounded border border-desert px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                  rows="3"
                />
              </div>
            </div>
          </div>
          <CartSummary cart={cart} onSubmit={handleOrder} />
          {status && (
            <p className={`text-sm ${status.type === 'success' ? 'text-forest' : 'text-red-600'}`}>{status.message}</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default Menu
